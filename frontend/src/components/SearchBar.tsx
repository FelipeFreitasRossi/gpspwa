import { useEffect, useRef, useState } from 'react';
import { useMapStore, type Place } from '../store/mapStore';
import { geocodeAddress, fetchRoute } from '../services/api';
import { slideInPanel, staggerListItems } from '../utils/animations';
import { Search, MapPin, Navigation, RotateCcw, Loader2 } from 'lucide-react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const origin = useMapStore((state) => state.origin);
  const destination = useMapStore((state) => state.destination);
  const isRouting = useMapStore((state) => state.isRouting);
  const setOrigin = useMapStore((state) => state.setOrigin);
  const setDestination = useMapStore((state) => state.setDestination);
  const setRoute = useMapStore((state) => state.setRoute);
  const setIsRouting = useMapStore((state) => state.setIsRouting);
  const setError = useMapStore((state) => state.setError);
  const clearRoute = useMapStore((state) => state.clearRoute);

  useEffect(() => {
    slideInPanel(panelRef.current);
  }, []);

  useEffect(() => {
    if (!listRef.current) return;
    const items = Array.from(listRef.current.querySelectorAll('li'));
    staggerListItems(items);
  }, [suggestions]);

  function handleQueryChange(value: string) {
    setQuery(value);
    setSelectedPlace(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await geocodeAddress(value);
        setSuggestions(results);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Erro ao buscar endereço.');
      } finally {
        setIsSearching(false);
      }
    }, 400);
  }

  function handleSelectSuggestion(place: Place) {
    setSelectedPlace(place);
    setQuery(place.label);
    setSuggestions([]);
  }

  async function handleTraceRoute() {
    if (!origin || !destination) return;

    setIsRouting(true);
    setError(null);
    try {
      const routeData = await fetchRoute(
        { lat: origin.lat, lng: origin.lng },
        { lat: destination.lat, lng: destination.lng }
      );
      setRoute(routeData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao traçar rota.');
    } finally {
      setIsRouting(false);
    }
  }

  function handleClear() {
    clearRoute();
    setQuery('');
    setSuggestions([]);
    setSelectedPlace(null);
  }

  const canTraceRoute = Boolean(origin && destination) && !isRouting;

  return (
    <div ref={panelRef} className="glass-panel pointer-events-auto rounded-2xl p-3 shadow-panel sm:p-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
          <input
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            placeholder="Buscar endereço..."
            className="w-full rounded-xl bg-white/5 pl-9 pr-3 py-2 text-sm text-paper placeholder-mist outline-none focus:ring-2 focus:ring-signal/60"
          />
        </div>
        {isSearching && (
          <Loader2 className="h-4 w-4 animate-spin text-signal" />
        )}
      </div>

      {suggestions.length > 0 && (
        <ul ref={listRef} className="mt-2 max-h-44 space-y-1 overflow-y-auto">
          {suggestions.map((place) => (
            <li key={`${place.lat}-${place.lng}`}>
              <button
                type="button"
                onClick={() => handleSelectSuggestion(place)}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-paper hover:bg-white/10"
              >
                {place.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <button
          type="button"
          disabled={!selectedPlace}
          onClick={() => selectedPlace && setOrigin(selectedPlace)}
          className="flex items-center justify-center gap-1 rounded-lg bg-signal/15 px-2 py-2 font-semibold text-signal transition hover:bg-signal/25 disabled:opacity-40"
        >
          <MapPin className="h-3 w-3" />
          Definir origem
        </button>
        <button
          type="button"
          disabled={!selectedPlace}
          onClick={() => selectedPlace && setDestination(selectedPlace)}
          className="flex items-center justify-center gap-1 rounded-lg bg-beacon/15 px-2 py-2 font-semibold text-beacon transition hover:bg-beacon/25 disabled:opacity-40"
        >
          <Navigation className="h-3 w-3" />
          Definir destino
        </button>
      </div>

      <div className="mt-2 space-y-1 font-mono text-[11px] text-mist">
        <p className="truncate flex items-center gap-1">
          <MapPin className="h-3 w-3 text-signal" />
          Origem: {origin ? origin.label : '—'}
        </p>
        <p className="truncate flex items-center gap-1">
          <Navigation className="h-3 w-3 text-beacon" />
          Destino: {destination ? destination.label : '—'}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={!canTraceRoute}
          onClick={handleTraceRoute}
          className="flex items-center justify-center gap-1 rounded-lg bg-pulse px-3 py-2 text-sm font-semibold text-paper transition hover:bg-pulse/80 hover:shadow-glow disabled:opacity-40"
        >
          {isRouting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Traçando...
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4" />
              Traçar rota
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="flex items-center justify-center gap-1 rounded-lg bg-white/5 px-3 py-2 text-sm font-semibold text-mist transition hover:bg-white/10 hover:text-paper"
        >
          <RotateCcw className="h-4 w-4" />
          Limpar
        </button>
      </div>
    </div>
  );
}