import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext'; // Keep legacy if needed, but HotToast is better

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {/* Using react-hot-toast for modern toasts */}
        <Toaster position="top-right" />
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);