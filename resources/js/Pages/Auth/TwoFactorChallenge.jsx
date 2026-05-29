import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

const ShieldIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

export default function TwoFactorChallenge({ smsFallbackAvailable = false }) {
    const [useRecovery, setUseRecovery] = useState(false);
    const [smsSent, setSmsSent] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({ code: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('two-factor.verify'), { onError: () => reset('code') });
    };

    const sendSms = () => {
        router.post(route('two-factor.challenge.sms'), {}, {
            onSuccess: () => setSmsSent(true),
        });
    };

    return (
        <GuestLayout>
            <Head title="Verificação em dois fatores" />

            <div className="mb-7 text-center">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-soft text-brand mb-4">
                    <ShieldIcon />
                </span>
                <h1 className="text-xl font-bold text-ink">Verificação em dois fatores</h1>
                <p className="mt-2 text-sm text-muted">
                    {useRecovery
                        ? 'Digite um dos seus códigos de recuperação.'
                        : smsSent
                        ? 'Enviamos um código por SMS. Verifique seu celular.'
                        : 'Digite o código do seu aplicativo autenticador.'}
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="code" value={useRecovery ? 'Código de recuperação' : 'Código de 6 dígitos'} />
                    <TextInput
                        id="code"
                        type="text"
                        name="code"
                        value={data.code}
                        className="orin-input mt-1 block w-full"
                        autoComplete="one-time-code"
                        autoFocus
                        inputMode={useRecovery ? 'text' : 'numeric'}
                        maxLength={useRecovery ? undefined : 6}
                        onChange={(e) => setData('code', e.target.value)}
                    />
                    <InputError message={errors.code} className="mt-2" />
                </div>

                <PrimaryButton disabled={processing} className="w-full justify-center">
                    Verificar
                </PrimaryButton>
            </form>

            <div className="mt-6 flex flex-col gap-2 text-center text-sm">
                {smsFallbackAvailable && !useRecovery && (
                    <button
                        type="button"
                        onClick={sendSms}
                        className="text-brand hover:underline disabled:opacity-50"
                        disabled={smsSent}
                    >
                        {smsSent ? 'Código enviado' : 'Receber código por SMS'}
                    </button>
                )}
                <button
                    type="button"
                    onClick={() => { setUseRecovery(!useRecovery); reset('code'); }}
                    className="text-muted hover:text-ink transition-colors"
                >
                    {useRecovery ? '← Usar aplicativo autenticador' : 'Usar código de recuperação'}
                </button>
            </div>
        </GuestLayout>
    );
}
