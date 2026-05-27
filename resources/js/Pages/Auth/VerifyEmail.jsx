import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verificar e-mail" />

            <div className="mb-8">
                <span
                    className="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
                    style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}
                >
                    Verificacao
                </span>
                <h1 className="mt-4 text-3xl font-bold" style={{ color: '#1a1040' }}>
                    Confirme seu e-mail
                </h1>
                <p className="mt-2 text-sm leading-6" style={{ color: '#6b6b8a' }}>
                    Antes de continuar, confirme seu endereco de e-mail clicando no link enviado para sua caixa de entrada.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div
                    className="mb-6 rounded-2xl border px-4 py-3 text-sm font-medium"
                    style={{ backgroundColor: '#ecfdf5', borderColor: 'rgba(5,150,105,0.22)', color: '#059669' }}
                >
                    Um novo link de verificacao foi enviado para o e-mail cadastrado.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="flex flex-col gap-4">
                    <PrimaryButton className="w-full" disabled={processing}>
                        {processing ? 'Reenviando...' : 'Reenviar e-mail de verificacao'}
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-sm font-medium underline underline-offset-4"
                        style={{ color: '#6b6b8a' }}
                    >
                        Sair da conta
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
