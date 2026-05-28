import AuthFooterAction from '@/Components/Auth/AuthFooterAction';
import AuthPageHeader from '@/Components/Auth/AuthPageHeader';
import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

const MailCheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verificar e-mail" />

            <AuthPageHeader
                icon={<MailCheckIcon />}
                badge="Verificacao"
                title="Confirme seu e-mail"
                description="Antes de continuar, confirme seu endereco de e-mail clicando no link enviado para sua caixa de entrada."
            />

            {status === 'verification-link-sent' && (
                <div
                    className="auth-alert font-medium"
                    style={{ backgroundColor: '#ecfdf5', borderColor: 'rgba(5,150,105,0.22)', color: '#059669' }}
                >
                    Um novo link de verificacao foi enviado para o e-mail cadastrado.
                </div>
            )}

            <form onSubmit={submit}>
                <PrimaryButton className="w-full" disabled={processing}>
                    {processing ? 'Reenviando...' : 'Reenviar e-mail de verificacao'}
                </PrimaryButton>
            </form>

            <AuthFooterAction
                linkLabel="Sair da conta"
                href={route('logout')}
                method="post"
                as="button"
            />
        </GuestLayout>
    );
}
