import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { confirmAction } from '@/lib/swal';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { plansByKey } from '@/data/plans';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const SettingsIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

const GeneralIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
);

const BellIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const ChatIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

const StoreIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const ShieldIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const PlanIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
);

const PrivacyIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const RoadmapIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
);

const sections = [
    { key: 'general', label: 'Geral', icon: GeneralIcon },
    { key: 'notifications', label: 'Notificacoes', icon: BellIcon },
    { key: 'chat', label: 'Chat e analises', icon: ChatIcon },
    { key: 'monitoring', label: 'Lojas', icon: StoreIcon },
    { key: 'security', label: 'Seguranca', icon: ShieldIcon },
    { key: 'plan', label: 'Plano e uso', icon: PlanIcon },
    { key: 'privacy', label: 'Privacidade', icon: PrivacyIcon },
    { key: 'roadmap', label: 'Recomendacoes', icon: RoadmapIcon },
];

const implementationRecommendations = [
    {
        title: 'Persistencia de preferencias',
        priority: 'Alta',
        items: [
            'Tabela user_settings ou JSON em users (settings column)',
            'API PATCH /settings com FormRequest e Policy',
            'Sincronizar toggles desta tela com o banco',
        ],
    },
    {
        title: 'Notificacoes',
        priority: 'Alta',
        items: [
            'Canais: e-mail (já existe OTP), SMS (LogSmsGateway / Twilio), push (opcional)',
            'Eventos: queda de preco, analise concluida, limite do plano',
            'Preferencias por canal + frequencia (imediato, digest diario)',
        ],
    },
    {
        title: 'Chat e IA',
        priority: 'Media',
        items: [
            'Limite de analises por plano (middleware ou service)',
            'Lojas padrao por usuario para filtrar buscas',
            'Historico real de conversas (API de chat)',
            'Parametros: profundidade da analise, idioma das respostas',
        ],
    },
    {
        title: 'Seguranca',
        priority: 'Alta',
        items: [
            'Sessoes ativas (revogar dispositivos)',
            '2FA (TOTP ou SMS) alem do OTP de cadastro',
            'Log de acessos e alteracoes sensiveis',
            'Revalidar senha para mudancas criticas',
        ],
    },
    {
        title: 'Integracoes e lojas',
        priority: 'Media',
        items: [
            'Lista de lojas favoritas / bloqueadas',
            'Webhook ou API key para integradores (plano Enterprise)',
            'Sincronizacao com marketplaces (futuro)',
        ],
    },
    {
        title: 'Plano e cobranca',
        priority: 'Media',
        items: [
            'Stripe ou Mercado Pago para assinatura Pro/Enterprise',
            'Exibir uso real: analises no mes, lojas monitoradas',
            'Upgrade/downgrade e portal do cliente',
        ],
    },
    {
        title: 'Privacidade e LGPD',
        priority: 'Alta',
        items: [
            'Exportar dados (JSON/CSV) do usuario',
            'Exclusao de conta ja existe no perfil — alinhar politica',
            'Consentimento de marketing e cookies',
            'Retencao de verification_codes e logs',
        ],
    },
    {
        title: 'Admin (se houver multi-tenant)',
        priority: 'Baixa',
        items: [
            'Allowlist de dominios de e-mail (config/registration.php)',
            'SMS_DRIVER apenas via .env',
            'Painel admin: usuarios, jobs falhos na fila',
        ],
    },
];

function SettingsCard({ title, description, children }) {
    return (
        <div
            className="overflow-hidden rounded-2xl border"
            style={{ backgroundColor: '#ffffff', borderColor: 'rgba(124,58,237,0.12)' }}
        >
            <div className="border-b px-5 py-4 sm:px-6" style={{ borderColor: 'rgba(124,58,237,0.10)' }}>
                <h2 className="text-base font-bold" style={{ color: '#1a1040' }}>
                    {title}
                </h2>
                {description && (
                    <p className="mt-1 text-sm leading-relaxed" style={{ color: '#6b6b8a' }}>
                        {description}
                    </p>
                )}
            </div>
            <div className="space-y-5 px-5 py-5 sm:px-6">{children}</div>
        </div>
    );
}

