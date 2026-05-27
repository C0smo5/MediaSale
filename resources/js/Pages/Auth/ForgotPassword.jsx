import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Recuperar senha" />

            <div className="mb-8">
                <span
                    className="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
                    style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}
                >
                    Recuperacao
                </span>
                <h1 className="mt-4 text-3xl font-bold" style={{ color: '#1a1040' }}>
                    Esqueceu sua senha?
                </h1>
                <p className="mt-2 text-sm leading-6" style={{ color: '#6b6b8a' }}>
                    Informe seu e-mail e enviaremos um link para redefinir seu acesso com seguranca.
                </p>
            </div>

            {status && (
                <div
                    className="mb-6 rounded-2xl border px-4 py-3 text-sm font-medium"
                    style={{ backgroundColor: '#ecfdf5', borderColor: 'rgba(5,150,105,0.22)', color: '#059669' }}
                >
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="voce@empresa.com"
                    />
                </div>

                <InputError message={errors.email} className="mt-2" />

                <div className="pt-2">
                    <PrimaryButton className="w-full" disabled={processing}>
                        {processing ? 'Enviando link...' : 'Enviar link de redefinicao'}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
