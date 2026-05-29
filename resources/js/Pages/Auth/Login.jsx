import AuthFooterAction from '@/Components/Auth/AuthFooterAction';
import AuthPageHeader from '@/Components/Auth/AuthPageHeader';
import GoogleAuthButton from '@/Components/Auth/GoogleAuthButton';
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

export default function Login({ canResetPassword, redirect: redirectTo = null, errors: serverErrors = {} }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        redirect: redirectTo ?? '',
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

            <AuthPageHeader
                icon={<LoginIcon />}
                badge="Acesso"
                title="Entrar na sua conta"
                description="Continue para acessar suas analises, monitoramentos e oportunidades de compra."
            />

            <GoogleAuthButton error={serverErrors.google} />

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" style={{ borderColor: 'rgba(124,58,237,0.15)' }} />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-wider">
                    <span className="bg-[#f8f7ff] px-3 text-gray-500">ou</span>
                </div>
            </div>

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
