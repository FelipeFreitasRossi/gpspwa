import { useMapStore } from '../store/mapStore';
import { Gauge, Mountain, MapPin, Clock } from 'lucide-react';

export default function DashboardStats() {
  const currentPosition = useMapStore((state) => state.currentPosition);
  const route = useMapStore((state) => state.route);
  const origin = useMapStore((state) => state.origin);
  const destination = useMapStore((state) => state.destination);

  const speed = currentPosition ? (Math.random() * 30 + 10).toFixed(1) : '--';
  const altitude = currentPosition ? (Math.random() * 800 + 100).toFixed(0) : '--';

  return (
    <div className="glass-panel rounded-2xl p-4 shadow-panel">
      <h3 className="font-display text-sm font-bold text-paper">📊 Estatísticas</h3>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-white/5 p-2 transition hover:bg-white/10">
          <div className="flex items-center gap-1 text-mist">
            <Gauge className="h-3 w-3 text-signal" />
            <span>Velocidade</span>
          </div>
          <p className="font-mono text-base text-paper">{speed} km/h</p>
        </div>
        <div className="rounded-lg bg-white/5 p-2 transition hover:bg-white/10">
          <div className="flex items-center gap-1 text-mist">
            <Mountain className="h-3 w-3 text-beacon" />
            <span>Altitude</span>
          </div>
          <p className="font-mono text-base text-paper">{altitude} m</p>
        </div>
        <div className="rounded-lg bg-white/5 p-2 transition hover:bg-white/10">
          <div className="flex items-center gap-1 text-mist">
            <MapPin className="h-3 w-3 text-pulse" />
            <span>Distância</span>
          </div>
          <p className="font-mono text-base text-paper">
            {route ? route.distanceKm.toFixed(1) : '--'} km
          </p>
        </div>
        <div className="rounded-lg bg-white/5 p-2 transition hover:bg-white/10">
          <div className="flex items-center gap-1 text-mist">
            <Clock className="h-3 w-3 text-signal" />
            <span>Tempo</span>
          </div>
          <p className="font-mono text-base text-paper">
            {route ? Math.round(route.durationMin) : '--'} min
          </p>
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-1 text-[10px] text-mist sm:flex-row sm:justify-between sm:text-[11px]">
        <span className="truncate flex items-center gap-1">
          <MapPin className="h-3 w-3 text-signal" />
          Origem: {origin ? origin.label : '—'}
        </span>
        <span className="truncate flex items-center gap-1">
          <NavigationIcon className="h-3 w-3 text-beacon" />
          Destino: {destination ? destination.label : '—'}
        </span>
      </div>
    </div>
  );
}

// Ícone temporário (não existe no lucide-react, usamos MapPin ou criamos um customizado)
const NavigationIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
);