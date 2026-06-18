import { useState } from 'react';
import {
  Info,
  HelpCircle,
  Heart,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Globe,
  ChevronUp,
} from 'lucide-react';
import SocialIcons from './SocialIcons';

type InfoPanel = 'sobre' | 'ajuda' | null;

export default function Footer() {
  const [openPanel, setOpenPanel] = useState<InfoPanel>(null);
  const currentYear = new Date().getFullYear();

  function togglePanel(panel: InfoPanel) {
    setOpenPanel((current) => (current === panel ? null : panel));
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="glass-panel fixed inset-x-0 bottom-0 z-30 border-t border-white/5 px-4 py-3 shadow-panel sm:px-6 sm:py-4">
      {/* Painel de ajuda (Sobre/Ajuda) */}
      {openPanel && (
        <div className="absolute bottom-full left-0 right-0 mb-3 animate-fade-up px-4 sm:mb-4">
          <div className="glass-panel mx-auto max-w-sm rounded-2xl border border-white/10 p-5 shadow-2xl backdrop-blur-xl">
            {openPanel === 'sobre' ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-signal" />
                  <h4 className="font-display font-semibold text-paper">Sobre o GPS PWA Pro</h4>
                </div>
                <p className="text-sm leading-relaxed text-mist">
                  <strong className="text-signal">GPS PWA Pro</strong> é um app de navegação
                  de última geração que usa <strong className="text-pulse">inteligência artificial</strong> para calcular
                  rotas inteligentes, mostrando sua posição em tempo real, distância, tempo e
                  elevação.
                </p>
                <p className="text-xs text-mist/50">
                  {/* Feito com ❤️ usando React, Node.js e Python. */}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-beacon" />
                  <h4 className="font-display font-semibold text-paper">Como usar</h4>
                </div>
                <ol className="list-decimal space-y-1 pl-4 text-sm text-mist">
                  <li>Toque em <strong className="text-signal">Localizar</strong> para centralizar o mapa.</li>
                  <li>Busque um endereço e defina como <strong className="text-signal">origem</strong> ou <strong className="text-beacon">destino</strong>.</li>
                  <li>Clique em <strong className="text-pulse">Traçar rota</strong> e veja a mágica!</li>
                  <li>Acompanhe as instruções passo a passo.</li>
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

      {/* Conteúdo principal do footer */}
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-4">
        {/* Lado esquerdo: status + versão + scroll top */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal/60 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-signal shadow-glow" />
            </span>
            <span className="text-xs text-mist sm:text-sm">Online</span>
          </div>
          <span className="hidden h-4 w-px bg-white/10 sm:block" />
          <span className="font-mono text-xs text-mist/50 sm:text-sm">v1.0.0</span>
          <span className="hidden h-4 w-px bg-white/10 md:block" />
          <span className="hidden text-xs text-mist/40 md:block">
            © {currentYear} GPS PWA Pro
          </span>
        </div>

        {/* Centro: links + contato */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => togglePanel('sobre')}
            className="group flex items-center gap-1.5 text-xs text-mist transition hover:text-signal sm:text-sm"
          >
            <Info className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
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
            <HelpCircle className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
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
            <Mail className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">contato@gpspwa.com</span>
          </a>
        </div>

        {/* Lado direito: ícones sociais + open source */}
        <div className="flex items-center gap-3">
          <SocialIcons />
          <span className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-1 text-[10px] text-mist/30 sm:text-xs">
            <Heart className="h-3 w-3 animate-pulse text-red-400/50" />
            <span className="hidden sm:inline">Open Source</span>
          </div>
          <button
            onClick={scrollToTop}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-mist transition hover:bg-white/10 hover:text-paper"
            aria-label="Voltar ao topo"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Barra inferior com créditos */}
      <div className="mt-2 border-t border-white/5 pt-2 text-center text-[10px] text-mist/30 sm:text-left">
        {/* <span>Desenvolvido com ❤️ e TypeScript • Dados em tempo real</span> */}
      </div>
    </footer>
  );
}