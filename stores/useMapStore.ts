import { create } from 'zustand';
import type { PlaceCategory } from '@/types';

interface Location {
  latitude: number;
  longitude: number;
}

interface MapStore {
  userLocation: Location | null;
  selectedPlaceId: string | null;
  activeFilter: PlaceCategory | null;
  setUserLocation: (location: Location) => void;
  setSelectedPlaceId: (id: string | null) => void;
  setActiveFilter: (filter: PlaceCategory | null) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  userLocation: null,
  selectedPlaceId: null,
  activeFilter: null,
  setUserLocation: (location) => set({ userLocation: location }),
  setSelectedPlaceId: (id) => set({ selectedPlaceId: id }),
  setActiveFilter: (filter) => set({ activeFilter: filter }),
}));
