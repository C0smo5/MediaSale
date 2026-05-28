export type BillingCycle = 'monthly' | 'annual';

export type PlanKey = 'trial' | 'starter' | 'pro' | 'business' | 'elite';

export type PlanLimits = {
    consultsPerMonth: number;
    imagesPerMonth: number;
    copyPerMonth: number;
    trendSessionsPerMonth: number;
};

export type PlanCostLineKey = 'consults_glm' | 'images' | 'copy' | 'trend_analysis';

export type PlanCostLine = {
    key: PlanCostLineKey;
    label: string;
    usage: string;
    unitCost: number; // BRL
    totalCost: number; // BRL
};

export type PlanCostBreakdown = {
    lines: PlanCostLine[];
    totalAiCost: number; // BRL
    revenue: number; // BRL
    marginValue: number; // BRL
    marginPercent: number; // 0-100
};

export type PlanFeature = {
    label: string;
    included: boolean;
    detail?: string;
};

export type Plan = {
    key: PlanKey;
    name: string;
    badge?: string | null;
    description: string;
    monthlyPrice: number; // BRL
    annualDiscountPercent: number; // 0-100
    limits: PlanLimits;
    comparison: {
        consultsLabel: string;
        imagesCopyLabel: string;
        trendLabel: string;
    };
    features: PlanFeature[];
    cost?: PlanCostBreakdown;
    accent: 'slate' | 'violet' | 'indigo' | 'amber' | 'emerald';
};

const brl = (value: number) =>
    value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
    });

export const formatBrl = brl;

export function getAnnualMonthlyEquivalent(monthlyPrice: number, annualDiscountPercent: number) {
    const discounted = monthlyPrice * (1 - annualDiscountPercent / 100);
    // Keep 2 decimals for UI.
    return Math.round(discounted * 100) / 100;
}

export function getPlanPrice(plan: Plan, billing: BillingCycle) {
    if (billing === 'annual') {
        return getAnnualMonthlyEquivalent(plan.monthlyPrice, plan.annualDiscountPercent);
    }
    return plan.monthlyPrice;
}

