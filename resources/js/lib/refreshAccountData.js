import { router } from '@inertiajs/react';

const MUTATING_METHODS = new Set(['post', 'put', 'patch', 'delete']);

/**
 * Recarrega `auth` (e props da página de perfil) após mutações in-page.
 * Ignora visits com redirect — o servidor já envia props atualizadas na navegação final.
 */
export function registerAccountDataRefresh() {
    router.on('success', (event) => {
        const visit = event.detail?.visit;
        const method = visit?.method?.toLowerCase();

        if (!method || !MUTATING_METHODS.has(method)) {
            return;
        }

        if (visit.redirected) {
            return;
        }

        const page = event.detail?.page;

        if (!page?.props?.auth) {
            return;
        }

        const only = ['auth'];

        if (page.component === 'Profile/Edit') {
            only.push('linkedAccounts', 'mustVerifyEmail', 'initialSection');
        }

        router.reload({
            only,
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    });
}
