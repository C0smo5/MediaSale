import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { plansByKey } from '@/data/plans';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const SettingsIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

const sections = [
    { key: 'general', label: 'Geral', icon: 'GR' },
    { key: 'notifications', label: 'Notificacoes', icon: 'NT' },
    { key: 'chat', label: 'Chat e analises', icon: 'IA' },
    { key: 'monitoring', label: 'Lojas', icon: 'LJ' },
    { key: 'security', label: 'Seguranca', icon: 'SG' },
    { key: 'plan', label: 'Plano e uso', icon: 'PL' },
    { key: 'privacy', label: 'Privacidade', icon: 'PV' },
    { key: 'roadmap', label: 'Recomendacoes', icon: 'RC' },
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

export default function SettingsIndex() {
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
                return (
                    <SettingsCard
                        title="Seguranca e verificacao"
                        description="Complementa o cadastro em duas etapas (e-mail + SMS OTP)."
                    >
                        <ToggleRow
                            label="Alertar login em novo dispositivo"
                            description="E-mail quando detectar sessao desconhecida."
                            checked={prefs.sessionAlerts}
                            onChange={(v) => updatePref('sessionAlerts', v)}
                        />
                        <div className="space-y-3 rounded-xl border p-4" style={{ borderColor: 'rgba(124,58,237,0.12)', backgroundColor: '#f8f7ff' }}>
                            <p className="text-sm font-semibold" style={{ color: '#1a1040' }}>
                                Ja disponivel no projeto
                            </p>
                            <ul className="list-inside list-disc space-y-1 text-xs" style={{ color: '#6b6b8a' }}>
                                <li>Verificacao de e-mail e telefone no cadastro (OTP)</li>
                                <li>CPF, telefone e allowlist de e-mail publico</li>
                                <li>Alteracao de senha no perfil</li>
                            </ul>
                        </div>
                        <div className="space-y-3 rounded-xl border p-4" style={{ borderColor: 'rgba(234,88,12,0.2)', backgroundColor: '#fff7ed' }}>
                            <p className="text-sm font-semibold" style={{ color: '#ea580c' }}>
                                Recomendado implementar
                            </p>
                            <ul className="list-inside list-disc space-y-1 text-xs" style={{ color: '#6b6b8a' }}>
                                <li>Autenticacao em dois fatores (2FA)</li>
                                <li>Lista de sessoes ativas com revogacao</li>
                                <li>Confirmar senha antes de mudancas sensiveis</li>
                            </ul>
                        </div>
                        <Link
                            href={route('profile.edit')}
                            className="inline-flex text-sm font-medium underline underline-offset-4"
                            style={{ color: '#7c3aed' }}
                        >
                            Ir para senha e dados no perfil
                        </Link>
                    </SettingsCard>
                );

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
                                Preferencias da conta. Alteracoes ainda nao sao salvas no servidor.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 lg:flex-row">
                        <nav
                            className="flex gap-2 overflow-x-auto pb-1 lg:w-56 lg:flex-shrink-0 lg:flex-col lg:overflow-visible lg:pb-0"
                            aria-label="Secoes de configuracao"
                        >
                            {sections.map((section) => (
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
                                        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[10px] font-bold"
                                        style={{
                                            backgroundColor: activeSection === section.key ? 'rgba(124,58,237,0.12)' : '#f8f7ff',
                                            color: activeSection === section.key ? '#7c3aed' : '#6b6b8a',
                                        }}
                                    >
                                        {section.icon}
                                    </span>
                                    <span className="whitespace-nowrap lg:whitespace-normal">{section.label}</span>
                                </button>
                            ))}
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
