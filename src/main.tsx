import { StrictMode } from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root')!;

// Use a global variable to persist the React root across re-evaluations
// and avoid the "ReactDOMClient.createRoot() on a container that has already been passed to createRoot()" warning.
let root: Root;

// Check if the element already has a React container attached to it
const hasReactContainer = 
  Object.getOwnPropertyNames(rootElement).some(prop => prop.startsWith('__reactContainer')) ||
  Object.getOwnPropertySymbols(rootElement).some(sym => sym.toString().includes('__reactContainer'));

if ((window as any)._reactRoot) {
  root = (window as any)._reactRoot;
} else if (hasReactContainer) {
  // If it has a container but no global root object, we must replace the element
  // to clear React's internal state and allow a fresh createRoot call.
  const newRootElement = rootElement.cloneNode(false) as HTMLElement;
  rootElement.parentNode?.replaceChild(newRootElement, rootElement);
  root = createRoot(newRootElement);
  (window as any)._reactRoot = root;
} else {
  root = createRoot(rootElement);
  (window as any)._reactRoot = root;
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
