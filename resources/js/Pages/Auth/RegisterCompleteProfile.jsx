import AuthPageHeader from '@/Components/Auth/AuthPageHeader';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

const ProfileIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

export default function RegisterCompleteProfile() {
    const { data, setData, post, processing, errors } = useForm({
        phone: '',
        cpf: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register.complete-profile.store'));
    };

    return (
        <GuestLayout>
            <Head title="Completar cadastro" />

            <AuthPageHeader
                icon={<ProfileIcon />}
                badge="Cadastro"
                title="Complete seu perfil"
                description="Informe telefone e CPF para continuar. Seu e-mail ja foi confirmado pelo Google."
            />

            <form onSubmit={submit} className="auth-form">
                <div>
                    <InputLabel htmlFor="phone" value="Telefone (WhatsApp)" />
                    <TextInput
                        id="phone"
                        name="phone"
                        value={data.phone}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('phone', e.target.value)}
                        placeholder="(11) 99999-9999"
                        required
                    />
                    <InputError message={errors.phone} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="cpf" value="CPF" />
                    <TextInput
                        id="cpf"
                        name="cpf"
                        value={data.cpf}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('cpf', e.target.value)}
                        placeholder="000.000.000-00"
                        required
                    />
                    <InputError message={errors.cpf} className="mt-2" />
                </div>

                <PrimaryButton className="w-full" disabled={processing}>
                    {processing ? 'Salvando...' : 'Continuar para verificacao'}
                </PrimaryButton>
            </form>
        </GuestLayout>
    );
}
