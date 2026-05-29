import './bootstrap';
import '../css/app.css';

import { registerFlashAlerts } from '@/lib/flashAlerts';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import React from 'react';

const pages = {
    ...import.meta.glob('./Pages/**/*.tsx'),
    ...import.meta.glob('./Pages/**/*.jsx'),
};

createInertiaApp({
    resolve: (name) =>
        resolvePageComponent([`./Pages/${name}.tsx`, `./Pages/${name}.jsx`], pages),
    setup({ el, App, props }) {
        registerFlashAlerts(props.initialPage);

        createRoot(el).render(
            <React.StrictMode>
                <App {...props} />
            </React.StrictMode>
        );
    },
});