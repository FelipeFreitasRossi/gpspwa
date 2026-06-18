import { useEffect, useRef } from 'react';
import { useMapStore } from '../store/mapStore';
import { confettiBurst, slideInPanel, staggerListItems } from '../utils/animations';
import { MapPin, Clock, Mountain, Flag } from 'lucide-react';

export default function RoutePanel() {
  const route = useMapStore((state) => state.route);
  const arrived = useMapStore((state) => state.arrived);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const stepsRef = useRef<HTMLUListElement | null>(null);
  const confettiLayerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (route) slideInPanel(panelRef.current);
  }, [route]);

  useEffect(() => {
    if (!stepsRef.current) return;
    const items = Array.from(stepsRef.current.querySelectorAll('li'));
    staggerListItems(items);
  }, [route]);

  useEffect(() => {
    if (arrived) confettiBurst(confettiLayerRef.current);
  }, [arrived]);

  if (!route) return null;

  return (
    <div
      ref={panelRef}
      className="glass-panel pointer-events-auto relative max-h-[40vh] overflow-hidden rounded-2xl p-4 shadow-panel md:max-h-[50vh]"
    >
      <div ref={confettiLayerRef} className="pointer-events-none absolute inset-0 z-20 overflow-visible" />

      {arrived && (
        <div className="mb-3 flex items-center justify-center gap-2 rounded-lg bg-success/15 px-3 py-2 text-center text-sm font-semibold text-success">
          <Flag className="h-4 w-4" />
          🎉 Você chegou ao destino!
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-white/5 p-2">
          <MapPin className="mx-auto h-4 w-4 text-signal" />
          <p className="font-display text-base font-bold text-paper sm:text-lg">
            {route.distanceKm.toFixed(1)} km
          </p>
          <p className="text-[10px] text-mist sm:text-[11px]">Distância</p>
        </div>
        <div className="rounded-lg bg-white/5 p-2">
          <Clock className="mx-auto h-4 w-4 text-beacon" />
          <p className="font-display text-base font-bold text-paper sm:text-lg">
            {Math.round(route.durationMin)} min
          </p>
          <p className="text-[10px] text-mist sm:text-[11px]">Tempo</p>
        </div>
        <div className="rounded-lg bg-white/5 p-2">
          <Mountain className="mx-auto h-4 w-4 text-pulse" />
          <p className="font-display text-base font-bold text-paper sm:text-lg">
            {Math.round(route.elevationGainM)} m
          </p>
          <p className="text-[10px] text-mist sm:text-[11px]">Elevação</p>
        </div>
      </div>

      <div className="mt-3 max-h-[20vh] overflow-y-auto md:max-h-[26vh]">
        <ul ref={stepsRef} className="space-y-2">
          {route.steps.map((step, index) => (
            <li
              key={index}
              className="flex items-start gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-paper"
            >
              <span className="mt-0.5 font-mono text-xs text-signal">{index + 1}.</span>
              <span className="flex-1 text-xs sm:text-sm">{step.instruction}</span>
              <span className="font-mono text-[10px] text-mist sm:text-[11px]">
                {Math.round(step.distanceMeters)} m
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}