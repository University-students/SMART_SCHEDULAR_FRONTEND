// Application entry point: mount the React app with its context providers.
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </AuthProvider>
);
