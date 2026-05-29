import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

function StyledInput({ id, type = 'password', value, onChange, autoComplete, refProp, placeholder }) {
    const [show, setShow] = useState(false);
    const isPassword = type === 'password';

    return (
        <div className="relative">
            <input
                id={id}
                ref={refProp}
                type={isPassword && show ? 'text' : type}
                value={value}
                onChange={onChange}
                autoComplete={autoComplete}
                placeholder={placeholder}
                className="orin-input py-2.5 pr-10"
            />
            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShow((state) => !state)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium transition-colors"
                    style={{ color: '#6b6b8a' }}
                >
                    {show ? 'Ocultar' : 'Ver'}
                </button>
            )}
        </div>
    );
}

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

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef(null);
    const currentPasswordInput = useRef(null);
    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (event) => {
        event.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (formErrors) => {
                if (formErrors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (formErrors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <form onSubmit={updatePassword} className="max-w-lg space-y-5">
                <div className="rounded-xl border p-4" style={{ backgroundColor: '#ede9fe', borderColor: 'rgba(124,58,237,0.20)' }}>
                    <p className="text-xs" style={{ color: '#7c3aed' }}>
                        Use no minimo 8 caracteres com letras maiusculas, minusculas, numeros e simbolos.
                    </p>
                </div>

                <Field label="Senha atual" id="current_password" error={errors.current_password}>
                    <StyledInput
                        id="current_password"
                        value={data.current_password}
                        onChange={(event) => setData('current_password', event.target.value)}
                        autoComplete="current-password"
                        refProp={currentPasswordInput}
                    />
                </Field>

                <Field label="Nova senha" id="password" error={errors.password}>
                    <StyledInput
                        id="password"
                        value={data.password}
                        onChange={(event) => setData('password', event.target.value)}
                        autoComplete="new-password"
                        refProp={passwordInput}
                    />
                </Field>

                <Field label="Confirmar nova senha" id="password_confirmation" error={errors.password_confirmation}>
                    <StyledInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(event) => setData('password_confirmation', event.target.value)}
                        autoComplete="new-password"
                    />
                </Field>

                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 4px 14px rgba(124,58,237,0.25)' }}
                    >
                        {processing ? 'Atualizando...' : 'Atualizar senha'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="translate-y-1 opacity-0"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <p className="flex items-center gap-1.5 text-sm font-medium" style={{ color: '#059669' }}>
                            <span>OK</span> Senha atualizada
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
