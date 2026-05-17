import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import AuthLandingLayout from '@/Layouts/AuthLandingLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const inputClass =
    'mt-1 block w-full rounded-xl border-brand-default bg-surface-alt/80 px-4 py-3 text-sm text-ink shadow-sm focus:border-brand focus:ring-brand/25';

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
        <AuthLandingLayout
            title="Bem-vindo de volta"
            subtitle="Entre na sua conta para continuar comparando produtos"
        >
            <Head title="Entrar" />

            {status && (
                <div className="mb-4 rounded-xl bg-green-soft border border-emerald-default px-4 py-3 text-sm font-medium text-emerald-brand">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="E-mail" className="text-sm font-medium text-ink" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className={inputClass}
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Senha" className="text-sm font-medium text-ink" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className={inputClass}
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between gap-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            className="rounded border-brand-default text-brand focus:ring-brand/25"
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-sm text-muted">Lembrar de mim</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm font-medium text-brand hover:text-brand-light transition-colors"
                        >
                            Esqueceu a senha?
                        </Link>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full gradient-brand text-white font-semibold px-6 py-3.5 rounded-2xl hover:shadow-lg hover:shadow-brand/25 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                    Entrar
                </button>

                <p className="text-center text-sm text-muted">
                    Ainda não tem conta?{' '}
                    <Link
                        href={route('register')}
                        className="font-semibold text-brand hover:text-brand-light transition-colors"
                    >
                        Criar conta grátis
                    </Link>
                </p>
            </form>
        </AuthLandingLayout>
    );
}
