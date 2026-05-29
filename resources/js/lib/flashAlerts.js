import { router } from '@inertiajs/react';
import { showErrorAlert, showFlashMessage } from '@/lib/swal';

let lastHandledKey = '';

function handlePageFlash(page) {
    const status = page?.props?.flash?.status;
    const googleError = page?.props?.errors?.google;
    const pageKey = `${page?.url ?? ''}:${status ?? ''}:${googleError ?? ''}`;

    if (pageKey === lastHandledKey) {
        return;
    }

    if (status) {
        lastHandledKey = pageKey;
        showFlashMessage(status);
        return;
    }

    if (googleError) {
        lastHandledKey = pageKey;
        showErrorAlert('Nao foi possivel vincular o Google', googleError);
    }
}

export function registerFlashAlerts(initialPage) {
    if (initialPage) {
        handlePageFlash(initialPage);
    }

    router.on('success', (event) => {
        handlePageFlash(event.detail.page);
    });
}