function ToggleRow({ label, description, checked, onChange, disabled = true }) {
    return (
        <label
            className={`flex cursor-pointer items-start justify-between gap-4 ${disabled ? 'opacity-70' : ''}`}
        >
            <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium" style={{ color: '#1a1040' }}>
                    {label}
                </span>
                {description && (
                    <span className="mt-0.5 block text-xs leading-relaxed" style={{ color: '#6b6b8a' }}>
                        {description}
                    </span>
                )}
            </span>
            <Checkbox checked={checked} onChange={(e) => onChange(e.target.checked)} disabled={disabled} />
        </label>
    );
}

function PriorityBadge({ priority }) {
    const styles = {
        Alta: { bg: '#fef2f2', text: '#dc2626', border: 'rgba(220,38,38,0.2)' },
        Media: { bg: '#fff7ed', text: '#ea580c', border: 'rgba(234,88,12,0.2)' },
        Baixa: { bg: '#f0eeff', text: '#7c3aed', border: 'rgba(124,58,237,0.2)' },
    };
    const selected = styles[priority] || styles.Media;

    return (
        <span
            className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
            style={{ backgroundColor: selected.bg, color: selected.text, border: `1px solid ${selected.border}` }}
        >
            {priority}
        </span>
    );
}

function SecuritySection({ twoFactorEnabled, twoFactorSmsFallback, activeSessions }) {
    const [qrSvg, setQrSvg] = useState(null);
    const [pendingSecret, setPendingSecret] = useState(null);
    const [confirmProcessing, setConfirmProcessing] = useState(false);
    const [code, setCode] = useState('');
    const [codeError, setCodeError] = useState('');
    const [recoveryCodes, setRecoveryCodes] = useState(null);

    const startSetup = async () => {
        setQrSvg(null);
        setPendingSecret(null);
        const res = await fetch(route('two-factor.setup'), { method: 'POST', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content ?? '', Accept: 'application/json' } });
        if (res.ok) {
            const data = await res.json();
            setQrSvg(data.qr_code_svg);
            setPendingSecret(data.secret);
        }
    };

    const confirmSetup = (e) => {
        e.preventDefault();
        setConfirmProcessing(true);
        setCodeError('');
        router.post(route('two-factor.confirm'), { code }, {
            onError: (errs) => { setCodeError(errs.code ?? 'Código inválido.'); setConfirmProcessing(false); },
            onSuccess: () => { setQrSvg(null); setPendingSecret(null); setConfirmProcessing(false); setCode(''); },
        });
    };

    const loadRecoveryCodes = async () => {
        const res = await fetch(route('two-factor.recovery-codes'), { headers: { Accept: 'application/json' } });
        if (res.ok) setRecoveryCodes(await res.json().then(d => d.codes));
    };

    return (
        <div className="space-y-4">
            {/* 2FA */}
            <SettingsCard title="Autenticacao em dois fatores (2FA)" description="Exige um codigo do app autenticador alem da senha.">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold" style={{ color: '#1a1040' }}>{twoFactorEnabled ? '2FA ativo' : '2FA desativado'}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#6b6b8a' }}>{twoFactorEnabled ? 'Seu login esta protegido por TOTP.' : 'Adicione uma camada extra de segurança.'}</p>
                    </div>
                    {twoFactorEnabled ? (
                        <form
                            method="post"
                            action={route('two-factor.disable')}
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const confirmed = await confirmAction({
                                    title: 'Desativar 2FA?',
                                    text: 'Seu login voltara a exigir apenas e-mail e senha.',
                                    confirmText: 'Desativar',
                                    icon: 'warning',
                                });

                                if (confirmed) {
                                    e.currentTarget.submit();
                                }
                            }}
                        >
                            <input type="hidden" name="_method" value="DELETE" />
                            <input type="hidden" name="_token" value={document.querySelector('meta[name=csrf-token]')?.content ?? ''} />
                            <button type="submit" className="rounded-xl border px-4 py-2 text-xs font-semibold" style={{ borderColor: 'rgba(234,88,12,0.3)', color: '#ea580c' }}>Desativar</button>
                        </form>
                    ) : (
                        <button type="button" onClick={startSetup} className="rounded-xl border px-4 py-2 text-xs font-semibold" style={{ borderColor: 'rgba(124,58,237,0.3)', color: '#7c3aed' }}>Ativar</button>
                    )}
                </div>

                {qrSvg && (
                    <div className="space-y-3 rounded-xl border p-4" style={{ borderColor: 'rgba(124,58,237,0.2)', backgroundColor: '#f8f7ff' }}>
                        <p className="text-sm font-medium" style={{ color: '#1a1040' }}>Escaneie o QR code no seu app autenticador:</p>
                        <div className="flex justify-center" dangerouslySetInnerHTML={{ __html: qrSvg }} />
                        {pendingSecret && <p className="break-all rounded bg-white px-3 py-2 text-xs font-mono" style={{ color: '#6b6b8a' }}>{pendingSecret}</p>}
                        <form onSubmit={confirmSetup} className="flex gap-2">
                            <input type="text" maxLength={6} inputMode="numeric" placeholder="Código de 6 dígitos" value={code} onChange={e => setCode(e.target.value)} className="orin-input flex-1 rounded-xl border px-3 py-2 text-sm" />
                            <button type="submit" disabled={confirmProcessing} className="rounded-xl px-4 py-2 text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>Confirmar</button>
                        </form>
                        {codeError && <p className="text-xs" style={{ color: '#ef4444' }}>{codeError}</p>}
                    </div>
                )}

                {twoFactorEnabled && (
                    <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={loadRecoveryCodes} className="text-xs underline underline-offset-2" style={{ color: '#7c3aed' }}>Ver códigos de recuperação</button>
                    </div>
                )}
                {recoveryCodes && (
                    <div className="grid grid-cols-2 gap-2 rounded-xl border p-3" style={{ borderColor: 'rgba(124,58,237,0.15)', backgroundColor: '#f8f7ff' }}>
                        {recoveryCodes.map((c) => <code key={c} className="rounded bg-white px-2 py-1 text-xs font-mono" style={{ color: '#1a1040' }}>{c}</code>)}
                    </div>
                )}
            </SettingsCard>

            {/* Active sessions */}
            <SettingsCard title="Sessoes ativas" description="Dispositivos com sessao aberta. Encerre qualquer sessao suspeita.">
                <div className="space-y-2">
                    {activeSessions.map((s) => (
                        <div key={s.id} className="flex items-center justify-between gap-3 rounded-xl border p-3" style={{ borderColor: s.is_current ? 'rgba(124,58,237,0.3)' : 'rgba(124,58,237,0.12)', backgroundColor: s.is_current ? '#f0eeff' : '#f8f7ff' }}>
                            <div className="min-w-0">
                                <p className="text-sm font-medium truncate" style={{ color: '#1a1040' }}>{s.device} — {s.ip_address ?? 'IP desconhecido'}{s.is_current ? ' (esta sessao)' : ''}</p>
                                <p className="text-xs mt-0.5 truncate" style={{ color: '#6b6b8a' }}>{s.last_activity_human}</p>
                            </div>
                            {!s.is_current && (
                                <form method="post" action={route('sessions.destroy', s.id)}>
                                    <input type="hidden" name="_method" value="DELETE" />
                                    <input type="hidden" name="_token" value={document.querySelector('meta[name=csrf-token]')?.content ?? ''} />
                                    <button type="submit" className="text-xs font-medium" style={{ color: '#ea580c' }}>Encerrar</button>
                                </form>
                            )}
                        </div>
                    ))}
                    {activeSessions.length > 1 && (
                        <form method="post" action={route('sessions.destroy-others')}>
                            <input type="hidden" name="_method" value="DELETE" />
                            <input type="hidden" name="_token" value={document.querySelector('meta[name=csrf-token]')?.content ?? ''} />
                            <button type="submit" className="mt-1 text-xs font-semibold underline underline-offset-2" style={{ color: '#ea580c' }}>Encerrar todas as outras sessoes</button>
                        </form>
                    )}
                    {activeSessions.length === 0 && <p className="text-sm" style={{ color: '#6b6b8a' }}>Nenhuma sessao ativa encontrada.</p>}
                </div>
            </SettingsCard>
        </div>
    );
}

