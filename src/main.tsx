import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import { router } from './router';
import { AuthProvider } from './data/AuthContext';
import { DataProvider } from './data/DataContext';
import './styles/tailwind.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DataProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </DataProvider>
  </React.StrictMode>,
);
