import { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';

// Função segura para obter ícones com fallback
const getIcon = (name: string, fallbackName: string = 'Circle') => {
  const icon = (LucideIcons as any)[name];
  if (icon) return icon;
  // Tenta com a primeira letra maiúscula (ex: Github -> GitHub)
  const alternative = (LucideIcons as any)[name.charAt(0).toUpperCase() + name.slice(1)];
  if (alternative) return alternative;
  return (LucideIcons as any)[fallbackName] || (() => null);
};

// Obtém cada ícone com fallback
const HeartIcon = getIcon('Heart');
const MailIcon = getIcon('Mail');
const ChevronUpIcon = getIcon('ChevronUp');
const InfoIcon = getIcon('Info');
const HelpCircleIcon = getIcon('HelpCircle');
const LinkedinIcon = getIcon('Linkedin');
const InstagramIcon = getIcon('Instagram');
const YoutubeIcon = getIcon('Youtube');
const GithubIcon = getIcon('Github', 'GitHub') || getIcon('GitHub', 'Circle');

export default function BottomBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [openPanel, setOpenPanel] = useState<'sobre' | 'ajuda' | null>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const togglePanel = (panel: 'sobre' | 'ajuda') => {
    setOpenPanel((prev) => (prev === panel ? null : panel));
  };

  return (
    <>
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-40 
          transform transition-transform duration-500 ease-in-out
          ${isVisible ? 'translate-y-0' : 'translate-y-full'}
          glass-panel border-t border-white/5 px-4 py-3 shadow-panel
          sm:px-6 sm:py-4
        `}
      >
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-4">
          <div className="flex items-center gap-3 text-xs text-mist/50">
            <span className="font-mono">v1.0.0</span>
            <span className="hidden h-4 w-px bg-white/10 sm:block" />
            <span className="hidden sm:inline">© {currentYear} GPS PWA Pro</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => togglePanel('sobre')}
              className="group flex items-center gap-1.5 text-xs text-mist transition hover:text-signal sm:text-sm"
            >
              <InfoIcon className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
              <span className="relative">
                Sobre
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-signal transition-all group-hover:w-full" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => togglePanel('ajuda')}
              className="group flex items-center gap-1.5 text-xs text-mist transition hover:text-signal sm:text-sm"
            >
              <HelpCircleIcon className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
              <span className="relative">
                Ajuda
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-signal transition-all group-hover:w-full" />
              </span>
            </button>
            <span className="hidden h-4 w-px bg-white/10 sm:block" />
            <a
              href="mailto:contato@gpspwa.com"
              className="flex items-center gap-1.5 text-xs text-mist/40 transition hover:text-signal sm:text-sm"
            >
              <MailIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">contato</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 sm:gap-2">
              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-full p-1.5 text-mist transition hover:bg-signal/10 hover:text-signal"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
              </a>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-full p-1.5 text-mist transition hover:bg-signal/10 hover:text-signal"
                aria-label="GitHub"
              >
                <GithubIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-full p-1.5 text-mist transition hover:bg-signal/10 hover:text-signal"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
              </a>
              <a
                href="https://youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-full p-1.5 text-mist transition hover:bg-signal/10 hover:text-signal"
                aria-label="YouTube"
              >
                <YoutubeIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
              </a>
            </div>
            <span className="h-6 w-px bg-white/10" />
            <div className="flex items-center gap-1 text-[10px] text-mist/30 sm:text-xs">
              <HeartIcon className="h-3 w-3 animate-pulse text-red-400/50" />
              <span className="hidden sm:inline">Open Source</span>
            </div>
            <button
              onClick={scrollToTop}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-mist transition hover:bg-white/10 hover:text-paper"
              aria-label="Voltar ao topo"
            >
              <ChevronUpIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-2 border-t border-white/5 pt-2 text-center text-[10px] text-mist/30 sm:text-left">
          <span>Desenvolvido com ❤️ e TypeScript • Dados em tempo real</span>
        </div>
      </div>

      {openPanel && (
        <div className="fixed bottom-20 left-4 right-4 z-50 animate-fade-up sm:bottom-24 sm:left-auto sm:right-4 sm:w-80">
          <div className="glass-panel rounded-2xl border border-white/10 p-5 shadow-2xl backdrop-blur-xl">
            {openPanel === 'sobre' ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-signal">✨</span>
                  <h4 className="font-display font-semibold text-paper">Sobre o GPS PWA Pro</h4>
                </div>
                <p className="text-sm leading-relaxed text-mist">
                  <strong className="text-signal">GPS PWA Pro</strong> é um app de navegação
                  de última geração que usa <strong className="text-pulse">inteligência artificial</strong> para calcular
                  rotas inteligentes.
                </p>
                <p className="text-xs text-mist/50">Feito com ❤️ usando React, Node.js e Python.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-beacon">❓</span>
                  <h4 className="font-display font-semibold text-paper">Como usar</h4>
                </div>
                <ol className="list-decimal space-y-1 pl-4 text-sm text-mist">
                  <li>Toque em <strong className="text-signal">Localizar</strong> para centralizar o mapa.</li>
                  <li>Busque um endereço e defina como <strong className="text-signal">origem</strong> ou <strong className="text-beacon">destino</strong>.</li>
                  <li>Clique em <strong className="text-pulse">Traçar rota</strong> e veja a mágica!</li>
                </ol>
              </div>
            )}
            <button
              type="button"
              onClick={() => setOpenPanel(null)}
              className="mt-3 w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-mist hover:bg-white/10 hover:text-paper transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}