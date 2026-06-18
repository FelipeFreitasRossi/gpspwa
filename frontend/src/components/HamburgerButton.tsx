interface HamburgerButtonProps {
  isOpen: boolean;
  toggle: () => void;
}

export default function HamburgerButton({ isOpen, toggle }: HamburgerButtonProps) {
  return (
    <button
      onClick={toggle}
      className="relative flex h-10 w-10 flex-col items-center justify-center gap-1.5 transition-transform duration-300 hover:scale-105 active:scale-95"
      aria-label="Abrir/fechar menu"
    >
      {/* Barra superior */}
      <div
        className={`h-0.5 w-8 rounded-full bg-paper transition-all duration-300 ${
          isOpen ? 'translate-y-[6px] rotate-[-45deg]' : ''
        }`}
      />
      {/* Barra do meio */}
      <div
        className={`h-0.5 w-8 rounded-full bg-paper transition-all duration-300 ${
          isOpen ? 'opacity-0' : ''
        }`}
      />
      {/* Barra inferior */}
      <div
        className={`h-0.5 w-8 rounded-full bg-paper transition-all duration-300 ${
          isOpen ? '-translate-y-[6px] rotate-45' : ''
        }`}
      />
    </button>
  );
}