export default function SettingsIndex({ settings = {}, activeSessions = [], twoFactorEnabled = false, twoFactorSmsFallback = false }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const currentPlan = plansByKey[user.plan_key ?? 'trial'] ?? plansByKey.trial;
    const [activeSection, setActiveSection] = useState('general');

    const [prefs, setPrefs] = useState({
        locale: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        emailAnalysisDone: true,
        emailPriceDrop: true,
        smsPriceAlert: false,
        pushEnabled: false,
        weeklyDigest: true,
        defaultStores: 'amazon,mercadolivre,magalu',
        analysisDepth: 'balanced',
        aiLanguage: 'pt-BR',
        saveSearchHistory: true,
        favoriteStoresOnly: false,
        sessionAlerts: true,
        marketingEmails: false,
        exportIncludeHistory: true,
    });

    const updatePref = (key, value) => {
        setPrefs((current) => ({ ...current, [key]: value }));
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'general':
                return (
                    <SettingsCard
                        title="Preferencias gerais"
                        description="Idioma e fuso para datas no dashboard e relatorios."
                    >
                        <div>
                            <InputLabel htmlFor="locale" value="Idioma da interface" />
                            <select
                                id="locale"
                                value={prefs.locale}
                                onChange={(e) => updatePref('locale', e.target.value)}
                                className="mt-1 block w-full rounded-xl border px-4 py-3 text-sm"
                                style={{
                                    borderColor: 'rgba(124,58,237,0.18)',
                                    backgroundColor: '#f8f7ff',
                                    color: '#1a1040',
                                }}
                            >
                                <option value="pt-BR">Portugues (Brasil)</option>
                                <option value="en-US">English (US)</option>
                            </select>
                        </div>
                        <div>
                            <InputLabel htmlFor="timezone" value="Fuso horario" />
                            <select
                                id="timezone"
                                value={prefs.timezone}
                                onChange={(e) => updatePref('timezone', e.target.value)}
                                className="mt-1 block w-full rounded-xl border px-4 py-3 text-sm"
                                style={{
                                    borderColor: 'rgba(124,58,237,0.18)',
                                    backgroundColor: '#f8f7ff',
                                    color: '#1a1040',
                                }}
                            >
                                <option value="America/Sao_Paulo">Brasilia (GMT-3)</option>
                                <option value="America/Manaus">Manaus (GMT-4)</option>
                                <option value="America/Noronha">Fernando de Noronha (GMT-2)</option>
                            </select>
                        </div>
                    </SettingsCard>
                );

            case 'notifications':
                return (
                    <SettingsCard
                        title="Notificacoes"
                        description="Controle como o Orin avisa sobre analises e oportunidades."
                    >
                        <ToggleRow
                            label="E-mail quando analise terminar"
                            description="Envia resumo apos o chat concluir uma comparacao."
                            checked={prefs.emailAnalysisDone}
                            onChange={(v) => updatePref('emailAnalysisDone', v)}
                        />
                        <ToggleRow
                            label="E-mail de queda de preco"
                            description="Alerta quando um produto monitorado baixar de preco."
                            checked={prefs.emailPriceDrop}
                            onChange={(v) => updatePref('emailPriceDrop', v)}
                        />
                        <ToggleRow
                            label="SMS para alertas urgentes"
                            description="Usa o mesmo canal do OTP de cadastro (SMS_DRIVER)."
                            checked={prefs.smsPriceAlert}
                            onChange={(v) => updatePref('smsPriceAlert', v)}
                        />
                        <ToggleRow
                            label="Notificacoes push no navegador"
                            description="Requer service worker e permissao do usuario."
                            checked={prefs.pushEnabled}
                            onChange={(v) => updatePref('pushEnabled', v)}
                        />
                        <ToggleRow
                            label="Resumo semanal por e-mail"
                            description="Economia total e melhores oportunidades da semana."
                            checked={prefs.weeklyDigest}
                            onChange={(v) => updatePref('weeklyDigest', v)}
                        />
                    </SettingsCard>
                );

            case 'chat':
                return (
                    <SettingsCard
                        title="Chat e analises com IA"
                        description="Padroes usados nas buscas e no consumo do seu plano."
                    >
                        <div>
                            <InputLabel htmlFor="defaultStores" value="Lojas padrao (separadas por virgula)" />
                            <TextInput
                                id="defaultStores"
                                value={prefs.defaultStores}
                                onChange={(e) => updatePref('defaultStores', e.target.value)}
                                className="mt-1"
                                placeholder="amazon, mercadolivre, magalu"
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="analysisDepth" value="Profundidade da analise" />
                            <select
                                id="analysisDepth"
                                value={prefs.analysisDepth}
                                onChange={(e) => updatePref('analysisDepth', e.target.value)}
                                className="mt-1 block w-full rounded-xl border px-4 py-3 text-sm"
                                style={{
                                    borderColor: 'rgba(124,58,237,0.18)',
                                    backgroundColor: '#f8f7ff',
                                    color: '#1a1040',
                                }}
                            >
                                <option value="fast">Rapida (menos lojas, mais rapido)</option>
                                <option value="balanced">Equilibrada</option>
                                <option value="deep">Profunda (mais lojas, mais creditos)</option>
                            </select>
                        </div>
                        <div>
                            <InputLabel htmlFor="aiLanguage" value="Idioma das respostas da IA" />
                            <select
                                id="aiLanguage"
                                value={prefs.aiLanguage}
                                onChange={(e) => updatePref('aiLanguage', e.target.value)}
                                className="mt-1 block w-full rounded-xl border px-4 py-3 text-sm"
                                style={{
                                    borderColor: 'rgba(124,58,237,0.18)',
                                    backgroundColor: '#f8f7ff',
                                    color: '#1a1040',
                                }}
                            >
                                <option value="pt-BR">Portugues</option>
                                <option value="en-US">English</option>
                            </select>
                        </div>
                        <ToggleRow
                            label="Salvar historico de buscas"
                            description="Permite retomar conversas na sidebar (quando backend existir)."
                            checked={prefs.saveSearchHistory}
                            onChange={(v) => updatePref('saveSearchHistory', v)}
                        />
                    </SettingsCard>
                );

            case 'monitoring':
                return (
                    <SettingsCard
                        title="Lojas e monitoramento"
                        description="Quais marketplaces entram nas comparacoes automaticas."
                    >
                        <ToggleRow
                            label="Priorizar apenas lojas favoritas"
                            description="Ignora outras lojas nas analises rapidas."
                            checked={prefs.favoriteStoresOnly}
                            onChange={(v) => updatePref('favoriteStoresOnly', v)}
                        />
                        <p className="rounded-xl border px-4 py-3 text-xs leading-relaxed" style={{ backgroundColor: '#f0eeff', borderColor: 'rgba(124,58,237,0.15)', color: '#6b6b8a' }}>
                            Implementacao sugerida: tabela{' '}
                            <code className="rounded bg-white/80 px-1">user_store_preferences</code> com
                            store_slug, is_favorite, is_blocked e sincronizacao com o motor de busca.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {['Amazon', 'Mercado Livre', 'Magalu', 'Kabum', 'Pichau', 'Americanas'].map((store) => (
                                <span
                                    key={store}
                                    className="rounded-full px-3 py-1 text-xs font-medium"
                                    style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}
                                >
                                    {store}
                                </span>
                            ))}
                        </div>
                    </SettingsCard>
                );

            case 'security':
                return <SecuritySection
                    twoFactorEnabled={twoFactorEnabled}
                    twoFactorSmsFallback={twoFactorSmsFallback}
                    activeSessions={activeSessions}
                />;

            case 'plan':
                return (
                    <SettingsCard
                        title="Plano e uso"
                        description="Limites do plano atual e consumo no mes."
                    >
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            {[
                                { label: 'Analises no mes', value: '0 / ' + currentPlan.limits.consultsPerMonth },
                                { label: 'Imagens no mes', value: '0 / ' + currentPlan.limits.imagesPerMonth },
                                { label: 'Copy no mes', value: '0 / ' + currentPlan.limits.copyPerMonth },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-xl border p-4"
                                    style={{ borderColor: 'rgba(124,58,237,0.12)', backgroundColor: '#f8f7ff' }}
                                >
                                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b6b8a' }}>
                                        {stat.label}
                                    </p>
                                    <p className="mt-1 text-lg font-bold" style={{ color: '#7c3aed' }}>
                                        {stat.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm" style={{ color: '#6b6b8a' }}>
                            Plano atual: <strong style={{ color: '#7c3aed' }}>{currentPlan.name}</strong>.
                            Contadores de uso serao exibidos quando as analises estiverem disponiveis.
                        </p>
                        <Link
                            href={route('profile.edit', { section: 'plans' })}
                            className="inline-flex text-sm font-medium underline underline-offset-4"
                            style={{ color: '#7c3aed' }}
                        >
                            Comparar e confirmar plano
                        </Link>
                    </SettingsCard>
                );

            case 'privacy':
                return (
                    <SettingsCard
                        title="Privacidade e dados"
                        description="Controle de comunicacoes e exportacao (LGPD)."
                    >
                        <ToggleRow
                            label="E-mails de marketing e novidades"
                            description="Dicas de uso e lancamentos do Orin."
                            checked={prefs.marketingEmails}
                            onChange={(v) => updatePref('marketingEmails', v)}
                        />
                        <ToggleRow
                            label="Incluir historico de analises na exportacao"
                            description="Arquivo JSON/CSV com conversas e resultados."
                            checked={prefs.exportIncludeHistory}
                            onChange={(v) => updatePref('exportIncludeHistory', v)}
                        />
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                disabled
                                className="rounded-xl border px-4 py-2.5 text-sm font-semibold opacity-60"
                                style={{ borderColor: 'rgba(124,58,237,0.25)', color: '#7c3aed' }}
                            >
                                Exportar meus dados (em breve)
                            </button>
                            <Link
                                href={route('profile.edit')}
                                className="inline-flex items-center justify-center rounded-xl border px-4 py-2.5 text-center text-sm font-semibold"
                                style={{ borderColor: 'rgba(234,88,12,0.3)', color: '#ea580c' }}
                            >
                                Excluir conta
                            </Link>
                        </div>
                    </SettingsCard>
                );

            case 'roadmap':
                return (
                    <div className="space-y-4">
                        <div
                            className="rounded-2xl border px-5 py-4"
                            style={{ backgroundColor: '#eff6ff', borderColor: 'rgba(37,99,235,0.22)' }}
                        >
                            <p className="text-sm font-semibold" style={{ color: '#2563eb' }}>
                                Esta secao e um guia para o backend
                            </p>
                            <p className="mt-1 text-sm leading-relaxed" style={{ color: '#6b6b8a' }}>
                                A tela de configuracoes e apenas front-end. Use as recomendacoes abaixo para
                                priorizar tabelas, rotas e integracoes no Laravel.
                            </p>
                        </div>
                        {implementationRecommendations.map((block) => (
                            <div
                                key={block.title}
                                className="overflow-hidden rounded-2xl border"
                                style={{ backgroundColor: '#ffffff', borderColor: 'rgba(124,58,237,0.12)' }}
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-4" style={{ borderColor: 'rgba(124,58,237,0.10)' }}>
                                    <h3 className="text-sm font-bold" style={{ color: '#1a1040' }}>
                                        {block.title}
                                    </h3>
                                    <PriorityBadge priority={block.priority} />
                                </div>
                                <ul className="space-y-2 px-5 py-4">
                                    {block.items.map((item) => (
                                        <li
                                            key={item}
                                            className="flex gap-2 text-sm leading-relaxed"
                                            style={{ color: '#6b6b8a' }}
                                        >
                                            <span style={{ color: '#7c3aed' }}>•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Configuracoes" />

            <div className="min-h-screen min-w-0 overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8 lg:px-8" style={{ backgroundColor: '#f8f7ff' }}>
                <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <div className="mb-2 flex items-center gap-2">
                                <span
                                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                                    style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}
                                >
                                    <SettingsIcon />
                                </span>
                                <h1 className="break-words text-xl font-bold sm:text-2xl" style={{ color: '#1a1040' }}>
                                    Configuracoes
                                </h1>
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: '#6b6b8a' }}>
                                Preferencias da conta.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 lg:flex-row">
                        <nav
                            className="flex gap-2 overflow-x-auto pb-1 lg:w-56 lg:flex-shrink-0 lg:flex-col lg:overflow-visible lg:pb-0"
                            aria-label="Secoes de configuracao"
                        >
                            {sections.map((section) => {
                                const SectionIcon = section.icon;

                                return (
                                <button
                                    key={section.key}
                                    type="button"
                                    onClick={() => setActiveSection(section.key)}
                                    className="flex flex-shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors lg:w-full"
                                    style={{
                                        backgroundColor: activeSection === section.key ? '#f0eeff' : '#ffffff',
                                        color: activeSection === section.key ? '#7c3aed' : '#1a1040',
                                        border: `1px solid ${activeSection === section.key ? 'rgba(124,58,237,0.25)' : 'rgba(124,58,237,0.10)'}`,
                                    }}
                                >
                                    <span
                                        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
                                        style={{
                                            backgroundColor: activeSection === section.key ? 'rgba(124,58,237,0.12)' : '#f8f7ff',
                                            color: activeSection === section.key ? '#7c3aed' : '#6b6b8a',
                                        }}
                                    >
                                        <SectionIcon />
                                    </span>
                                    <span className="whitespace-nowrap lg:whitespace-normal">{section.label}</span>
                                </button>
                                );
                            })}
                        </nav>

                        <div className="min-w-0 flex-1 space-y-4">
                            {renderSection()}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
