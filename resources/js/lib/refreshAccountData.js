import { router } from '@inertiajs/react';

const MUTATING_METHODS = new Set(['post', 'put', 'patch', 'delete']);

const DEBUG_ENDPOINT = 'http://127.0.0.1:7741/ingest/bd361424-ca07-45e1-a5c9-f42edd45af30';

// #region agent log
function debugRefreshLog(message, data, hypothesisId) {
    fetch(DEBUG_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '9f1182' },
        body: JSON.stringify({
            sessionId: '9f1182',
            runId: 'account-refresh',
            hypothesisId,
            location: 'refreshAccountData.js',
            message,
            data,
            timestamp: Date.now(),
        }),
    }).catch(() => {});
}
// #endregion

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
            // #region agent log
            debugRefreshLog('skip reload after redirect', {
                method,
                component: event.detail?.page?.component,
                plan_key: event.detail?.page?.props?.auth?.user?.plan_key,
            }, 'H');
            // #endregion
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

        // #region agent log
        debugRefreshLog('reload auth partial', {
            method,
            component: page.component,
            only,
            plan_key: page.props.auth?.user?.plan_key,
        }, 'H');
        // #endregion

        router.reload({
            only,
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    });
}
