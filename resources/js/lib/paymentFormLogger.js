const DEBUG_ENDPOINT = 'http://127.0.0.1:7741/ingest/bd361424-ca07-45e1-a5c9-f42edd45af30';
const DEBUG_SESSION_ID = '9f1182';

const CAUSE_MESSAGES = {
    amount_is_not_number: 'Valor do pagamento inválido.',
    missing_amount_property: 'Valor do pagamento não informado.',
    container_not_found: 'Container do formulário não encontrado.',
    fields_setup_failed: 'Não foi possível carregar os campos seguros do cartão. Desative bloqueadores de anúncio e tente de novo.',
    fields_setup_failed_after_3_tries: 'Falha ao carregar o formulário após várias tentativas.',
    already_initialized: 'Formulário já estava em uso. Recarregue a página.',
    incorrect_initialization: 'Configuração do Mercado Pago incorreta.',
    missing_container_id: 'Erro interno ao montar o formulário.',
    invalid_sdk_instance: 'SDK do Mercado Pago inválido.',
    unauthorized_payment_method: 'Método de pagamento não autorizado para esta conta.',
    no_payment_method_for_provided_bin:
        'Bandeira do cartão não reconhecida. Use um cartão Visa, Mastercard ou Elo (em teste: veja os cartões de sandbox do Mercado Pago).',
    missing_payment_information: 'Aguarde preencher todos os dados do cartão.',
    get_card_bin_payment_methods_failed: 'Não foi possível identificar a bandeira. Verifique o número do cartão.',
};

/** Erros disparados enquanto o usuário digita o BIN — não devem substituir o formulário. */
const RECOVERABLE_BRICK_CAUSES = new Set([
    'no_payment_method_for_provided_bin',
    'missing_payment_information',
    'get_card_bin_payment_methods_failed',
    'incomplete_fields',
]);

/**
 * @param {unknown} error
 */
export function isBrickRecoverableError(error) {
    if (error == null) {
        return false;
    }

    if (error.type === 'non_critical') {
        return true;
    }

    const cause = error.cause ?? error.message;

    return typeof cause === 'string' && RECOVERABLE_BRICK_CAUSES.has(cause);
}

/**
 * @param {unknown} error
 * @returns {string}
 */
export function formatPaymentFormError(error) {
    if (error == null) {
        return 'Erro desconhecido no formulário de pagamento.';
    }

    if (typeof error === 'string') {
        return error;
    }

    const cause = error?.cause;
    if (cause && CAUSE_MESSAGES[cause]) {
        return CAUSE_MESSAGES[cause];
    }

    const message = error?.message;
    if (typeof message === 'string' && message.trim() !== '') {
        return message;
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return 'Erro ao carregar formulário de pagamento.';
}

/**
 * @param {string} location
 * @param {unknown} error
 * @param {Record<string, unknown>} [context]
 * @returns {string} Resumo para exibir em desenvolvimento
 */
export function logPaymentFormError(location, error, context = {}) {
    const payload = {
        location,
        message: error?.message ?? (typeof error === 'string' ? error : null),
        type: error?.type ?? null,
        cause: error?.cause ?? null,
        name: error?.name ?? null,
        ...context,
        timestamp: new Date().toISOString(),
    };

    const isRecoverable = isBrickRecoverableError(error);
    const logFn = isRecoverable ? console.warn : console.error;
    logFn(`[Orin · Pagamento${isRecoverable ? ' · aviso' : ''}]`, payload);

    if (import.meta.env.DEV) {
        fetch(DEBUG_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Debug-Session-Id': DEBUG_SESSION_ID,
            },
            body: JSON.stringify({
                sessionId: DEBUG_SESSION_ID,
                runId: 'payment-form-error',
                hypothesisId: 'payment-error',
                location,
                message: 'payment form error',
                data: payload,
                timestamp: Date.now(),
            }),
        }).catch(() => {});
    }

    const parts = [location];
    if (payload.cause) {
        parts.push(`cause=${payload.cause}`);
    }
    if (payload.message) {
        parts.push(String(payload.message));
    }

    return parts.join(' · ');
}
