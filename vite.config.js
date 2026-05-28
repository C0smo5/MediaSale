import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
        },
    },
    server: {
        // Evita public/hot com http://[::1]:porta (ERR_ADDRESS_INVALID no Chrome)
        host: '127.0.0.1',
        port: Number(process.env.VITE_PORT) || 5173,
        hmr: {
            host: '127.0.0.1',
        },
    },
});