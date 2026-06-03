export const SETTINGS_SECTION_KEYS = [
    'general',
    'notifications',
    'chat',
    'monitoring',
    'security',
    'plan',
    'privacy',
    'roadmap',
];

export const SETTINGS_SECTIONS = [
    { key: 'general', label: 'Geral', description: 'Idioma e fuso horario' },
    { key: 'notifications', label: 'Notificacoes', description: 'E-mail, SMS e alertas' },
    { key: 'chat', label: 'Chat e analises', description: 'IA e historico' },
    { key: 'monitoring', label: 'Lojas', description: 'Marketplaces monitorados' },
    { key: 'security', label: 'Seguranca', description: '2FA e sessoes' },
    { key: 'plan', label: 'Plano e uso', description: 'Limites e assinatura' },
    { key: 'privacy', label: 'Privacidade', description: 'Dados e LGPD' },
    { key: 'roadmap', label: 'Recomendacoes', description: 'Guia para o backend' },
];

/**
 * @param {string} [tab]
 */
export function settingsSectionUrl(tab = 'general') {
    return route('profile.edit', { section: 'settings', tab });
}
