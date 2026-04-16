import { StyleSheet, View, Pressable, Text, Alert } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { NaverMapView } from '@mj-studio/react-native-naver-map';
import type { NaverMapViewRef } from '@mj-studio/react-native-naver-map';
import * as Location from 'expo-location';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  FadeIn,
} from 'react-native-reanimated';

import { DEFAULT_CENTER, DEFAULT_ZOOM } from '@/constants/mapStyle';
import { MOCK_PLACES } from '@/constants/mockPlaces';
import { useMapStore } from '@/stores/useMapStore';
import { usePlaces } from '@/hooks/usePlaces';
import { fetchRoute } from '@/lib/api/directions';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import CategoryFilter from '@/components/map/CategoryFilter';
import PlaceMarker from '@/components/map/PlaceMarker';
import PlaceBottomSheet from '@/components/map/PlaceBottomSheet';
import RouteLine from '@/components/map/RouteLine';
import RouteInfoCard from '@/components/map/RouteInfoCard';
import type { Place } from '@/types';
import type { Route } from '@/lib/api/directions';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function MapScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const {
    userLocation,
    selectedPlaceId,
    activeFilter,
    setUserLocation,
    setSelectedPlaceId,
  } = useMapStore();

  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [routePlace, setRoutePlace] = useState<Place | null>(null);
  const [navigating, setNavigating] = useState(false);
  const mapRef = useRef<NaverMapViewRef>(null);

  const { data: supabasePlaces } = usePlaces(activeFilter);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, [setUserLocation]);

  const places = supabasePlaces ?? MOCK_PLACES;

  const handleMarkerPress = useCallback(
    (place: Place) => {
      if (navigating) return;
      setSelectedPlaceId(place.id);
      setSelectedPlace(place);
    },
    [setSelectedPlaceId, navigating]
  );

  const handleBottomSheetClose = useCallback(() => {
    setSelectedPlaceId(null);
    setSelectedPlace(null);
  }, [setSelectedPlaceId]);

  const handleNavigate = useCallback(
    async (place: Place) => {
      if (!userLocation) {
        Alert.alert('알림', '현재 위치를 확인할 수 없습니다.');
        return;
      }

      try {
        const result = await fetchRoute(
          [userLocation.longitude, userLocation.latitude],
          [place.longitude, place.latitude]
        );

        setRoute(result);
        setRoutePlace(place);
        setNavigating(true);
        setSelectedPlace(null);
        setSelectedPlaceId(null);

        // 경로가 보이도록 카메라 조정
        if (result.geometry.length > 0) {
          const lngs = result.geometry.map((c) => c[0]);
          const lats = result.geometry.map((c) => c[1]);

          mapRef.current?.animateCameraTo({
            latitude: (Math.max(...lats) + Math.min(...lats)) / 2,
            longitude: (Math.max(...lngs) + Math.min(...lngs)) / 2,
            zoom: 10,
            duration: 1000,
          });
        }
      } catch (error: any) {
        Alert.alert('경로 오류', error.message ?? '경로를 찾을 수 없습니다.');
      }
    },
    [userLocation, setSelectedPlaceId]
  );

  const handleRouteClose = useCallback(() => {
    setRoute(null);
    setRoutePlace(null);
    setNavigating(false);
  }, []);

  const myLocationScale = useSharedValue(1);
  const myLocationStyle = useAnimatedStyle(() => ({
    transform: [{ scale: myLocationScale.value }],
  }));

  const handleMyLocation = () => {
    myLocationScale.value = withSpring(0.85, {}, () => {
      myLocationScale.value = withSpring(1);
    });
    if (userLocation) {
      mapRef.current?.animateCameraTo({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        zoom: 14,
        duration: 800,
      });
    }
  };

  const initialCamera = {
    latitude: userLocation?.latitude ?? DEFAULT_CENTER[1],
    longitude: userLocation?.longitude ?? DEFAULT_CENTER[0],
    zoom: DEFAULT_ZOOM,
  };

  return (
    <View style={styles.container}>
      <NaverMapView
        ref={mapRef}
        style={styles.map}
        mapType="Basic"
        isNightModeEnabled={colorScheme === 'dark'}
        isShowLocationButton={false}
        isShowCompass
        isShowScaleBar={false}
        isShowZoomControls={false}
        initialCamera={initialCamera}
        locale="ko">
        {places.map((place) => (
          <PlaceMarker
            key={place.id}
            place={place}
            isSelected={selectedPlaceId === place.id}
            onPress={() => handleMarkerPress(place)}
          />
        ))}

        {route && <RouteLine route={route} />}
      </NaverMapView>

      {!navigating && (
        <Animated.View
          entering={FadeIn.duration(300)}
          style={[styles.filterContainer, { top: 60 }]}>
          <CategoryFilter />
        </Animated.View>
      )}

      <AnimatedPressable
        onPress={handleMyLocation}
        style={[
          styles.myLocationButton,
          myLocationStyle,
          {
            backgroundColor: colors.background,
            shadowColor: '#000',
            bottom: navigating ? 200 : 120,
          },
        ]}>
        <Text style={styles.myLocationIcon}>📍</Text>
      </AnimatedPressable>

      {!navigating && (
        <PlaceBottomSheet
          place={selectedPlace}
          onClose={handleBottomSheetClose}
          onNavigate={handleNavigate}
        />
      )}

      {navigating && route && routePlace && (
        <RouteInfoCard route={route} place={routePlace} onClose={handleRouteClose} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  filterContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
  },
  myLocationButton: {
    position: 'absolute',
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  myLocationIcon: {
    fontSize: 20,
  },
});
