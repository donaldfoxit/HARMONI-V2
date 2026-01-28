import React from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
import './style.css';

console.log('🟢 index.js loading...');

const root = ReactDOM.createRoot(document.getElementById('root'));
console.log('🟢 createRoot successful');

root.render(
  <React.StrictMode>
    <ReactLenis root options={{ lerp: 0.15, duration: 1.2, smoothWheel: true, wheelMultiplier: 1.5 }}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </ReactLenis>
  </React.StrictMode>
);

console.log('🟢 React app rendered');
