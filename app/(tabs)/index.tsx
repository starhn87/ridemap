import { StyleSheet, View, Pressable, Text, Alert } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import Mapbox from '@rnmapbox/maps';
import type { MapView } from '@rnmapbox/maps';
import * as Location from 'expo-location';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  FadeIn,
} from 'react-native-reanimated';

import '@/lib/mapbox';
import { MAP_STYLE, DEFAULT_CENTER, DEFAULT_ZOOM } from '@/constants/mapStyle';
import { MOCK_PLACES } from '@/constants/mockPlaces';
import { useMapStore } from '@/stores/useMapStore';
import { useNearbyPlaces } from '@/hooks/usePlaces';
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
  const [mapReady, setMapReady] = useState(false);
  const [route, setRoute] = useState<Route | null>(null);
  const [navigating, setNavigating] = useState(false);
  const cameraRef = useRef<Mapbox.Camera>(null);

  const { data: supabasePlaces } = useNearbyPlaces(activeFilter);

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

  const filteredPlaces = supabasePlaces?.length
    ? supabasePlaces
    : activeFilter
      ? MOCK_PLACES.filter((p) => p.category === activeFilter)
      : MOCK_PLACES;

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
        setNavigating(true);
        setSelectedPlace(null);
        setSelectedPlaceId(null);

        // 경로가 보이도록 카메라 조정
        if (result.geometry.length > 0) {
          const lngs = result.geometry.map((c) => c[0]);
          const lats = result.geometry.map((c) => c[1]);
          const ne: [number, number] = [Math.max(...lngs), Math.max(...lats)];
          const sw: [number, number] = [Math.min(...lngs), Math.min(...lats)];

          cameraRef.current?.fitBounds(ne, sw, [80, 80, 200, 80], 1000);
        }
      } catch (error: any) {
        Alert.alert('경로 오류', error.message ?? '경로를 찾을 수 없습니다.');
      }
    },
    [userLocation, setSelectedPlaceId]
  );

  const handleRouteClose = useCallback(() => {
    setRoute(null);
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
      cameraRef.current?.setCamera({
        centerCoordinate: [userLocation.longitude, userLocation.latitude],
        zoomLevel: 14,
        animationDuration: 800,
      });
    }
  };

  const centerCoord = userLocation
    ? [userLocation.longitude, userLocation.latitude]
    : DEFAULT_CENTER;

  return (
    <View style={styles.container}>
      <Mapbox.MapView
        style={styles.map}
        styleURL={colorScheme === 'dark' ? MAP_STYLE.dark : MAP_STYLE.light}
        logoEnabled={false}
        attributionEnabled={false}
        compassEnabled
        compassPosition={{ top: 100, right: 16 }}
        onDidFinishLoadingMap={() => setMapReady(true)}>
        <Mapbox.Camera
          ref={cameraRef}
          zoomLevel={DEFAULT_ZOOM}
          centerCoordinate={centerCoord as [number, number]}
          animationMode="flyTo"
          animationDuration={1000}
        />

        <Mapbox.LocationPuck
          puckBearing="heading"
          puckBearingEnabled
          visible
        />

        {mapReady &&
          filteredPlaces.map((place) => (
            <PlaceMarker
              key={place.id}
              place={place}
              isSelected={selectedPlaceId === place.id}
              onPress={() => handleMarkerPress(place)}
            />
          ))}

        {route && <RouteLine route={route} />}
      </Mapbox.MapView>

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

      {navigating && route && (
        <RouteInfoCard route={route} onClose={handleRouteClose} />
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
