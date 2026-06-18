import axios from 'axios';
import type { LatLng, Place, RouteData } from '../store/mapStore';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export async function geocodeAddress(query: string): Promise<Place[]> {
  if (!query.trim()) return [];
  try {
    const response = await api.get('/api/search', { params: { q: query } });
    const data = response.data;
    if (data && typeof data === 'object' && 'lat' in data && 'lon' in data) {
      return [{
        label: data.display_name || query,
        lat: data.lat,
        lng: data.lon,
      }];
    }
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        label: item.display_name || item.label || query,
        lat: item.lat,
        lng: item.lon || item.lng,
      }));
    }
    return [];
  } catch (error) {
    console.error('Erro ao buscar endereço:', error);
    throw new Error('Não foi possível buscar esse endereço agora. Tente novamente.');
  }
}

export async function fetchRoute(origin: LatLng, destination: LatLng): Promise<RouteData> {
  try {
    const response = await api.post('/api/route', { origin, destination });
    const data = response.data;
    if (data.status !== 'success') {
      throw new Error(data.error || 'Erro ao calcular rota.');
    }
    return {
      distanceKm: parseFloat(data.route.distance_km) || 0,
      durationMin: data.route.duration_min || 0,
      elevationGainM: data.intelligence?.elevation_gain_meters || 0,
      coordinates: data.route.geometry || [],
      steps: data.route.steps.map((step: any) => ({
        instruction: step.instruction || 'Siga em frente',
        distanceMeters: step.distance || 0,
      })),
    };
  } catch (error) {
    console.error('Erro ao calcular rota:', error);
    throw new Error('Não foi possível traçar a rota agora. Tente novamente.');
  }
}

export default api;