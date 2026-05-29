import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

function Field({ label, id, error, children }) {
    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="block text-sm font-medium" style={{ color: '#1a1040' }}>
                {label}
            </label>
            {children}
            {error && <InputError message={error} className="mt-1" />}
        </div>
    );
}

function StyledInput({ id, type = 'text', value, onChange, autoComplete, isFocused, required }) {
    return (
        <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            required={required}
            autoFocus={isFocused}
            className="orin-input py-2.5"
        />
    );
}

export default function UpdateProfileInformationForm({ mustVerifyEmail, className = '' }) {
    const user = usePage().props.auth.user;
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (event) => {
        event.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="max-w-lg space-y-5">
                <Field label="Nome completo" id="name" error={errors.name}>
                    <StyledInput
                        id="name"
                        value={data.name}
                        onChange={(event) => setData('name', event.target.value)}
                        autoComplete="name"
                        isFocused
                        required
                    />
                </Field>

                <Field label="E-mail" id="email" error={errors.email}>
                    <StyledInput
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(event) => setData('email', event.target.value)}
                        autoComplete="username"
                        required
                    />
                </Field>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-xl border p-4" style={{ backgroundColor: '#fff7ed', borderColor: 'rgba(234,88,12,0.25)' }}>
                        <p className="text-sm" style={{ color: '#1a1040' }}>
                            Seu e-mail ainda nao foi verificado.{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="font-semibold underline transition-colors"
                                style={{ color: '#ea580c' }}
                            >
                                Reenviar e-mail de verificacao
                            </Link>
                        </p>
                    </div>
                )}

                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 4px 14px rgba(124,58,237,0.25)' }}
                    >
                        {processing ? 'Salvando...' : 'Salvar alteracoes'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="translate-y-1 opacity-0"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <p className="flex items-center gap-1.5 text-sm font-medium" style={{ color: '#059669' }}>
                            <span>OK</span> Salvo com sucesso
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
