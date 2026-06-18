import { useState, useEffect, useRef } from 'react';
import { ChevronRight, MapPin, Navigation, Compass, Sparkles, ArrowRight } from 'lucide-react';
import gsap from 'gsap';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const steps = [
  {
    icon: MapPin,
    title: 'Encontre seu destino',
    description: 'Busque qualquer endereço e defina sua origem ou destino com apenas um toque.',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20',
  },
  {
    icon: Navigation,
    title: 'Trace rotas inteligentes',
    description: 'Nossa IA calcula a melhor rota, com distância, tempo e elevação em tempo real.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
  },
  {
    icon: Compass,
    title: 'Navegue com confiança',
    description: 'Acompanhe sua posição ao vivo, receba instruções passo a passo e chegue ao seu destino.',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
  },
];

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);

  const totalSteps = steps.length;
  const isLastStep = currentStep === totalSteps - 1;

  // Animação de entrada do conteúdo com GSAP (mais suave)
  useEffect(() => {
    const tl = gsap.timeline();

    // Ícone entra com bounce
    if (iconRef.current) {
      tl.fromTo(
        iconRef.current,
        { scale: 0.6, opacity: 0, rotate: -10 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.8, ease: 'back.out(1.7)' }
      );
    }

    // Título e descrição entram em cascata
    if (titleRef.current) {
      tl.fromTo(
        titleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.3'
      );
    }
    if (descRef.current) {
      tl.fromTo(
        descRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      );
    }

    // Dots animam com stagger
    dotsRef.current.forEach((dot, index) => {
      if (dot) {
        gsap.fromTo(
          dot,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            delay: 0.2 + index * 0.1,
            ease: 'back.out(1.7)',
          }
        );
      }
    });

    return () => {
      tl.kill();
    };
  }, [currentStep]);

  // Atualiza o dot ativo com animação
  useEffect(() => {
    dotsRef.current.forEach((dot, index) => {
      if (dot) {
        if (index === currentStep) {
          gsap.to(dot, {
            scale: 1.4,
            backgroundColor: '#2DD4FF',
            boxShadow: '0 0 20px rgba(45,212,255,0.5)',
            duration: 0.4,
            ease: 'power2.out',
          });
        } else {
          gsap.to(dot, {
            scale: 1,
            backgroundColor: 'rgba(255,255,255,0.2)',
            boxShadow: 'none',
            duration: 0.4,
            ease: 'power2.out',
          });
        }
      }
    });
  }, [currentStep]);

  const handleNext = () => {
    if (isLastStep) {
      // Animação de saída com fade e zoom
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 1.08,
        duration: 0.7,
        ease: 'power2.in',
        onComplete: onComplete,
      });
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 1.08,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: onComplete,
    });
  };

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950 p-6"
    >
      {/* Fundo com gradiente animado (opcional) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 h-full w-full animate-spin-slow rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 h-full w-full animate-spin-slow rounded-full bg-gradient-to-l from-amber-500/10 to-pink-500/10 blur-3xl" />
      </div>

      <div
        ref={contentRef}
        className="relative flex max-w-lg flex-col items-center text-center"
      >
        {/* Ícone com card glass */}
        <div
          ref={iconRef}
          className={`mb-8 rounded-3xl border p-5 ${steps[currentStep].bgColor} ${steps[currentStep].borderColor} shadow-2xl backdrop-blur-sm`}
        >
          <CurrentIcon className={`h-16 w-16 ${steps[currentStep].color}`} />
        </div>

        {/* Título */}
        <h2
          ref={titleRef}
          className="font-display text-3xl font-bold text-paper sm:text-4xl md:text-5xl"
        >
          {steps[currentStep].title}
        </h2>

        {/* Descrição */}
        <p
          ref={descRef}
          className="mt-3 max-w-sm text-base text-mist sm:text-lg"
        >
          {steps[currentStep].description}
        </p>

        {/* Dots (indicadores) */}
        <div className="mt-8 flex gap-3">
          {steps.map((_, index) => (
            <div
              key={index}
              ref={(el) => (dotsRef.current[index] = el)}
              className="h-2.5 w-2.5 rounded-full bg-white/20 transition-all"
            />
          ))}
        </div>

        {/* Botões */}
        <div className="mt-10 flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {!isLastStep && (
            <button
              type="button"
              onClick={handleSkip}
              className="text-sm text-mist transition hover:text-paper active:scale-95"
            >
              Pular introdução
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            className={`group flex items-center gap-3 rounded-full px-8 py-3.5 font-semibold text-paper transition-all hover:shadow-glow active:scale-95 ${
              isLastStep
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-2xl'
                : 'bg-white/10 backdrop-blur-sm hover:bg-white/20'
            }`}
          >
            {isLastStep ? (
              <>
                <Sparkles className="h-4 w-4 animate-pulse" />
                Vamos começar!
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            ) : (
              <>
                Próximo
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}