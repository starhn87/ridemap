import { View, Text, StyleSheet } from 'react-native';
import { NaverMapMarkerOverlay } from '@mj-studio/react-native-naver-map';

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
    <NaverMapMarkerOverlay
      latitude={place.latitude}
      longitude={place.longitude}
      onTap={onPress}
      anchor={{ x: 0.5, y: 1 }}
      width={44}
      height={44}>
      <View
        collapsable={false}
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
    </NaverMapMarkerOverlay>
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
