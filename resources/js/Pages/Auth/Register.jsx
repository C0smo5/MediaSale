import AuthFooterAction from '@/Components/Auth/AuthFooterAction';
import AuthPageHeader from '@/Components/Auth/AuthPageHeader';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

const SignupIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
);

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        cpf: '',
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
        <GuestLayout>
            <Head title="Criar conta" />

            <AuthPageHeader
                icon={<SignupIcon />}
                badge="Cadastro"
                title="Criar sua conta"
                description="Informe seus dados para iniciar. Na proxima etapa voce confirma e-mail e telefone com codigos de verificacao."
            />

            <form onSubmit={submit} className="auth-form">
                <div>
                    <InputLabel htmlFor="name" value="Nome completo" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        placeholder="Seu nome"
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        placeholder="voce@gmail.com"
                    />
                    <p className="mt-1.5 break-words text-xs" style={{ color: '#6b6b8a' }}>
                        Use um e-mail de provedor conhecido (Gmail, Outlook, Yahoo, iCloud, etc.).
                    </p>
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="auth-field-grid">
                    <div className="auth-field-group">
                        <InputLabel htmlFor="phone" value="Celular" />
                        <TextInput
                            id="phone"
                            type="tel"
                            name="phone"
                            value={data.phone}
                            className="mt-1 block w-full"
                            autoComplete="tel"
                            onChange={(e) => setData('phone', e.target.value)}
                            required
                            placeholder="(11) 98765-4321"
                            inputMode="tel"
                        />
                        <InputError message={errors.phone} className="mt-2" />
                    </div>

                    <div className="auth-field-group">
                        <InputLabel htmlFor="cpf" value="CPF" />
                        <TextInput
                            id="cpf"
                            name="cpf"
                            value={data.cpf}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('cpf', e.target.value)}
                            required
                            placeholder="000.000.000-00"
                            inputMode="numeric"
                        />
                        <InputError message={errors.cpf} className="mt-2" />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Senha" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        placeholder="Crie uma senha forte"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirmar senha" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                        placeholder="Repita sua senha"
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <PrimaryButton className="w-full" disabled={processing}>
                    {processing ? 'Continuando...' : 'Continuar para verificacao'}
                </PrimaryButton>
            </form>

            <AuthFooterAction
                text="Ja possui uma conta?"
                linkLabel="Entrar agora"
                href={route('login')}
            />
        </GuestLayout>
    );
}
