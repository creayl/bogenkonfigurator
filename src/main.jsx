import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ConfiguratorProvider } from './state/ConfiguratorContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfiguratorProvider>
      <App />
    </ConfiguratorProvider>
  </StrictMode>
);