export const plans: Plan[] = [
    {
        key: 'trial',
        name: 'Trial',
        badge: 'Comece agora',
        description: 'Para testar a plataforma e entender os insights.',
        monthlyPrice: 0,
        annualDiscountPercent: 0,
        limits: { consultsPerMonth: 3, imagesPerMonth: 0, copyPerMonth: 0, trendSessionsPerMonth: 0 },
        comparison: {
            consultsLabel: '3 insights',
            imagesCopyLabel: '—',
            trendLabel: '—',
        },
        features: [
            { label: 'Chat com IA (consultas)', included: true, detail: '3 insights' },
            { label: 'Imagens (geração)', included: false },
            { label: 'Copy (textos)', included: false },
            { label: 'Análise de tendência', included: false },
            { label: 'Histórico', included: false, detail: 'Sem histórico salvo' },
            { label: 'Alertas de preço', included: false },
        ],
        accent: 'slate',
    },
    {
        key: 'starter',
        name: 'Starter',
        badge: null,
        description: 'Para começar a usar IA no dia a dia.',
        monthlyPrice: 29.99,
        annualDiscountPercent: 15,
        limits: { consultsPerMonth: 20, imagesPerMonth: 0, copyPerMonth: 0, trendSessionsPerMonth: 0 },
        comparison: {
            consultsLabel: '20/mês',
            imagesCopyLabel: '—',
            trendLabel: '—',
        },
        features: [
            { label: 'Consultas GLM', included: true, detail: '20/mês' },
            { label: 'Imagens', included: false },
            { label: 'Copy', included: false },
            { label: 'Análise de tendência', included: false },
            { label: 'Histórico de chats', included: true, detail: '30 dias' },
            { label: 'Exportar relatórios', included: false },
            { label: 'Alertas de preço', included: false },
            { label: 'Suporte', included: true, detail: 'E-mail' },
        ],
        cost: {
            lines: [
                {
                    key: 'consults_glm',
                    label: 'Consultas GLM',
                    usage: '14 (70% de 20)',
                    unitCost: 0.3,
                    totalCost: 4.2,
                },
            ],
            totalAiCost: 4.2,
            revenue: 29.99,
            marginValue: 25.79,
            marginPercent: 86,
        },
        accent: 'violet',
    },
    {
        key: 'pro',
        name: 'Pro',
        badge: 'Mais vendido',
        description: 'Para quem usa o Orin com consistência todo mês.',
        monthlyPrice: 59.99,
        annualDiscountPercent: 15,
        limits: { consultsPerMonth: 50, imagesPerMonth: 0, copyPerMonth: 0, trendSessionsPerMonth: 0 },
        comparison: {
            consultsLabel: '50/mês',
            imagesCopyLabel: '—',
            trendLabel: '—',
        },
        features: [
            { label: 'Consultas GLM', included: true, detail: '50/mês' },
            { label: 'Imagens', included: false },
            { label: 'Copy', included: false },
            { label: 'Análise de tendência', included: false },
            { label: 'Histórico de chats', included: true, detail: '90 dias' },
            { label: 'Alertas de preço', included: true, detail: 'Básicos' },
            { label: 'Exportar relatórios', included: true, detail: 'CSV' },
            { label: 'Suporte', included: true, detail: 'Prioritário (e-mail)' },
        ],
        cost: {
            lines: [
                {
                    key: 'consults_glm',
                    label: 'Consultas GLM',
                    usage: '35 (70% de 50)',
                    unitCost: 0.3,
                    totalCost: 10.5,
                },
            ],
            totalAiCost: 10.5,
            revenue: 59.99,
            marginValue: 49.49,
            marginPercent: 82,
        },
        accent: 'indigo',
    },
    {
        key: 'business',
        name: 'Business',
        badge: 'Equipe',
        description: 'Para operação com criação e análise em escala.',
        monthlyPrice: 149.99,
        annualDiscountPercent: 15,
        limits: { consultsPerMonth: 150, imagesPerMonth: 10, copyPerMonth: 10, trendSessionsPerMonth: 5 },
        comparison: {
            consultsLabel: '150/mês',
            imagesCopyLabel: '10/mês',
            trendLabel: '✓',
        },
        features: [
            { label: 'Consultas GLM', included: true, detail: '150/mês' },
            { label: 'Imagens', included: true, detail: '10/mês' },
            { label: 'Copy', included: true, detail: '10/mês' },
            { label: 'Análise de tendência', included: true, detail: '5 sessões' },
            { label: 'Histórico de chats', included: true, detail: '1 ano' },
            { label: 'Alertas de preço', included: true, detail: 'Avançados' },
            { label: 'Exportar relatórios', included: true, detail: 'CSV + PDF' },
            { label: 'Suporte', included: true, detail: 'Chat + e-mail' },
            { label: 'Acesso de equipe', included: true, detail: '3 usuários' },
        ],
        cost: {
            lines: [
                {
                    key: 'consults_glm',
                    label: 'Consultas GLM',
                    usage: '105 (70% de 150)',
                    unitCost: 0.3,
                    totalCost: 31.5,
                },
                {
                    key: 'images',
                    label: 'Imagens',
                    usage: '7 (70% de 10)',
                    unitCost: 0.3,
                    totalCost: 2.1,
                },
                {
                    key: 'copy',
                    label: 'Copy',
                    usage: '7 (70% de 10)',
                    unitCost: 0.3,
                    totalCost: 2.1,
                },
                {
                    key: 'trend_analysis',
                    label: 'Análise de tendência',
                    usage: '5 sessões',
                    unitCost: 0.6,
                    totalCost: 3.0,
                },
            ],
            totalAiCost: 38.7,
            revenue: 149.99,
            marginValue: 111.29,
            marginPercent: 74,
        },
        accent: 'emerald',
    },
    {
        key: 'elite',
        name: 'Elite',
        badge: 'Máximo',
        description: 'Para quem quer o máximo de volume e automação.',
        monthlyPrice: 299.99,
        annualDiscountPercent: 15,
        limits: { consultsPerMonth: 300, imagesPerMonth: 30, copyPerMonth: 30, trendSessionsPerMonth: 10 },
        comparison: {
            consultsLabel: '300/mês',
            imagesCopyLabel: '30/mês',
            trendLabel: '✓',
        },
        features: [
            { label: 'Consultas GLM', included: true, detail: '300/mês' },
            { label: 'Imagens', included: true, detail: '30/mês' },
            { label: 'Copy', included: true, detail: '30/mês' },
            { label: 'Análise de tendência', included: true, detail: '10 sessões' },
            { label: 'Histórico de chats', included: true, detail: 'Completo' },
            { label: 'Alertas de preço', included: true, detail: 'Personalizados' },
            { label: 'Exportar relatórios', included: true, detail: 'CSV + PDF + API' },
            { label: 'Suporte', included: true, detail: 'Prioritário 24/7' },
            { label: 'Acesso de equipe', included: true, detail: '10 usuários' },
        ],
        cost: {
            lines: [
                {
                    key: 'consults_glm',
                    label: 'Consultas GLM',
                    usage: '210 (70% de 300)',
                    unitCost: 0.3,
                    totalCost: 63.0,
                },
                {
                    key: 'images',
                    label: 'Imagens',
                    usage: '21 (70% de 30)',
                    unitCost: 0.3,
                    totalCost: 6.3,
                },
                {
                    key: 'copy',
                    label: 'Copy',
                    usage: '21 (70% de 30)',
                    unitCost: 0.3,
                    totalCost: 6.3,
                },
                {
                    key: 'trend_analysis',
                    label: 'Análise de tendência',
                    usage: '10 sessões',
                    unitCost: 0.6,
                    totalCost: 6.0,
                },
            ],
            totalAiCost: 81.6,
            revenue: 299.99,
            marginValue: 218.39,
            marginPercent: 73,
        },
        accent: 'amber',
    },
];

export const plansByKey: Record<PlanKey, Plan> = plans.reduce((acc, plan) => {
    acc[plan.key] = plan;
    return acc;
}, {} as Record<PlanKey, Plan>);

