import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root')!;

// Use a property on the element to store the root to prevent multiple createRoot calls
if (!(rootElement as any)._reactRoot) {
  (rootElement as any)._reactRoot = createRoot(rootElement);
}

const root = (rootElement as any)._reactRoot;

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
