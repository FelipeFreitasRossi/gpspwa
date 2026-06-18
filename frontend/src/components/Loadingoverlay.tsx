import { useEffect, useRef, useState } from 'react';
import { morphText } from '../utils/animations';

interface LoadingOverlayProps {
  loading?: boolean;
  onComplete?: () => void;
}

export default function LoadingOverlay({ loading = true, onComplete }: LoadingOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(loading);

  useEffect(() => {
    if (!loading) {
      if (containerRef.current) {
        containerRef.current.style.opacity = '0';
        containerRef.current.style.transform = 'scale(1.05)';
        setTimeout(() => {
          setVisible(false);
          if (onComplete) onComplete();
        }, 500);
      }
      return;
    }
    setVisible(true);
    if (containerRef.current) {
      containerRef.current.style.opacity = '1';
      containerRef.current.style.transform = 'scale(1)';
    }
    const cleanup = morphText(
      textRef.current,
      ['Carregando', 'Preparando mapa', 'Conectando GPS', 'Quase lá'],
      1500
    );
    return cleanup;
  }, [loading]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-void/90 backdrop-blur-sm transition-all duration-500"
    >
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-signal border-t-transparent" />
      <div
        ref={textRef}
        className="mt-6 text-xl font-light tracking-widest text-paper"
      >
        Carregando
      </div>
      <div className="mt-2 text-xs text-signal/50">GPS PWA Pro</div>
    </div>
  );
}