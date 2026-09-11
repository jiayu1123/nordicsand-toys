import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isProd = command === 'build';
  return {
    base: '/',
    logLevel: 'error',
    plugins: [
      base44({
        legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === 'true',
        hmrNotifier: !isProd,
        navigationNotifier: !isProd,
        analyticsTracker: !isProd,
        visualEditAgent: !isProd
      }),
      react(),
    ]
  };
});