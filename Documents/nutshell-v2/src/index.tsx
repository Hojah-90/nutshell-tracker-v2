import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as Sentry from '@sentry/react';
import APP from './App';


Sentry.init({
  dsn: "https://404ab6101781d842654041903d4dfd41@o4509350438240256.ingest.us.sentry.io/4509350444793856",
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ['localhost:3000', 'https://hojah-90.github.io/nutshell-tracker-v2'],
  environment: 'production',
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);