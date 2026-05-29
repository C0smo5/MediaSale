import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const orinSwal = Swal.mixin({
    customClass: {
        popup: 'orin-swal-popup',
        title: 'orin-swal-title',
        htmlContainer: 'orin-swal-text',
        confirmButton: 'orin-swal-btn orin-swal-btn--confirm',
        cancelButton: 'orin-swal-btn orin-swal-btn--cancel',
        actions: 'orin-swal-actions',
    },
    buttonsStyling: false,
    confirmButtonText: 'OK',
    heightAuto: false,
});

const STATUS_MESSAGES = {
    'google-linked': {
        icon: 'success',
        title: 'Google conectado',
        text: 'Sua conta Google foi vinculada com sucesso.',
    },
    'google-unlinked': {
        icon: 'info',
        title: 'Google desconectado',
        text: 'A conta Google foi removida dos metodos de acesso.',
    },
    'orin-password-created': {
        icon: 'success',
        title: 'Senha criada',
        text: 'Agora voce pode entrar com e-mail e senha Orin.',
    },
    'verification-link-sent': {
        icon: 'success',
        title: 'E-mail enviado',
        text: 'Um novo link de verificacao foi enviado para seu e-mail.',
    },
    'email-verified': {
        icon: 'success',
        title: 'E-mail verificado',
        text: 'Seu e-mail foi confirmado com sucesso.',
    },
    'phone-verified': {
        icon: 'success',
        title: 'Telefone verificado',
        text: 'Seu telefone foi confirmado com sucesso.',
    },
    'email-code-sent': {
        icon: 'info',
        title: 'Codigo enviado',
        text: 'Um novo codigo foi enviado para seu e-mail.',
    },
    'phone-code-sent': {
        icon: 'info',
        title: 'Codigo enviado',
        text: 'Um novo codigo foi enviado por SMS.',
    },
    'plan-updated': {
        icon: 'success',
        title: 'Plano atualizado',
        text: 'Seu plano foi alterado com sucesso.',
    },
    'subscription-cancelled': {
        icon: 'success',
        title: 'Assinatura cancelada',
        text: 'Voce voltou ao plano Trial gratuito.',
    },
    'plan-change-cancelled': {
        icon: 'info',
        title: 'Alteracao cancelada',
        text: 'A mudanca de plano foi cancelada.',
    },
    'no-pending-plan-change': {
        icon: 'info',
        title: 'Nenhuma alteracao pendente',
        text: 'Nao ha mudanca de plano aguardando confirmacao.',
    },
    'settings-saved': {
        icon: 'success',
        title: 'Configuracoes salvas',
        text: 'Suas preferencias foram atualizadas.',
    },
    '2fa-enabled': {
        icon: 'success',
        title: '2FA ativado',
        text: 'A autenticacao em dois fatores esta ativa na sua conta.',
    },
    '2fa-disabled': {
        icon: 'info',
        title: '2FA desativado',
        text: 'A autenticacao em dois fatores foi removida.',
    },
    'sms-fallback-toggled': {
        icon: 'success',
        title: 'Preferencia atualizada',
        text: 'A opcao de SMS como fallback do 2FA foi atualizada.',
    },
    'sms-sent': {
        icon: 'info',
        title: 'SMS enviado',
        text: 'Um codigo foi enviado para seu telefone.',
    },
    'session-revoked': {
        icon: 'success',
        title: 'Sessao encerrada',
        text: 'A sessao selecionada foi encerrada.',
    },
    'other-sessions-revoked': {
        icon: 'success',
        title: 'Sessoes encerradas',
        text: 'Todas as outras sessoes foram encerradas.',
    },
};

/**
 * @param {string} status
 */
export function showFlashMessage(status) {
    if (!status) {
        return;
    }

    const mapped = STATUS_MESSAGES[status];

    if (mapped) {
        return orinSwal.fire(mapped);
    }

    return orinSwal.fire({
        icon: 'info',
        title: 'Aviso',
        text: status,
    });
}

/**
 * @param {string} title
 * @param {string} [text]
 */
export function showErrorAlert(title, text) {
    return orinSwal.fire({
        icon: 'error',
        title,
        text: text ?? '',
    });
}

/**
 * @param {object} options
 * @param {string} options.title
 * @param {string} [options.text]
 * @param {string} [options.confirmText]
 * @param {string} [options.cancelText]
 * @param {'warning'|'question'|'error'} [options.icon]
 */
export async function confirmAction({
    title,
    text,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    icon = 'warning',
}) {
    const result = await orinSwal.fire({
        icon,
        title,
        text,
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        reverseButtons: true,
        focusCancel: true,
    });

    return result.isConfirmed;
}
