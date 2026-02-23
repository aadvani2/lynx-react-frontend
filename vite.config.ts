import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import type { Plugin } from 'vite'

// Plugin to filter unnecessary modulepreload tags and keep only critical ones
function filterModulePreloads(): Plugin {
  return {
    name: 'filter-modulepreloads',
    transformIndexHtml(html) {
      // Extract all modulepreload tags
      const modulepreloadRegex = /<link rel="modulepreload"[^>]*>/g;
      const allPreloads: string[] = [];
      let match;
      
      while ((match = modulepreloadRegex.exec(html)) !== null) {
        allPreloads.push(match[0]);
      }
      
      // Filter to keep only critical chunks for faster initial load
      // CRITICAL: vendor-react-core MUST load first - everything depends on it
      // Non-critical: heavy libraries (swal, swiper, stripe, googlemaps) load on-demand
      const criticalPreloads = allPreloads.filter(preload => {
        // ALWAYS keep React core chunk - it's required for everything
        const isReactCore = /vendor-react-core/.test(preload);
        // Keep main entry point
        const isMainEntry = /index-[^"]+\.js/.test(preload) || /main-[^"]+\.js/.test(preload);
        // Only preload React core and entry - let other chunks load on-demand to ensure proper order
        return isReactCore || isMainEntry;
      });
      
      // Sort to ensure vendor-react-core loads first
      criticalPreloads.sort((a, b) => {
        const aIsReactCore = /vendor-react-core/.test(a);
        const bIsReactCore = /vendor-react-core/.test(b);
        if (aIsReactCore && !bIsReactCore) return -1;
        if (!aIsReactCore && bIsReactCore) return 1;
        return 0;
      });
      
      // Remove all modulepreload tags and add back only critical ones
      let result = html.replace(modulepreloadRegex, '');
      
      // Insert critical preloads right before the main script tag
      const scriptTagMatch = result.match(/<script type="module"[^>]*>/);
      if (scriptTagMatch && criticalPreloads.length > 0) {
        const insertIndex = result.indexOf(scriptTagMatch[0]);
        const preloadsHtml = criticalPreloads.join('\n  ') + '\n  ';
        result = result.slice(0, insertIndex) + preloadsHtml + result.slice(insertIndex);
      }
      
      return result;
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBase = env.VITE_API_BASE_URL || 'http://localhost:3000'

  return {
    plugins: [react(), filterModulePreloads()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'zustand',
        'yup',
        'sweetalert2',
        'swiper',
        'swiper/react',
        'swiper/modules',
        'flatpickr',
        'react-phone-input-2',
        'intl-tel-input',
        'react-modal',
        'react-resize-detector',
        'react-icons',
      ],
      exclude: [],
    },
    server: {
      proxy: {
        '/uploads': {
          target: apiBase,
          changeOrigin: true,
        },
      },
    },
    build: {
      target: ['es2022', 'edge88', 'firefox78', 'chrome87', 'safari14'],
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      cssCodeSplit: true, // Split CSS per route for better caching
      // Disable automatic modulepreload - we'll filter manually via plugin
      modulePreload: {
        polyfill: false, // Modern browsers support modulepreload natively
      },
      rollupOptions: {
        output: {
          // Modern output format for better tree-shaking
          format: 'es',
          // Better chunk naming for debugging
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          // Ensure proper chunk loading order - React must load before other chunks
          experimentalMinChunkSize: 20000,
          manualChunks(id) {
            // Split node_modules into vendor chunks for better caching
            if (id.includes('node_modules')) {
              // CRITICAL: React core in separate chunk - must load first
              if (id.includes('react/') || id.includes('react-dom/')) {
                return 'vendor-react-core'
              }
              // React-dependent libraries - load after React core
              if (
                id.includes('zustand') ||
                id.includes('react-router') ||
                id.includes('react-icons') || 
                id.includes('react-modal') || 
                id.includes('react-resize-detector') || 
                id.includes('react-phone-input') ||
                id.includes('@react-google-maps') ||
                id.includes('@stripe/react-stripe') ||
                id.includes('framer-motion')
              ) {
                return 'vendor-react'
              }
              // Heavy UI libraries - lazy load (these don't depend on React at module level)
              if (id.includes('swiper')) return 'vendor_swiper'
              if (id.includes('@stripe/stripe-js')) return 'vendor_stripe'
              if (id.includes('sweetalert2')) return 'vendor_swal'
              if (id.includes('@googlemaps/js-api-loader')) return 'vendor_googlemaps'
              // Form libraries
              if (id.includes('yup') || id.includes('flatpickr')) return 'vendor_forms'
              // Other vendors (non-React dependencies only)
              return 'vendor'
            }
            
            // Ensure stores load with React - bundle them with components that use them
            // Don't create a separate store chunk to avoid loading order issues

            // Split large internal modules for better code splitting
            // NOTE: Stores are NOT split separately - they stay with React chunk
            // because Zustand depends on React.createContext and must load with React
            if (id.includes('/src/components/public/booking/')) return 'booking'
            if (id.includes('/src/components/public/home-page/')) return 'homepage'
            if (id.includes('/src/components/customer/')) return 'customer'
            if (id.includes('/src/components/partner/')) return 'partner'
            if (id.includes('/src/components/employee/')) return 'employee'
          },
        },
      },
    },
  }
})
