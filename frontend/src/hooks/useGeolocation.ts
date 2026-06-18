import { useMapStore } from '../store/mapStore';

export function useGeolocation() {
  const setCurrentPosition = useMapStore((state) => state.setCurrentPosition);
  const setIsLocating = useMapStore((state) => state.setIsLocating);
  const setError = useMapStore((state) => state.setError);

  const locate = () => {
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ lat: latitude, lng: longitude });
        setIsLocating(false);
        setError(null);
      },
      (error) => {
        setError(`Erro ao obter localização: ${error.message}`);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return { locate };
}