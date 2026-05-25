import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef(null);
    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        password: '',
    });

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    const deleteUser = (event) => {
        event.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <div className="space-y-6">
                <div className="rounded-xl border p-5 space-y-2" style={{ backgroundColor: '#fff7ed', borderColor: 'rgba(234,88,12,0.25)' }}>
                    <p className="text-sm font-semibold" style={{ color: '#ea580c' }}>Excluir conta permanentemente</p>
                    <p className="text-sm" style={{ color: '#6b6b8a' }}>
                        Ao excluir a conta, seu historico, preferencias e configuracoes serao apagados de forma permanente.
                        Essa acao <strong style={{ color: '#1a1040' }}>nao pode ser desfeita</strong>.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setConfirmingUserDeletion(true)}
                    className="rounded-xl border px-6 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                    style={{ backgroundColor: 'transparent', borderColor: 'rgba(234,88,12,0.40)', color: '#ea580c' }}
                    onMouseEnter={(event) => {
                        event.currentTarget.style.backgroundColor = '#fff7ed';
                    }}
                    onMouseLeave={(event) => {
                        event.currentTarget.style.backgroundColor = 'transparent';
                    }}
                >
                    Excluir minha conta
                </button>
            </div>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="space-y-5 p-6">
                    <div>
                        <h2 className="text-lg font-bold" style={{ color: '#1a1040' }}>
                            Tem certeza que deseja excluir sua conta?
                        </h2>
                        <p className="mt-1.5 text-sm" style={{ color: '#6b6b8a' }}>
                            Essa acao e permanente. Digite sua senha para confirmar a exclusao.
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="delete_password" className="block text-sm font-medium" style={{ color: '#1a1040' }}>
                            Sua senha
                        </label>
                        <input
                            id="delete_password"
                            type="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(event) => setData('password', event.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all duration-200"
                            style={{ backgroundColor: '#f8f7ff', borderColor: 'rgba(234,88,12,0.30)', color: '#1a1040' }}
                            onFocus={(event) => {
                                event.target.style.borderColor = '#ea580c';
                                event.target.style.boxShadow = '0 0 0 3px rgba(234,88,12,0.10)';
                            }}
                            onBlur={(event) => {
                                event.target.style.borderColor = 'rgba(234,88,12,0.30)';
                                event.target.style.boxShadow = 'none';
                            }}
                        />
                        <InputError message={errors.password} className="mt-1" />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all"
                            style={{ borderColor: 'rgba(124,58,237,0.20)', color: '#6b6b8a', backgroundColor: '#f8f7ff' }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
                            style={{ backgroundColor: '#ea580c', boxShadow: '0 4px 14px rgba(234,88,12,0.25)' }}
                        >
                            {processing ? 'Excluindo...' : 'Confirmar exclusao'}
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
