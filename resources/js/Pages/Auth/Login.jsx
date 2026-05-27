import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

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
                    className="mb-6 rounded-2xl border px-4 py-3 text-sm font-medium"
                    style={{ backgroundColor: '#ecfdf5', borderColor: 'rgba(5,150,105,0.22)', color: '#059669' }}
                >
                    {status}
                </div>
            )}

            <div className="mb-8">
                <span
                    className="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
                    style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}
                >
                    Acesso
                </span>
                <h1 className="mt-4 text-3xl font-bold" style={{ color: '#1a1040' }}>
                    Entrar na sua conta
                </h1>
                <p className="mt-2 text-sm leading-6" style={{ color: '#6b6b8a' }}>
                    Continue para acessar suas analises, monitoramentos e oportunidades de compra.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
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
                    <InputLabel htmlFor="password" value="Senha" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Digite sua senha"
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm" style={{ color: '#6b6b8a' }}>
                            Manter conectado
                        </span>
                    </label>
                </div>

                <div className="flex flex-col gap-4 pt-2">
                    <div className="flex items-center justify-between gap-4">
                        {canResetPassword ? (
                            <Link
                                href={route('password.request')}
                                className="text-sm font-medium underline underline-offset-4"
                                style={{ color: '#7c3aed' }}
                            >
                                Esqueceu sua senha?
                            </Link>
                        ) : (
                            <span />
                        )}

                        <Link
                            href={route('register')}
                            className="text-sm font-medium underline underline-offset-4"
                            style={{ color: '#6b6b8a' }}
                        >
                            Criar conta
                        </Link>
                    </div>

                    <PrimaryButton className="w-full" disabled={processing}>
                        {processing ? 'Entrando...' : 'Entrar'}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
