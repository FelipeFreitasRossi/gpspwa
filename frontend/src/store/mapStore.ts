import { create } from 'zustand';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Place {
  label: string;
  lat: number;
  lng: number;
}

export interface RouteStep {
  instruction: string;
  distanceMeters: number;
}

export interface RouteData {
  distanceKm: number;
  durationMin: number;
  elevationGainM: number;
  coordinates: [number, number][];
  steps: RouteStep[];
}

interface MapState {
  currentPosition: LatLng | null;
  origin: Place | null;
  destination: Place | null;
  route: RouteData | null;
  isLocating: boolean;
  isRouting: boolean;
  error: string | null;
  arrived: boolean;
  centerRequested: boolean;

  setCurrentPosition: (position: LatLng | null) => void;
  setOrigin: (place: Place | null) => void;
  setDestination: (place: Place | null) => void;
  setRoute: (route: RouteData | null) => void;
  setIsLocating: (value: boolean) => void;
  setIsRouting: (value: boolean) => void;
  setError: (message: string | null) => void;
  setArrived: (value: boolean) => void;
  setCenterRequested: (value: boolean) => void;
  clearRoute: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  currentPosition: null,
  origin: null,
  destination: null,
  route: null,
  isLocating: false,
  isRouting: false,
  error: null,
  arrived: false,
  centerRequested: false,

  setCurrentPosition: (position) => set({ currentPosition: position }),
  setOrigin: (place) => set({ origin: place }),
  setDestination: (place) => set({ destination: place }),
  setRoute: (route) => set({ route }),
  setIsLocating: (value) => set({ isLocating: value }),
  setIsRouting: (value) => set({ isRouting: value }),
  setError: (message) => set({ error: message }),
  setArrived: (value) => set({ arrived: value }),
  setCenterRequested: (value) => set({ centerRequested: value }),
  clearRoute: () =>
    set({ origin: null, destination: null, route: null, arrived: false, error: null }),
}));