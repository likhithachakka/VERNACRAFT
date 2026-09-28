import '@vitejs/plugin-react/preamble';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {registerSW} from 'virtual:pwa-register';

// Register Service Worker for offline rural school caching
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('[Vernacraft SW] New pedagogical content available. Refreshing...');
  },
  onOfflineReady() {
    console.log('[Vernacraft SW] Core pedagogical assets and lessons cached. App ready for offline rural schools.');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

