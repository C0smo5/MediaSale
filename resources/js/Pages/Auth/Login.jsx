import AuthFooterAction from '@/Components/Auth/AuthFooterAction';
import AuthPageHeader from '@/Components/Auth/AuthPageHeader';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const LoginIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <polyline points="10 17 15 12 10 7" />
        <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
);

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Entrar" />

            {status && (
                <div
                    className="auth-alert font-medium"
                    style={{ backgroundColor: '#ecfdf5', borderColor: 'rgba(5,150,105,0.22)', color: '#059669' }}
                >
                    {status}
                </div>
            )}

            <AuthPageHeader
                icon={<LoginIcon />}
                badge="Acesso"
                title="Entrar na sua conta"
                description="Continue para acessar suas analises, monitoramentos e oportunidades de compra."
            />

            <form onSubmit={submit} className="auth-form">
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="voce@empresa.com"
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <InputLabel htmlFor="password" value="Senha" className="!mb-0" />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-semibold underline-offset-4 hover:underline"
                                style={{ color: '#7c3aed' }}
                            >
                                Esqueceu sua senha?
                            </Link>
                        )}
                    </div>
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-2 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Digite sua senha"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <label className="flex select-none items-center">
                    <Checkbox
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                    />
                    <span className="ms-2 text-sm" style={{ color: '#6b6b8a' }}>
                        Manter conectado
                    </span>
                </label>

                <PrimaryButton className="w-full" disabled={processing}>
                    {processing ? 'Entrando...' : 'Entrar'}
                </PrimaryButton>
            </form>

            <AuthFooterAction
                text="Ainda nao tem conta?"
                linkLabel="Criar conta gratuita"
                href={route('register')}
            />
        </GuestLayout>
    );
}
