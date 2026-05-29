import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import { useRef } from 'react';

const GoogleIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

function AccountBadge({ connected, label }) {
    return (
        <span
            className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{
                backgroundColor: connected ? 'rgba(5,150,105,0.12)' : 'rgba(124,58,237,0.08)',
                color: connected ? '#059669' : '#6b6b8a',
            }}
        >
            {connected ? 'Conectado' : 'Nao conectado'} · {label}
        </span>
    );
}

function StyledPasswordInput({ id, value, onChange, autoComplete, refProp }) {
    return (
        <input
            id={id}
            ref={refProp}
            type="password"
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            className="orin-input py-2.5"
        />
    );
}

export default function LinkedAccountsForm({ linkedAccounts, status, className = '' }) {
    const { errors } = usePage().props;
    const googleError = errors.google;
    const passwordInput = useRef(null);

    const passwordForm = useForm({
        password: '',
        password_confirmation: '',
    });

    const unlinkForm = useForm({
        password: '',
    });

    const createOrinPassword = (event) => {
        event.preventDefault();
        passwordForm.post(route('profile.password.create'), {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
            onError: () => passwordInput.current?.focus(),
        });
    };

    const unlinkGoogle = (event) => {
        event.preventDefault();
        unlinkForm.delete(route('profile.google.unlink'), {
            preserveScroll: true,
            onSuccess: () => unlinkForm.reset(),
        });
    };

    return (
        <section className={className}>
            <div
                className="mb-5 rounded-xl border p-4"
                style={{ backgroundColor: '#f8f7ff', borderColor: 'rgba(124,58,237,0.18)' }}
            >
                <p className="text-sm font-semibold" style={{ color: '#1a1040' }}>
                    Tipo de conta: {linkedAccounts.accountTypeLabel}
                </p>
                <p className="mt-1 text-xs" style={{ color: '#6b6b8a' }}>
                    Identificador interno: <span className="font-mono">{linkedAccounts.accountType}</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                    <AccountBadge connected={linkedAccounts.hasOrinPassword} label="Orin" />
                    <AccountBadge connected={linkedAccounts.hasGoogle} label="Google" />
                </div>
            </div>

            {status === 'google-linked' && (
                <div
                    className="mb-4 rounded-xl border px-4 py-3 text-sm font-medium"
                    style={{ backgroundColor: '#ecfdf5', borderColor: 'rgba(5,150,105,0.22)', color: '#059669' }}
                >
                    Conta Google conectada com sucesso.
                </div>
            )}
            {status === 'google-unlinked' && (
                <div
                    className="mb-4 rounded-xl border px-4 py-3 text-sm font-medium"
                    style={{ backgroundColor: '#f0eeff', borderColor: 'rgba(124,58,237,0.22)', color: '#7c3aed' }}
                >
                    Conta Google desconectada.
                </div>
            )}
            {status === 'orin-password-created' && (
                <div
                    className="mb-4 rounded-xl border px-4 py-3 text-sm font-medium"
                    style={{ backgroundColor: '#ecfdf5', borderColor: 'rgba(5,150,105,0.22)', color: '#059669' }}
                >
                    Senha Orin criada. Agora voce pode entrar com e-mail e senha.
                </div>
            )}

            {googleError && (
                <div className="mb-4">
                    <InputError message={googleError} />
                </div>
            )}

            <div className="space-y-6">
                <div className="rounded-xl border p-4" style={{ borderColor: 'rgba(124,58,237,0.12)' }}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                            {linkedAccounts.hasGoogle && linkedAccounts.googleAvatar ? (
                                <img
                                    src={linkedAccounts.googleAvatar}
                                    alt=""
                                    className="h-10 w-10 rounded-full border object-cover"
                                    style={{ borderColor: 'rgba(124,58,237,0.18)' }}
                                />
                            ) : (
                                <span
                                    className="flex h-10 w-10 items-center justify-center rounded-full border bg-white"
                                    style={{ borderColor: 'rgba(124,58,237,0.18)' }}
                                >
                                    <GoogleIcon />
                                </span>
                            )}
                            <div>
                                <h3 className="text-sm font-semibold" style={{ color: '#1a1040' }}>
                                    Google
                                </h3>
                                <p className="text-xs" style={{ color: '#6b6b8a' }}>
                                    Entre com um clique usando sua conta Google.
                                </p>
                            </div>
                        </div>
                        {linkedAccounts.canLinkGoogle && (
                            <a
                                href={route('auth.google.link')}
                                className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold no-underline transition-all hover:border-[#7c3aed] hover:bg-[#f8f7ff]"
                                style={{ borderColor: 'rgba(124,58,237,0.18)', color: '#1a1040' }}
                            >
                                <GoogleIcon />
                                Conectar Google
                            </a>
                        )}
                    </div>

                    {linkedAccounts.canUnlinkGoogle && (
                        <form onSubmit={unlinkGoogle} className="mt-4 space-y-3 border-t pt-4" style={{ borderColor: 'rgba(124,58,237,0.10)' }}>
                            <p className="text-xs" style={{ color: '#6b6b8a' }}>
                                Para desconectar, confirme sua senha Orin.
                            </p>
                            <StyledPasswordInput
                                id="unlink_password"
                                value={unlinkForm.data.password}
                                onChange={(event) => unlinkForm.setData('password', event.target.value)}
                                autoComplete="current-password"
                            />
                            <InputError message={unlinkForm.errors.password} />
                            <button
                                type="submit"
                                disabled={unlinkForm.processing}
                                className="rounded-xl border px-4 py-2 text-sm font-semibold transition-colors hover:bg-red-50 disabled:opacity-60"
                                style={{ borderColor: 'rgba(239,68,68,0.35)', color: '#dc2626' }}
                            >
                                {unlinkForm.processing ? 'Desconectando...' : 'Desconectar Google'}
                            </button>
                        </form>
                    )}
                </div>

                <div className="rounded-xl border p-4" style={{ borderColor: 'rgba(124,58,237,0.12)' }}>
                    <h3 className="text-sm font-semibold" style={{ color: '#1a1040' }}>
                        Orin (e-mail e senha)
                    </h3>
                    <p className="mt-1 text-xs" style={{ color: '#6b6b8a' }}>
                        {linkedAccounts.hasOrinPassword
                            ? 'Voce ja pode entrar com e-mail e senha cadastrados no Orin.'
                            : 'Crie uma senha para entrar no Orin sem usar o Google.'}
                    </p>

                    {linkedAccounts.canSetOrinPassword ? (
                        <form onSubmit={createOrinPassword} className="mt-4 space-y-3">
                            <div>
                                <label htmlFor="link_password" className="block text-sm font-medium" style={{ color: '#1a1040' }}>
                                    Nova senha
                                </label>
                                <StyledPasswordInput
                                    id="link_password"
                                    refProp={passwordInput}
                                    value={passwordForm.data.password}
                                    onChange={(event) => passwordForm.setData('password', event.target.value)}
                                    autoComplete="new-password"
                                />
                                <InputError message={passwordForm.errors.password} className="mt-1" />
                            </div>
                            <div>
                                <label
                                    htmlFor="link_password_confirmation"
                                    className="block text-sm font-medium"
                                    style={{ color: '#1a1040' }}
                                >
                                    Confirmar senha
                                </label>
                                <StyledPasswordInput
                                    id="link_password_confirmation"
                                    value={passwordForm.data.password_confirmation}
                                    onChange={(event) => passwordForm.setData('password_confirmation', event.target.value)}
                                    autoComplete="new-password"
                                />
                                <InputError message={passwordForm.errors.password_confirmation} className="mt-1" />
                            </div>
                            <button
                                type="submit"
                                disabled={passwordForm.processing}
                                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                                style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
                            >
                                {passwordForm.processing ? 'Salvando...' : 'Criar senha Orin'}
                            </button>
                            <Transition
                                show={passwordForm.recentlySuccessful}
                                enter="transition ease-in-out duration-300"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out duration-300"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm font-medium" style={{ color: '#059669' }}>
                                    Senha criada com sucesso.
                                </p>
                            </Transition>
                        </form>
                    ) : (
                        <p className="mt-3 text-xs font-medium" style={{ color: '#059669' }}>
                            Senha Orin ativa. Altere em &quot;Senha&quot; no menu ao lado.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
