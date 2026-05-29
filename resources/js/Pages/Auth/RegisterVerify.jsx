import AuthCard, { AuthCardCell, AuthCardGrid } from '@/Components/Auth/AuthCard';
import AuthFooterAction from '@/Components/Auth/AuthFooterAction';
import AuthPageHeader from '@/Components/Auth/AuthPageHeader';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const ShieldCheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
    </svg>
);

const MailIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const PhoneIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

function CardHeader({ icon, title, target }) {
    return (
        <div className="flex items-start gap-3">
            <span
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}
            >
                {icon}
            </span>
            <div className="min-w-0">
                <p className="text-sm font-semibold" style={{ color: '#1a1040' }}>
                    {title}
                </p>
                <p className="mt-0.5 break-all text-xs" style={{ color: '#6b6b8a' }}>
                    Enviado para {target}
                </p>
            </div>
        </div>
    );
}

function VerifiedCard({ icon, channel, target }) {
    return (
        <AuthCard variant="success" className="justify-center">
            <div className="flex items-start gap-3">
                <span
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: 'rgba(5,150,105,0.14)', color: '#059669' }}
                >
                    {icon}
                </span>
                <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: '#059669' }}>
                        <CheckIcon /> {channel} confirmado
                    </p>
                    <p className="mt-0.5 break-all text-xs" style={{ color: '#047857' }}>
                        {target}
                    </p>
                </div>
            </div>
        </AuthCard>
    );
}

function VerificationForm({
    icon,
    title,
    target,
    inputId,
    form,
    onSubmit,
    onResend,
    cooldown,
    resending,
    debugCode,
    debugLabel,
    submittingText,
    submitText,
    resendCooldownText,
    resendText,
}) {
    return (
        <AuthCard as="form" onSubmit={onSubmit} className="auth-form !min-h-0 !space-y-0">
            <div className="flex flex-1 flex-col gap-5">
                <CardHeader icon={icon} title={title} target={target} />

                <div className="flex-1">
                    <InputLabel htmlFor={inputId} value="Codigo de 6 digitos" />
                    <TextInput
                        id={inputId}
                        name="code"
                        value={form.data.code}
                        className="mt-1 block w-full text-center text-lg font-semibold tracking-[0.4em]"
                        onChange={(e) => form.setData('code', e.target.value)}
                        required
                        inputMode="numeric"
                        placeholder="000000"
                        maxLength={6}
                    />
                    <InputError message={form.errors.code} className="mt-2" />
                </div>

                {debugCode ? (
                    <p className="break-words text-xs" style={{ color: '#6b6b8a' }}>
                        {debugLabel}:{' '}
                        <span className="font-mono font-semibold" style={{ color: '#7c3aed' }}>
                            {debugCode}
                        </span>
                    </p>
                ) : (
                    <span className="hidden sm:block" aria-hidden />
                )}
            </div>

            <div className="mt-5 flex flex-col gap-3">
                <PrimaryButton className="w-full" disabled={form.processing}>
                    {form.processing ? submittingText : submitText}
                </PrimaryButton>

                <button
                    type="button"
                    onClick={onResend}
                    disabled={resending || cooldown > 0}
                    className="text-center text-sm font-semibold underline-offset-4 transition-opacity hover:underline disabled:opacity-50"
                    style={{ color: '#7c3aed' }}
                >
                    {cooldown > 0 ? resendCooldownText(cooldown) : resendText}
                </button>
            </div>
        </AuthCard>
    );
}

export default function RegisterVerify({
    emailVerified,
    phoneVerified,
    maskedEmail,
    maskedPhone,
    resendCooldown,
    debugSmsCode,
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
        if (emailCooldown <= 0) return undefined;
        const timer = setInterval(() => {
            setEmailCooldown((current) => Math.max(current - 1, 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [emailCooldown]);

    useEffect(() => {
        if (phoneCooldown <= 0) return undefined;
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

    const totalSteps = 3;
    const completedSteps = 1 + (emailVerified ? 1 : 0) + (phoneVerified ? 1 : 0);
    const progress = Math.round((completedSteps / totalSteps) * 100);

    return (
        <GuestLayout>
            <Head title="Verificar cadastro" />

            <AuthPageHeader
                icon={<ShieldCheckIcon />}
                badge="Verificacao"
                title="Confirme seu cadastro"
                description="Etapa 2 de 3 — informe os codigos enviados para validar seu acesso. Voce pode confirmar e-mail e telefone em qualquer ordem."
            />

            <div className="mb-6">
                <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-semibold" style={{ color: '#1a1040' }}>
                        {completedSteps} de {totalSteps} confirmados
                    </span>
                    <span style={{ color: '#6b6b8a' }}>{progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: '#ede9fe' }}>
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${progress}%`,
                            background: 'linear-gradient(90deg, #7c3aed, #a855f7)',
                        }}
                    />
                </div>
            </div>

            <AuthCardGrid>
                <AuthCardCell>
                    {emailVerified ? (
                        <VerifiedCard icon={<MailIcon />} channel="E-mail" target={maskedEmail} />
                    ) : (
                        <VerificationForm
                            icon={<MailIcon />}
                            title="Confirmar e-mail"
                            target={maskedEmail}
                            inputId="email_code"
                            form={emailForm}
                            onSubmit={submitEmail}
                            onResend={resendEmail}
                            cooldown={emailCooldown}
                            resending={resendEmailForm.processing}
                            submittingText="Verificando..."
                            submitText="Confirmar e-mail"
                            resendCooldownText={(s) => `Reenviar e-mail em ${s}s`}
                            resendText="Reenviar codigo por e-mail"
                        />
                    )}
                </AuthCardCell>

                <AuthCardCell>
                    {phoneVerified ? (
                        <VerifiedCard icon={<PhoneIcon />} channel="Telefone" target={maskedPhone} />
                    ) : (
                        <VerificationForm
                            icon={<PhoneIcon />}
                            title="Confirmar telefone"
                            target={maskedPhone}
                            inputId="phone_code"
                            form={phoneForm}
                            onSubmit={submitPhone}
                            onResend={resendPhone}
                            cooldown={phoneCooldown}
                            resending={resendPhoneForm.processing}
                            debugCode={debugSmsCode}
                            debugLabel="Codigo SMS (dev)"
                            submittingText="Verificando..."
                            submitText="Confirmar telefone"
                            resendCooldownText={(s) => `Reenviar SMS em ${s}s`}
                            resendText="Reenviar codigo por SMS"
                        />
                    )}
                </AuthCardCell>
            </AuthCardGrid>

            <AuthFooterAction
                text="Quer trocar de conta?"
                linkLabel="Sair e recomecar"
                href={route('logout')}
                method="post"
                as="button"
            />
        </GuestLayout>
    );
}
