import { useEffect, useRef, useState } from 'react';

const MP_SDK_URL = 'https://sdk.mercadopago.com/js/v2';

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
 * Renders a Mercado Pago CardPayment Brick.
 *
 * @param {object}   props
 * @param {string}   props.publicKey        MP public key.
 * @param {number}   props.transactionAmount Total amount to charge.
 * @param {function} props.onSubmit         Called with the brick's formData on submission.
 * @param {function} [props.onError]        Called with error details on brick error.
 * @param {boolean}  [props.disabled]       Disable the brick container.
 */
export default function MercadoPagoCardBrick({ publicKey, transactionAmount, onSubmit, onError, disabled = false }) {
    const containerId = useRef(`mp-card-brick-${Math.random().toString(36).slice(2)}`);
    const brickRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!publicKey || !transactionAmount) return;

        let cancelled = false;

        const init = async () => {
            try {
                const MercadoPago = await loadMpSdk();

                if (cancelled) return;

                const mp = new MercadoPago(publicKey, { locale: 'pt-BR' });
                const bricksBuilder = mp.bricks();

                if (brickRef.current) {
                    await brickRef.current.unmount();
                }

                brickRef.current = await bricksBuilder.create('cardPayment', containerId.current, {
                    initialization: { amount: transactionAmount },
                    customization: {
                        visual: { style: { theme: 'default' } },
                        paymentMethods: { minInstallments: 1, maxInstallments: 12 },
                    },
                    callbacks: {
                        onReady: () => {
                            if (!cancelled) setLoading(false);
                        },
                        onSubmit: (formData) => {
                            return new Promise((resolve, reject) => {
                                try {
                                    const result = onSubmit(formData);
                                    if (result instanceof Promise) {
                                        result.then(resolve).catch(reject);
                                    } else {
                                        resolve(result);
                                    }
                                } catch (err) {
                                    reject(err);
                                }
                            });
                        },
                        onError: (err) => {
                            if (!cancelled) setError('Erro ao carregar formulário de pagamento.');
                            onError?.(err);
                        },
                    },
                });
            } catch (err) {
                if (!cancelled) {
                    setError('Não foi possível carregar o formulário de pagamento.');
                    setLoading(false);
                }
            }
        };

        init();

        return () => {
            cancelled = true;
            brickRef.current?.unmount().catch(() => {});
        };
    }, [publicKey, transactionAmount]);

    if (error) {
        return (
            <div
                className="rounded-xl border p-4 text-center text-sm"
                style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#dc2626', backgroundColor: '#fef2f2' }}
            >
                {error}
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
                id={containerId.current}
                className={disabled ? 'pointer-events-none opacity-60' : ''}
            />
        </div>
    );
}
