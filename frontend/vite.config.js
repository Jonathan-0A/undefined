import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    }
                },
            },
        },
        chunkSizeWarningLimit: 600,
    },
    server: {
        proxy: {
            '/auth': {
                target: 'http://localhost:8553',
                changeOrigin: true,
            },
            '/user': {
                target: 'http://localhost:8553',
                changeOrigin: true,
            },
            '/message': {
                target: 'http://localhost:8553',
                changeOrigin: true,
            },
        },
        historyApiFallback: true,
    },
});
