import { useState } from 'react';
import { useMapStore } from '../store/mapStore';
import { useGeolocation } from '../hooks/useGeolocation';
import {
  MapPin,
  Loader2,
  Satellite,
  Moon,
  Sun,
  User,
  Settings,
} from 'lucide-react';
import HamburgerButton from './HamburgerButton';

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Header({ isSidebarOpen, toggleSidebar }: HeaderProps) {
  const isLocating = useMapStore((state) => state.isLocating);
  const currentPosition = useMapStore((state) => state.currentPosition);
  const { locate } = useGeolocation();
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Aqui você pode implementar a troca de tema (ex: adicionar classe 'light' ao body)
    document.documentElement.classList.toggle('light');
  };

  return (
    <header className="glass-panel fixed inset-x-0 top-0 z-30 flex items-center justify-between px-3 py-2 shadow-panel sm:px-5 sm:py-3">
      {/* Lado esquerdo: Hambúrguer + Logo */}
      <div className="flex items-center gap-2 sm:gap-3">
        <HamburgerButton
          isOpen={isSidebarOpen}
          toggle={toggleSidebar}
        />
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse-ring rounded-full bg-signal/20" />
            <Satellite className="relative h-5 w-5 text-signal sm:h-6 sm:w-6" />
          </div>
          <h1 className="font-display text-sm font-bold tracking-wide text-paper sm:text-lg">
            GPS <span className="text-signal">PWA</span>
          </h1>
        </div>
      </div>

      {/* Lado direito: Botões de ação */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Botão Localizar */}
        <button
          type="button"
          onClick={locate}
          disabled={isLocating}
          className="flex items-center gap-1 rounded-full bg-signal/15 px-3 py-1.5 text-xs font-semibold text-signal transition-all hover:bg-signal/25 hover:shadow-glow disabled:opacity-60 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
        >
          {isLocating ? (
            <Loader2 className="h-3 w-3 animate-spin sm:h-4 sm:w-4" />
          ) : (
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
          )}
          <span className="hidden sm:inline">
            {isLocating ? 'Localizando...' : currentPosition ? 'Recentralizar' : 'Localizar'}
          </span>
          <span className="sm:hidden">
            {isLocating ? '...' : '📍'}
          </span>
        </button>

        {/* Botão Tema (modo noturno/claro) - visível apenas em desktop */}
        <button
          type="button"
          onClick={toggleTheme}
          className="hidden rounded-full p-2 text-mist transition hover:bg-white/10 hover:text-signal md:block"
          aria-label="Alternar tema"
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        {/* Botão Perfil (placeholder) */}
        <button
          type="button"
          className="hidden rounded-full p-2 text-mist transition hover:bg-white/10 hover:text-signal sm:block"
          aria-label="Perfil"
        >
          <User className="h-4 w-4" />
        </button>

        {/* Botão Configurações (placeholder) */}
        <button
          type="button"
          className="hidden rounded-full p-2 text-mist transition hover:bg-white/10 hover:text-signal sm:block"
          aria-label="Configurações"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}