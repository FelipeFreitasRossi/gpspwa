import { useEffect, useRef } from 'react';
import { splashIntro, splashExit } from '../utils/animations';
import { Satellite } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const tl = splashIntro({
      ring: ringRef.current,
      dot: dotRef.current,
      title: titleRef.current,
      subtitle: subtitleRef.current,
    });

    tl.eventCallback('onComplete', () => {
      setTimeout(() => {
        splashExit(containerRef.current, onFinish);
      }, 1500);
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950"
    >
      <div className="relative mb-8 flex h-32 w-32 items-center justify-center">
        <div
          ref={ringRef}
          className="absolute h-full w-full rounded-full border-4 border-cyan-500/30 animate-pulse-ring"
        />
        <div
          ref={dotRef}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 shadow-glow"
        >
          <Satellite className="h-10 w-10 text-white" />
        </div>
      </div>

      <h1
        ref={titleRef}
        className="font-display text-4xl font-bold text-paper sm:text-5xl md:text-6xl"
      >
        GPS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">PWA</span> Pro
      </h1>

      <p
        ref={subtitleRef}
        className="mt-3 text-sm text-mist sm:text-base"
      >
        Navegação inteligente com IA
      </p>
    </div>
  );
}