import { Menu, X } from 'lucide-react';

interface SidebarToggleProps {
  isOpen: boolean;
  toggle: () => void;
}

export default function SidebarToggle({ isOpen, toggle }: SidebarToggleProps) {
  return (
    <button
      onClick={toggle}
      className="sidebar-toggle fixed left-4 top-[72px] z-50 rounded-full bg-signal/20 p-2.5 text-signal backdrop-blur-md transition-all hover:bg-signal/30 hover:shadow-glow active:scale-95 md:hidden"
      aria-label="Abrir/fechar painel"
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  );
}