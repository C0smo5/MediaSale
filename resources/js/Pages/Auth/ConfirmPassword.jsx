import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

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

            <div className="mb-8">
                <span
                    className="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
                    style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}
                >
                    Confirmacao
                </span>
                <h1 className="mt-4 text-3xl font-bold" style={{ color: '#1a1040' }}>
                    Confirme sua senha
                </h1>
                <p className="mt-2 text-sm leading-6" style={{ color: '#6b6b8a' }}>
                    Esta area exige uma confirmacao extra antes de continuar.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
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

                <div className="pt-2">
                    <PrimaryButton className="w-full" disabled={processing}>
                        {processing ? 'Confirmando...' : 'Confirmar acesso'}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
