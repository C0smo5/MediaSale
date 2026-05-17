import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import AuthLandingLayout from '@/Layouts/AuthLandingLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const inputClass =
    'mt-1 block w-full rounded-xl border-brand-default bg-surface-alt/80 px-4 py-3 text-sm text-ink shadow-sm focus:border-brand focus:ring-brand/25';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLandingLayout
            title="Crie sua conta"
            subtitle="Comece grátis e descubra os melhores produtos com IA"
        >
            <Head title="Cadastro" />

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="name" value="Nome" className="text-sm font-medium text-ink" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className={inputClass}
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="E-mail" className="text-sm font-medium text-ink" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className={inputClass}
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
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
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar senha"
                        className="text-sm font-medium text-ink"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className={inputClass}
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full gradient-brand text-white font-semibold px-6 py-3.5 rounded-2xl hover:shadow-lg hover:shadow-brand/25 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                    Criar conta
                </button>

                <p className="text-center text-sm text-muted">
                    Já tem uma conta?{' '}
                    <Link
                        href={route('login')}
                        className="font-semibold text-brand hover:text-brand-light transition-colors"
                    >
                        Entrar
                    </Link>
                </p>
            </form>
        </AuthLandingLayout>
    );
}
