import { StyleSheet, View, Pressable, Text } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import Mapbox from '@rnmapbox/maps';
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
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import CategoryFilter from '@/components/map/CategoryFilter';
import PlaceMarker from '@/components/map/PlaceMarker';
import PlaceBottomSheet from '@/components/map/PlaceBottomSheet';
import type { Place } from '@/types';

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

  const filteredPlaces = activeFilter
    ? MOCK_PLACES.filter((p) => p.category === activeFilter)
    : MOCK_PLACES;

  const handleMarkerPress = useCallback(
    (place: Place) => {
      setSelectedPlaceId(place.id);
      setSelectedPlace(place);
    },
    [setSelectedPlaceId]
  );

  const handleBottomSheetClose = useCallback(() => {
    setSelectedPlaceId(null);
    setSelectedPlace(null);
  }, [setSelectedPlaceId]);

  const myLocationScale = useSharedValue(1);
  const myLocationStyle = useAnimatedStyle(() => ({
    transform: [{ scale: myLocationScale.value }],
  }));

  const handleMyLocation = () => {
    myLocationScale.value = withSpring(0.85, {}, () => {
      myLocationScale.value = withSpring(1);
    });
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
      </Mapbox.MapView>

      <Animated.View
        entering={FadeIn.duration(300)}
        style={[styles.filterContainer, { top: 60 }]}>
        <CategoryFilter />
      </Animated.View>

      <AnimatedPressable
        onPress={handleMyLocation}
        style={[
          styles.myLocationButton,
          myLocationStyle,
          {
            backgroundColor: colors.background,
            shadowColor: '#000',
          },
        ]}>
        <Text style={styles.myLocationIcon}>📍</Text>
      </AnimatedPressable>

      <PlaceBottomSheet
        place={selectedPlace}
        onClose={handleBottomSheetClose}
      />
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
    bottom: 120,
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
