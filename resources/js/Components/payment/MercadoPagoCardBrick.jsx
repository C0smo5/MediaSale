import {
    formatPaymentFormError,
    isBrickRecoverableError,
    logPaymentFormError,
} from '@/lib/paymentFormLogger';
import { useEffect, useId, useRef, useState } from 'react';

const MP_SDK_URL = 'https://sdk.mercadopago.com/js/v2';

/** Remove chevron do @tailwindcss/forms; o Brick já desenha o ícone do select. */
const MP_BRICK_SELECT_FIX_CSS = `
  select {
    background-image: none !important;
    background-position: unset !important;
    background-repeat: unset !important;
    background-size: unset !important;
    print-color-adjust: unset !important;
  }
`;

function injectBrickSelectFix(root) {
    if (!root || root.querySelector('[data-mp-brick-select-fix]')) {
        return;
    }

    const style = document.createElement('style');
    style.setAttribute('data-mp-brick-select-fix', 'true');
    style.textContent = MP_BRICK_SELECT_FIX_CSS;
    root.appendChild(style);

    root.querySelectorAll('*').forEach((el) => {
        if (el.shadowRoot) {
            injectBrickSelectFix(el.shadowRoot);
        }
    });
}

function loadMpSdk() {
    return new Promise((resolve, reject) => {
        if (window.MercadoPago) {
            resolve(window.MercadoPago);
            return;
        }

        const existing = document.querySelector(`script[src="${MP_SDK_URL}"]`);
        if (existing) {
            existing.addEventListener('load', () => resolve(window.MercadoPago));
            existing.addEventListener('error', reject);
            return;
        }

        const script = document.createElement('script');
        script.src = MP_SDK_URL;
        script.async = true;
        script.onload = () => resolve(window.MercadoPago);
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

/**
 * MP Brick `unmount()` may return void, not a Promise — never chain `.catch()` directly.
 * @param {unknown} controller
 * @returns {Promise<void>}
 */
function safeUnmountBrick(controller) {
    if (!controller || typeof controller.unmount !== 'function') {
        return Promise.resolve();
    }

    try {
        const result = controller.unmount();

        if (result != null && typeof result.then === 'function') {
            return result.catch(() => {});
        }
    } catch {
        // ignore unmount errors during cleanup
    }

    return Promise.resolve();
}

export async function cleanupMercadoPagoBrick() {
    await safeUnmountBrick(window.cardPaymentBrickController);
    window.cardPaymentBrickController = null;
}

/**
 * @param {object}   props
 * @param {string}   props.publicKey
 * @param {number}   props.transactionAmount
 * @param {string}   [props.payerEmail]
 * @param {function} props.onSubmit
 * @param {function} [props.onError]
 * @param {boolean}  [props.disabled]
 */
export default function MercadoPagoCardBrick({
    publicKey,
    transactionAmount,
    payerEmail = null,
    onSubmit,
    onError,
    disabled = false,
}) {
    const reactId = useId();
    const containerId = `mp-card-brick-${reactId.replace(/:/g, '')}`;
    const containerRef = useRef(null);
    const brickRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorDetail, setErrorDetail] = useState(null);

    const reportError = (phase, err, extra = {}) => {
        const detail = logPaymentFormError(`MercadoPagoCardBrick:${phase}`, err, {
            public_key_prefix: publicKey ? String(publicKey).slice(0, 8) : null,
            amount: transactionAmount,
            container_id: containerId,
            ...extra,
        });

        setError(formatPaymentFormError(err));
        setErrorDetail(import.meta.env.DEV ? detail : null);
        setLoading(false);
        onError?.(err);
    };

    useEffect(() => {
        const amount = Number(transactionAmount);

        if (!publicKey || !Number.isFinite(amount) || amount <= 0) {
            reportError('config', {
                message: 'Configuração inválida',
                cause: !publicKey ? 'missing_public_key' : 'invalid_amount',
            });
            return;
        }

        let cancelled = false;

        const init = async () => {
            try {
                await cleanupMercadoPagoBrick();

                if (cancelled) {
                    return;
                }

                const MercadoPago = await loadMpSdk();

                if (cancelled) {
                    return;
                }

                const container = containerRef.current ?? document.getElementById(containerId);
                if (!container) {
                    reportError('container', { message: 'Container não encontrado', cause: 'container_not_found' });
                    return;
                }

                const mp = new MercadoPago(publicKey, { locale: 'pt-BR' });
                const bricksBuilder = mp.bricks();

                const initialization = {
                    amount,
                    ...(payerEmail ? { payer: { email: payerEmail } } : {}),
                };

                const controller = await bricksBuilder.create('cardPayment', containerId, {
                    initialization,
                    customization: {
                        visual: { style: { theme: 'default' } },
                        paymentMethods: { minInstallments: 1, maxInstallments: 12 },
                    },
                    callbacks: {
                        onReady: () => {
                            if (!cancelled) {
                                const brickRoot =
                                    containerRef.current ?? document.getElementById(containerId);
                                if (brickRoot) {
                                    injectBrickSelectFix(brickRoot);
                                }
                                setLoading(false);
                                setError(null);
                                setErrorDetail(null);
                            }
                        },
                        onSubmit: (formData) =>
                            new Promise((resolve, reject) => {
                                try {
                                    const result = onSubmit(formData);
                                    if (result instanceof Promise) {
                                        result.then(resolve).catch((submitErr) => {
                                            logPaymentFormError('MercadoPagoCardBrick:onSubmit', submitErr);
                                            reject(submitErr);
                                        });
                                    } else {
                                        resolve(result);
                                    }
                                } catch (submitErr) {
                                    logPaymentFormError('MercadoPagoCardBrick:onSubmit', submitErr);
                                    reject(submitErr);
                                }
                            }),
                        onError: (brickError) => {
                            if (cancelled) {
                                return;
                            }

                            // BIN parcial / bandeira ainda não identificada — normal ao digitar
                            if (isBrickRecoverableError(brickError)) {
                                logPaymentFormError('MercadoPagoCardBrick:brick', brickError);
                                onError?.(brickError);
                                return;
                            }

                            reportError('brick', brickError);
                        },
                    },
                });

                if (cancelled) {
                    await safeUnmountBrick(controller);
                    return;
                }

                brickRef.current = controller;
                window.cardPaymentBrickController = controller;
            } catch (err) {
                if (!cancelled) {
                    reportError('init', err);
                }
            }
        };

        init();

        return () => {
            cancelled = true;
            const controller = brickRef.current;
            safeUnmountBrick(controller).finally(() => {
                if (window.cardPaymentBrickController === controller) {
                    window.cardPaymentBrickController = null;
                }
            });
            brickRef.current = null;
        };
    }, [publicKey, transactionAmount, payerEmail, containerId]);

    if (error) {
        return (
            <div
                className="rounded-xl border p-4 text-sm"
                style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#dc2626', backgroundColor: '#fef2f2' }}
                role="alert"
            >
                <p className="text-center font-medium">{error}</p>
                {errorDetail && (
                    <p
                        className="mt-2 break-all text-center font-mono text-xs"
                        style={{ color: '#991b1b' }}
                    >
                        {errorDetail}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="relative">
            {loading && (
                <div
                    className="flex items-center justify-center rounded-xl py-8 text-sm"
                    style={{ color: '#6b6b8a' }}
                >
                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                    Carregando formulário de pagamento…
                </div>
            )}
            <div
                ref={containerRef}
                id={containerId}
                className={`mp-card-brick-root ${disabled ? 'pointer-events-none opacity-60' : ''}`}
            />
        </div>
    );
}
