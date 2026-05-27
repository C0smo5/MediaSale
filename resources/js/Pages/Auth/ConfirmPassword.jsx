import AuthFooterAction from '@/Components/Auth/AuthFooterAction';
import AuthPageHeader from '@/Components/Auth/AuthPageHeader';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

const LockIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirmar senha" />

            <AuthPageHeader
                icon={<LockIcon />}
                badge="Confirmacao"
                title="Confirme sua senha"
                description="Esta area exige uma confirmacao extra antes de continuar."
            />

            <form onSubmit={submit} className="auth-form">
                <div>
                    <InputLabel htmlFor="password" value="Senha" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Digite sua senha atual"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <PrimaryButton className="w-full" disabled={processing}>
                    {processing ? 'Confirmando...' : 'Confirmar acesso'}
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
