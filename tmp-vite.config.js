import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
export default defineConfig({plugins:[react(),tailwindcss()],optimizeDeps:{noDiscovery:true,include:['react','react-dom/client','react-router','react-router/dom']}});
