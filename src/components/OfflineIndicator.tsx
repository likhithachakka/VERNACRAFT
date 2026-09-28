import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { OfflineStorageService } from '../services/offlineStorage';

export const OfflineIndicator: React.FC = () => {
  const [isBrowserOnline, setIsBrowserOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [isSwActive, setIsSwActive] = useState(false);
  const [cachedLessonsCount, setCachedLessonsCount] = useState(0);

  useEffect(() => {
    setIsSimulatedOffline(OfflineStorageService.isOfflineSimulated());
    setCachedLessonsCount(OfflineStorageService.getCachedLessons().length);

    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        setIsSwActive(true);
      });
    }

    const handleOnline = () => setIsBrowserOnline(true);
    const handleOffline = () => setIsBrowserOnline(false);
    const handleSimChange = (e: Event) => {
      const custom = e as CustomEvent;
      setIsSimulatedOffline(custom.detail?.offline ?? false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('vernacraft-network-change', handleSimChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('vernacraft-network-change', handleSimChange);
    };
  }, []);

  const isActuallyOffline = !isBrowserOnline || isSimulatedOffline;

  if (!isActuallyOffline) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3 rounded-xl bg-amber-600/95 text-white px-3.5 py-2 text-xs font-medium shadow-xl backdrop-blur-sm border border-amber-400/40 animate-in slide-in-from-bottom-2">
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        <WifiOff className="w-3.5 h-3.5 text-amber-100" />
      </div>
      
      <div className="flex flex-col">
        <span className="font-semibold">
          {isSimulatedOffline ? 'Simulated Low-Connectivity Mode' : 'Offline Mode (Rural School Mode)'}
        </span>
        <span className="text-[11px] text-amber-100 font-normal">
          {cachedLessonsCount} core lessons &amp; pedagogical assets cached in Service Worker
        </span>
      </div>

      {isSimulatedOffline && (
        <button
          onClick={() => OfflineStorageService.setOfflineSimulation(false)}
          className="ml-2 px-2 py-1 rounded bg-amber-700 hover:bg-amber-800 text-[11px] font-semibold text-white transition cursor-pointer"
        >
          Exit Sim
        </button>
      )}
    </div>
  );
};
