import { create } from 'zustand';

interface Location {
  latitude: number;
  longitude: number;
}

interface MapStore {
  userLocation: Location | null;
  selectedPlaceId: string | null;
  activeFilter: string | null;
  setUserLocation: (location: Location) => void;
  setSelectedPlaceId: (id: string | null) => void;
  setActiveFilter: (filter: string | null) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  userLocation: null,
  selectedPlaceId: null,
  activeFilter: null,
  setUserLocation: (location) => set({ userLocation: location }),
  setSelectedPlaceId: (id) => set({ selectedPlaceId: id }),
  setActiveFilter: (filter) => set({ activeFilter: filter }),
}));
