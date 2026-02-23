import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
// Global CSS is now inlined in index.html for critical path optimization
// Design tokens loaded on-demand via CSS modules

interface OneSignalPushSubscription { 
  id: string | null;
}

interface OneSignalUser { 
  PushSubscription: OneSignalPushSubscription;
}

interface OneSignalNotifications { 
  requestPermission(): Promise<'granted' | 'denied' | 'default'>;
  permission: Promise<'granted' | 'denied' | 'default'>;
}

interface OneSignalGlobal { 
  init(options: any): Promise<void>;
  on(event: string, callback: (...args: any[]) => void): void;
  Notifications: OneSignalNotifications;
  User: OneSignalUser;
  login(externalId: string): Promise<void>;
}

interface CustomToastOptions { 
  title: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

declare global { 
  interface Window { 
    OneSignal: OneSignalGlobal;
    showToast: (options: CustomToastOptions) => void;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
