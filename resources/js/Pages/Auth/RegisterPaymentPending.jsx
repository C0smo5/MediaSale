import { Head } from '@inertiajs/react';

export default function RegisterPaymentPending() {
    return (
        <div className="orin-min-dvh flex min-h-0 items-center justify-center px-4" style={{ backgroundColor: '#ffffff' }}>
            <Head title="Aguardando confirmação do pagamento" />

            <div className="w-full max-w-md text-center">
                <div
                    className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ backgroundColor: 'rgba(124,58,237,0.1)' }}
                >
                    <svg
                        className="h-8 w-8"
                        style={{ color: '#7c3aed' }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
                        />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold" style={{ color: '#1a1040' }}>
                    Pagamento em processamento
                </h1>

                <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6b6b8a' }}>
                    Sua assinatura foi criada e o pagamento está sendo processado pelo Mercado Pago. Assim que a
                    cobrança for confirmada, seu acesso será liberado automaticamente.
                </p>

                <p className="mt-4 text-xs" style={{ color: '#9ca3af' }}>
                    Você receberá uma notificação por e-mail quando o processo for concluído.
                </p>
            </div>
        </div>
    );
}
