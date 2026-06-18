import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useMapStore, type LatLng } from '../store/mapStore';
import { drawRouteLine, mapParallax } from '../utils/animations';
import { MapPin } from 'lucide-react';

// Posição inicial padrão (São Paulo)
const DEFAULT_CENTER: [number, number] = [-23.5505, -46.6333];
const DEFAULT_ZOOM = 13;

// Distância (em metros) para considerar que o usuário chegou ao destino
const ARRIVAL_RADIUS_METERS = 35;

/** Calcula a distância em metros entre dois pontos de latitude/longitude. */
function distanceInMeters(a: LatLng, b: LatLng): number {
  const earthRadius = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;

  return 2 * earthRadius * Math.asin(Math.sqrt(h));
}

/** Cria ícone customizado (divIcon) para os pontos de origem/destino. */
function createPointIcon(color: string, letter: string) {
  return L.divIcon({
    className: '',
    html: `<div class="point-marker" style="background:${color}"><span>${letter}</span></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
  });
}

/** Ícone da posição atual: bolinha com anel pulsante. */
const currentLocationIcon = L.divIcon({
  className: '',
  html: `
    <div class="current-location-marker">
      <div class="ring"></div>
      <div class="dot"></div>
    </div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export default function MapView() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const mapRef = useRef<L.Map | null>(null);
  const currentMarkerRef = useRef<L.Marker | null>(null);
  const originMarkerRef = useRef<L.Marker | null>(null);
  const destinationMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);

  const currentPosition = useMapStore((state) => state.currentPosition);
  const origin = useMapStore((state) => state.origin);
  const destination = useMapStore((state) => state.destination);
  const route = useMapStore((state) => state.route);
  const centerRequested = useMapStore((state) => state.centerRequested);
  const arrived = useMapStore((state) => state.arrived);
  const setCenterRequested = useMapStore((state) => state.setCenterRequested);
  const setArrived = useMapStore((state) => state.setArrived);
  const setCurrentPosition = useMapStore((state) => state.setCurrentPosition);

  // 1) Cria o mapa uma única vez.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: true,
    });

    // Camada de tiles do OpenStreetMap (com tema escuro via CSS)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Controles de zoom (posicionado no canto inferior direito)
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 2) Efeito de paralaxe (camada decorativa que acompanha o mouse).
  useEffect(() => {
    const cleanup = mapParallax(containerRef.current, overlayRef.current);
    return cleanup;
  }, []);

  // 3) Atualiza o marcador da posição atual.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !currentPosition) return;

    const latLng: L.LatLngExpression = [currentPosition.lat, currentPosition.lng];

    if (!currentMarkerRef.current) {
      currentMarkerRef.current = L.marker(latLng, {
        icon: currentLocationIcon,
        zIndexOffset: 1000,
      }).addTo(map);
    } else {
      currentMarkerRef.current.setLatLng(latLng);
    }
  }, [currentPosition]);

  // 4) Centraliza o mapa na posição atual quando o usuário clica em "Localizar".
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !centerRequested || !currentPosition) return;

    map.flyTo([currentPosition.lat, currentPosition.lng], 16, { duration: 1.2 });
    setCenterRequested(false);
  }, [centerRequested, currentPosition, setCenterRequested]);

  // 5) Marcador de ORIGEM.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!origin) {
      originMarkerRef.current?.remove();
      originMarkerRef.current = null;
      return;
    }

    const latLng: L.LatLngExpression = [origin.lat, origin.lng];
    if (!originMarkerRef.current) {
      originMarkerRef.current = L.marker(latLng, {
        icon: createPointIcon('#2DD4FF', 'P'),
      }).addTo(map);
    } else {
      originMarkerRef.current.setLatLng(latLng);
    }
  }, [origin]);

  // 6) Marcador de DESTINO.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!destination) {
      destinationMarkerRef.current?.remove();
      destinationMarkerRef.current = null;
      return;
    }

    const latLng: L.LatLngExpression = [destination.lat, destination.lng];
    if (!destinationMarkerRef.current) {
      destinationMarkerRef.current = L.marker(latLng, {
        icon: createPointIcon('#FFB454', 'D'),
      }).addTo(map);
    } else {
      destinationMarkerRef.current.setLatLng(latLng);
    }
  }, [destination]);

  // 7) Desenha a linha da rota com animação "tracejada".
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove a linha anterior, se existir
    routeLineRef.current?.remove();
    routeLineRef.current = null;

    if (!route || route.coordinates.length === 0) return;

    const polyline = L.polyline(route.coordinates, {
      color: '#8B6CFF',
      weight: 4,
      opacity: 0.95,
      lineJoin: 'round',
    }).addTo(map);

    routeLineRef.current = polyline;

    // Ajusta o mapa para mostrar toda a rota
    map.fitBounds(polyline.getBounds(), { padding: [60, 120] });

    // Anima o traçado da rota com GSAP
    const pathElement = (polyline as unknown as { _path?: SVGPathElement })._path ?? null;
    drawRouteLine(pathElement);
  }, [route]);

  // 8) Verifica se o usuário chegou ao destino.
  useEffect(() => {
    if (!currentPosition || !destination || arrived) return;

    if (distanceInMeters(currentPosition, destination) <= ARRIVAL_RADIUS_METERS) {
      setArrived(true);
    }
  }, [currentPosition, destination, arrived, setArrived]);

  // 9) Função para centralizar o mapa na posição atual (usada pelo botão flutuante)
  const handleFlyToCurrent = () => {
    if (mapRef.current && currentPosition) {
      mapRef.current.flyTo([currentPosition.lat, currentPosition.lng], 16, {
        duration: 1.2,
      });
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Container do Leaflet */}
      <div ref={containerRef} className="h-full w-full" />

      {/* Camada decorativa de paralaxe (brilho/vinheta) */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-10 [background:radial-gradient(circle_at_50%_35%,rgba(45,212,255,0.08),transparent_55%)]"
      />

      {/* Botão flutuante "Minha localização" (visível apenas em mobile) */}
      {currentPosition && (
        <button
          onClick={handleFlyToCurrent}
          className="absolute bottom-20 right-4 z-20 rounded-full bg-signal/20 p-3 text-signal backdrop-blur-md transition-all hover:bg-signal/30 hover:shadow-glow active:scale-95 md:hidden"
          aria-label="Centralizar na minha posição"
        >
          <MapPin className="h-5 w-5" />
        </button>
      )}

      {/* Indicador de "chegada ao destino" (opcional, já tem no RoutePanel, mas pode ser redundante) */}
      {arrived && (
        <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2 rounded-full bg-success/20 px-4 py-2 text-sm font-semibold text-success backdrop-blur-md shadow-panel md:top-8">
          🎯 Chegou ao destino!
        </div>
      )}
    </div>
  );
}