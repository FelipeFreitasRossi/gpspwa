import { useState, useEffect } from 'react';
import OnboardingScreen from './components/OnboardingScreen';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import BottomBar from './components/BottomBar';
import MapView from './components/Map';
import SearchBar from './components/SearchBar';
import RoutePanel from './components/RoutePanel';
import DashboardStats from './components/DashboardStats';
import LoadingOverlay from './components/Loadingoverlay';
import { useMapStore } from './store/mapStore';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showSplash, setShowSplash] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const error = useMapStore((state) => state.error);
  const setError = useMapStore((state) => state.setError);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setShowSplash(true);
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isSidebarOpen && !target.closest('.sidebar-panel') && !target.closest('.hamburger-button')) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashComplete} />;
  }

  return (
    <div className="relative flex h-screen w-screen flex-col bg-void font-body">
      <LoadingOverlay loading={isLoading} />

      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="relative flex flex-1 overflow-hidden pt-[64px] pb-[88px]">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <aside
          className={`
            sidebar-panel fixed left-0 top-0 z-50 h-full w-[85vw] max-w-[420px] 
            overflow-y-auto bg-void/95 p-4 backdrop-blur-xl transition-transform duration-300 ease-in-out
            md:relative md:top-auto md:z-20 md:w-[420px] md:translate-x-0 md:bg-void/80 md:p-5
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="space-y-4 pb-20">
            <SearchBar />
            <RoutePanel />
            <DashboardStats />
          </div>
        </aside>

        <div className="flex-1 overflow-hidden md:rounded-l-2xl md:border-l md:border-white/5 p-1">
          <MapView />
        </div>
      </div>

      {error && (
        <div className="fixed inset-x-4 bottom-24 z-40 flex items-center justify-between gap-3 rounded-xl bg-red-500/20 px-4 py-3 text-sm text-red-100 backdrop-blur-md shadow-lg">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
            {error}
          </span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="rounded-full bg-red-500/20 p-1 hover:bg-red-500/30 transition"
          >
            ✕
          </button>
        </div>
      )}

      <BottomBar />
    </div>
  );
}