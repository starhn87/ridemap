import { View, Text, StyleSheet } from 'react-native';
import Mapbox from '@rnmapbox/maps';

import { CATEGORIES } from '@/constants/categories';
import type { Place } from '@/types';

interface Props {
  place: Place;
  isSelected: boolean;
  onPress: () => void;
}

export default function PlaceMarker({ place, isSelected, onPress }: Props) {
  const category = CATEGORIES[place.category];

  return (
    <Mapbox.PointAnnotation
      id={place.id}
      coordinate={[place.longitude, place.latitude]}
      onSelected={onPress}>
      <View
        style={[
          styles.marker,
          {
            backgroundColor: category.color,
            borderWidth: isSelected ? 3 : 0,
            borderColor: '#FFFFFF',
            transform: [{ scale: isSelected ? 1.2 : 1 }],
          },
        ]}>
        <Text style={styles.markerIcon}>{category.icon}</Text>
      </View>
    </Mapbox.PointAnnotation>
  );
}

const styles = StyleSheet.create({
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  markerIcon: {
    fontSize: 18,
  },
});
