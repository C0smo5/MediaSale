import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function RegisterVerify({
    emailVerified,
    phoneVerified,
    maskedEmail,
    maskedPhone,
    resendCooldown,
    debugSmsCode,
    status,
}) {
    const emailForm = useForm({ code: '' });
    const phoneForm = useForm({ code: '' });
    const resendEmailForm = useForm({});
    const resendPhoneForm = useForm({});

    const [emailCooldown, setEmailCooldown] = useState(resendCooldown.email);
    const [phoneCooldown, setPhoneCooldown] = useState(resendCooldown.phone);

    useEffect(() => {
        setEmailCooldown(resendCooldown.email);
        setPhoneCooldown(resendCooldown.phone);
    }, [resendCooldown.email, resendCooldown.phone]);

    useEffect(() => {
        if (emailCooldown <= 0) {
            return undefined;
        }

        const timer = setInterval(() => {
            setEmailCooldown((current) => Math.max(current - 1, 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [emailCooldown]);

    useEffect(() => {
        if (phoneCooldown <= 0) {
            return undefined;
        }

        const timer = setInterval(() => {
            setPhoneCooldown((current) => Math.max(current - 1, 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [phoneCooldown]);

    const submitEmail = (e) => {
        e.preventDefault();
        emailForm.post(route('register.verify.email'));
    };

    const submitPhone = (e) => {
        e.preventDefault();
        phoneForm.post(route('register.verify.phone'));
    };

    const resendEmail = (e) => {
        e.preventDefault();
        resendEmailForm.post(route('register.verify.resend.email'), {
            onSuccess: () => setEmailCooldown(60),
        });
    };

    const resendPhone = (e) => {
        e.preventDefault();
        resendPhoneForm.post(route('register.verify.resend.phone'), {
            onSuccess: () => setPhoneCooldown(60),
        });
    };

    return (
        <GuestLayout>
            <Head title="Verificar cadastro" />

            <div className="mb-8">
                <span
                    className="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
                    style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}
                >
                    Verificacao
                </span>
                <h1 className="mt-4 text-3xl font-bold" style={{ color: '#1a1040' }}>
                    Confirme seu cadastro
                </h1>
                <p className="mt-2 text-sm leading-6" style={{ color: '#6b6b8a' }}>
                    Informe os codigos enviados para {maskedEmail} e {maskedPhone}.
                </p>
            </div>

            <div className="mb-6 flex gap-3">
                <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                        backgroundColor: emailVerified ? '#ecfdf5' : '#ede9fe',
                        color: emailVerified ? '#059669' : '#7c3aed',
                    }}
                >
                    E-mail {emailVerified ? 'confirmado' : 'pendente'}
                </span>
                <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                        backgroundColor: phoneVerified ? '#ecfdf5' : '#ede9fe',
                        color: phoneVerified ? '#059669' : '#7c3aed',
                    }}
                >
                    SMS {phoneVerified ? 'confirmado' : 'pendente'}
                </span>
            </div>

            {status === 'email-verified' && (
                <div className="mb-4 rounded-2xl border px-4 py-3 text-sm" style={{ backgroundColor: '#ecfdf5', borderColor: 'rgba(5,150,105,0.22)', color: '#059669' }}>
                    E-mail verificado com sucesso.
                </div>
            )}

            {status === 'phone-verified' && (
                <div className="mb-4 rounded-2xl border px-4 py-3 text-sm" style={{ backgroundColor: '#ecfdf5', borderColor: 'rgba(5,150,105,0.22)', color: '#059669' }}>
                    Telefone verificado com sucesso.
                </div>
            )}

            {status === 'email-code-sent' && (
                <div className="mb-4 rounded-2xl border px-4 py-3 text-sm" style={{ backgroundColor: '#eff6ff', borderColor: 'rgba(37,99,235,0.22)', color: '#2563eb' }}>
                    Novo codigo enviado para o e-mail.
                </div>
            )}

            {status === 'phone-code-sent' && (
                <div className="mb-4 rounded-2xl border px-4 py-3 text-sm" style={{ backgroundColor: '#eff6ff', borderColor: 'rgba(37,99,235,0.22)', color: '#2563eb' }}>
                    Novo codigo enviado por SMS.
                </div>
            )}

            {!emailVerified && (
                <form onSubmit={submitEmail} className="mb-8 space-y-4 rounded-2xl border p-5" style={{ borderColor: 'rgba(124,58,237,0.15)' }}>
                    <div>
                        <InputLabel htmlFor="email_code" value="Codigo do e-mail" />
                        <TextInput
                            id="email_code"
                            name="code"
                            value={emailForm.data.code}
                            className="mt-1 block w-full"
                            onChange={(e) => emailForm.setData('code', e.target.value)}
                            required
                            inputMode="numeric"
                            placeholder="000000"
                            maxLength={6}
                        />
                        <InputError message={emailForm.errors.code} className="mt-2" />
                    </div>

                    <div className="flex flex-col gap-3">
                        <PrimaryButton className="w-full" disabled={emailForm.processing}>
                            {emailForm.processing ? 'Verificando...' : 'Confirmar e-mail'}
                        </PrimaryButton>

                        <button
                            type="button"
                            onClick={resendEmail}
                            disabled={resendEmailForm.processing || emailCooldown > 0}
                            className="text-sm font-medium underline underline-offset-4 disabled:opacity-50"
                            style={{ color: '#6b6b8a' }}
                        >
                            {emailCooldown > 0
                                ? `Reenviar e-mail em ${emailCooldown}s`
                                : 'Reenviar codigo por e-mail'}
                        </button>
                    </div>
                </form>
            )}

            {!phoneVerified && (
                <form onSubmit={submitPhone} className="space-y-4 rounded-2xl border p-5" style={{ borderColor: 'rgba(124,58,237,0.15)' }}>
                    <div>
                        <InputLabel htmlFor="phone_code" value="Codigo do SMS" />
                        <TextInput
                            id="phone_code"
                            name="code"
                            value={phoneForm.data.code}
                            className="mt-1 block w-full"
                            onChange={(e) => phoneForm.setData('code', e.target.value)}
                            required
                            inputMode="numeric"
                            placeholder="000000"
                            maxLength={6}
                        />
                        <InputError message={phoneForm.errors.code} className="mt-2" />
                    </div>

                    {debugSmsCode && (
                        <p className="text-xs" style={{ color: '#6b6b8a' }}>
                            Codigo SMS de desenvolvimento: {debugSmsCode}
                        </p>
                    )}

                    <div className="flex flex-col gap-3">
                        <PrimaryButton className="w-full" disabled={phoneForm.processing}>
                            {phoneForm.processing ? 'Verificando...' : 'Confirmar telefone'}
                        </PrimaryButton>

                        <button
                            type="button"
                            onClick={resendPhone}
                            disabled={resendPhoneForm.processing || phoneCooldown > 0}
                            className="text-sm font-medium underline underline-offset-4 disabled:opacity-50"
                            style={{ color: '#6b6b8a' }}
                        >
                            {phoneCooldown > 0
                                ? `Reenviar SMS em ${phoneCooldown}s`
                                : 'Reenviar codigo por SMS'}
                        </button>
                    </div>
                </form>
            )}

            <div className="mt-8">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="text-sm font-medium underline underline-offset-4"
                    style={{ color: '#6b6b8a' }}
                >
                    Sair
                </Link>
            </div>
        </GuestLayout>
    );
}
