import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const weekInsights = [
    { id: 1, product: 'Notebook Dell Inspiron 15', category: 'Informatica', bestStore: 'Magazine Luiza', bestPrice: 'R$ 2.599', avgPrice: 'R$ 2.849', saving: 'R$ 250', savingPct: 8.8, stores: 4, date: 'Hoje, 14h32', badge: 'Melhor margem', badgeColor: 'green' },
    { id: 2, product: 'iPhone 15 128GB', category: 'Smartphones', bestStore: 'Amazon', bestPrice: 'R$ 4.199', avgPrice: 'R$ 4.599', saving: 'R$ 400', savingPct: 8.7, stores: 6, date: 'Ontem, 10h15', badge: 'Alta demanda', badgeColor: 'orange' },
    { id: 3, product: 'Monitor LG 24" Full HD', category: 'Perifericos', bestStore: 'Kabum', bestPrice: 'R$ 899', avgPrice: 'R$ 1.049', saving: 'R$ 150', savingPct: 14.3, stores: 5, date: 'Seg, 09h00', badge: 'Melhor desconto', badgeColor: 'purple' },
    { id: 4, product: 'SSD Kingston 480GB', category: 'Hardware', bestStore: 'Pichau', bestPrice: 'R$ 219', avgPrice: 'R$ 259', saving: 'R$ 40', savingPct: 15.4, stores: 7, date: 'Dom, 16h45', badge: 'Preco minimo', badgeColor: 'green' },
];

const history = [
    { id: 1, product: 'Notebook Dell Inspiron 15', store: 'Magazine Luiza', price: 'R$ 2.599', saving: '-8,8%', date: '23/05', status: 'comprado' },
    { id: 2, product: 'iPhone 15 128GB', store: 'Amazon', price: 'R$ 4.199', saving: '-8,7%', date: '22/05', status: 'analisado' },
    { id: 3, product: 'Monitor LG 24"', store: 'Kabum', price: 'R$ 899', saving: '-14,3%', date: '19/05', status: 'comprado' },
    { id: 4, product: 'SSD Kingston 480GB', store: 'Pichau', price: 'R$ 219', saving: '-15,4%', date: '18/05', status: 'comprado' },
    { id: 5, product: 'Teclado Mecanico Redragon', store: 'Amazon', price: 'R$ 349', saving: '-12,1%', date: '15/05', status: 'comprado' },
    { id: 6, product: 'Headset HyperX Cloud II', store: 'Americanas', price: 'R$ 499', saving: '-9,2%', date: '12/05', status: 'expirado' },
];

const dailyData = [
    { dia: 'Seg', analises: 2, economia: 180, precisao: 94 },
    { dia: 'Ter', analises: 1, economia: 40, precisao: 97 },
    { dia: 'Qua', analises: 3, economia: 250, precisao: 92 },
    { dia: 'Qui', analises: 0, economia: 0, precisao: 95 },
    { dia: 'Sex', analises: 4, economia: 440, precisao: 98 },
    { dia: 'Sab', analises: 2, economia: 150, precisao: 96 },
    { dia: 'Dom', analises: 1, economia: 250, precisao: 99 },
];

const categoryData = [
    { categoria: 'Informatica', economia: 250, analises: 1 },
    { categoria: 'Smartphones', economia: 400, analises: 1 },
    { categoria: 'Perifericos', economia: 150, analises: 1 },
    { categoria: 'Hardware', economia: 40, analises: 1 },
];

const monthlyData = [
    { semana: 'Sem 1', economia: 320, analises: 5 },
    { semana: 'Sem 2', economia: 580, analises: 8 },
    { semana: 'Sem 3', economia: 410, analises: 6 },
    { semana: 'Sem 4', economia: 840, analises: 12 },
];

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
});

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) {
        return null;
    }

    return (
        <div
            className="rounded-xl border p-3 text-xs shadow-lg"
            style={{ backgroundColor: '#ffffff', borderColor: 'rgba(124,58,237,0.20)', color: '#1a1040' }}
        >
            <p className="mb-1.5 font-semibold" style={{ color: '#7c3aed' }}>{label}</p>
            {payload.map((item) => (
                <p key={`${item.name}-${item.value}`} style={{ color: item.color }}>
                    {item.name}: <strong>{item.name === 'economia' ? currencyFormatter.format(item.value) : item.name === 'precisao' ? `${item.value}%` : item.value}</strong>
                </p>
            ))}
        </div>
    );
};

function StatCard({ label, value, sub, color }) {
    const colors = {
        purple: { bg: '#ffffff', text: '#7c3aed', border: 'rgba(124,58,237,0.20)' },
        green: { bg: '#ffffff', text: '#059669', border: 'rgba(5,150,105,0.25)' },
        orange: { bg: '#ffffff', text: '#ea580c', border: 'rgba(234,88,12,0.25)' },
    };
    const selected = colors[color] || colors.purple;

    return (
        <div className="flex flex-col gap-1 rounded-2xl border p-5" style={{ backgroundColor: selected.bg, borderColor: selected.border }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b6b8a' }}>{label}</span>
            <span className="text-3xl font-bold" style={{ color: selected.text }}>{value}</span>
            {sub && <span className="text-xs" style={{ color: '#6b6b8a' }}>{sub}</span>}
        </div>
    );
}

function StatusPill({ status }) {
    const map = {
        comprado: { bg: '#ecfdf5', text: '#059669', label: 'Comprado' },
        analisado: { bg: '#ede9fe', text: '#7c3aed', label: 'Analisado' },
        expirado: { bg: '#f3f4f6', text: '#9ca3af', label: 'Expirado' },
    };
    const selected = map[status] || map.analisado;

    return (
        <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: selected.bg, color: selected.text }}>
            {selected.label}
        </span>
    );
}

function getBadgeStyle(type) {
    const map = {
        green: { bg: '#ecfdf5', text: '#059669', border: 'rgba(5,150,105,0.25)' },
        orange: { bg: '#fff7ed', text: '#ea580c', border: 'rgba(234,88,12,0.25)' },
        purple: { bg: '#ede9fe', text: '#7c3aed', border: 'rgba(124,58,237,0.20)' },
    };

    return map[type] || map.purple;
}

export default function Dashboard() {
    const { auth } = usePage().props;
    const firstName = auth.user.name.split(' ')[0];
    const [activeTab, setActiveTab] = useState('semana');
    const [chartTab, setChartTab] = useState('semanal');
    const bestInsight = weekInsights[2];

    const totalSaving = weekInsights.reduce((accumulator, item) => {
        const numericValue = Number(item.saving.replace('R$ ', '').replace('.', '').replace(',', '.'));
        return accumulator + numericValue;
    }, 0);

    const chartData = chartTab === 'semanal' ? dailyData : monthlyData;

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8" style={{ backgroundColor: '#f8f7ff' }}>
                <div className="mx-auto max-w-7xl space-y-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold" style={{ color: '#1a1040' }}>
                                Ola, {firstName}
                            </h1>
                            <p className="mt-1 text-sm" style={{ color: '#6b6b8a' }}>
                                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                href={route('chat')}
                                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
                                style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 4px 14px rgba(124,58,237,0.30)' }}
                            >
                                <span className="text-base">*</span>
                                Analisar com IA
                            </Link>
                            <button
                                type="button"
                                className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200"
                                style={{ borderColor: 'rgba(124,58,237,0.25)', color: '#7c3aed', backgroundColor: '#ffffff' }}
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Nova analise
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard label="Analises na semana" value={weekInsights.length} sub="2 a mais que na semana passada" color="purple" />
                        <StatCard label="Lojas monitoradas" value="22" sub="distribuidas em 4 consultas" color="purple" />
                        <StatCard label="Economia total" value={currencyFormatter.format(totalSaving)} sub="media de 11,8%" color="green" />
                        <StatCard label="Melhor desconto" value={`${bestInsight.savingPct}%`} sub={bestInsight.product.slice(0, 18) + '...'} color="orange" />
                    </div>

                    <div className="overflow-hidden rounded-2xl border" style={{ backgroundColor: '#ffffff', borderColor: 'rgba(124,58,237,0.12)' }}>
                        <div className="flex flex-col gap-3 border-b px-6 py-5 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: 'rgba(124,58,237,0.10)' }}>
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold" style={{ color: '#1a1040' }}>Desempenho da IA</h2>
                                    <p className="text-xs" style={{ color: '#6b6b8a' }}>Analises, economia e precisao ao longo do tempo</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {['semanal', 'mensal'].map((tab) => (
                                    <button
                                        key={tab}
                                        type="button"
                                        onClick={() => setChartTab(tab)}
                                        className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
                                        style={chartTab === tab ? { backgroundColor: '#7c3aed', color: '#ffffff' } : { backgroundColor: 'transparent', color: '#6b6b8a' }}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
                            <div>
                                <p className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b6b8a' }}>
                                    Economia gerada
                                </p>
                                <ResponsiveContainer width="100%" height={200}>
                                    <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="gradEco" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                                                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.08)" />
                                        <XAxis dataKey={chartTab === 'semanal' ? 'dia' : 'semana'} tick={{ fontSize: 11, fill: '#6b6b8a' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11, fill: '#6b6b8a' }} axisLine={false} tickLine={false} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="economia" name="economia" stroke="#7c3aed" strokeWidth={2.5} fill="url(#gradEco)" dot={{ fill: '#7c3aed', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#7c3aed' }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <div>
                                <p className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b6b8a' }}>
                                    Analises realizadas
                                </p>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.08)" vertical={false} />
                                        <XAxis dataKey={chartTab === 'semanal' ? 'dia' : 'semana'} tick={{ fontSize: 11, fill: '#6b6b8a' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11, fill: '#6b6b8a' }} axisLine={false} tickLine={false} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="analises" name="analises" fill="#a855f7" radius={[6, 6, 0, 0]} maxBarSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div>
                                <p className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b6b8a' }}>
                                    Precisao da IA
                                </p>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={dailyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(5,150,105,0.10)" />
                                        <XAxis dataKey="dia" tick={{ fontSize: 11, fill: '#6b6b8a' }} axisLine={false} tickLine={false} />
                                        <YAxis domain={[88, 100]} tick={{ fontSize: 11, fill: '#6b6b8a' }} axisLine={false} tickLine={false} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line type="monotone" dataKey="precisao" name="precisao" stroke="#059669" strokeWidth={2.5} dot={{ fill: '#059669', strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div>
                                <p className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b6b8a' }}>
                                    Economia por categoria
                                </p>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 5, left: 10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.08)" horizontal={false} />
                                        <XAxis type="number" tick={{ fontSize: 11, fill: '#6b6b8a' }} axisLine={false} tickLine={false} />
                                        <YAxis type="category" dataKey="categoria" tick={{ fontSize: 11, fill: '#6b6b8a' }} axisLine={false} tickLine={false} width={90} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="economia" name="economia" fill="#ea580c" radius={[0, 6, 6, 0]} maxBarSize={28} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="mx-6 mb-6 flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between" style={{ background: 'linear-gradient(135deg, #ede9fe 0%, #f0eeff 100%)', border: '1px solid rgba(124,58,237,0.20)' }}>
                            <div>
                                <p className="text-sm font-bold" style={{ color: '#1a1040' }}>
                                    Converse com a IA para analisar novos produtos
                                </p>
                                <p className="mt-0.5 text-xs" style={{ color: '#6b6b8a' }}>
                                    Diga qual produto voce quer comprar e a IA compara as melhores lojas em segundos.
                                </p>
                            </div>
                            <Link
                                href={route('chat')}
                                className="shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                                style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 4px 14px rgba(124,58,237,0.25)' }}
                            >
                                Ir para o chat
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border" style={{ backgroundColor: '#f0eeff', borderColor: 'rgba(124,58,237,0.20)' }}>
                        <div className="flex items-center gap-3 border-b px-6 py-4" style={{ borderColor: 'rgba(124,58,237,0.15)' }}>
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 10.1c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                            <div>
                                <span className="text-sm font-bold" style={{ color: '#7c3aed' }}>Insight ideal da semana</span>
                                <p className="text-xs" style={{ color: '#6b6b8a' }}>Maior economia identificada pela IA</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-6 px-6 py-5 lg:flex-row lg:items-center">
                            <div className="flex-1 space-y-3">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-lg font-bold" style={{ color: '#1a1040' }}>{bestInsight.product}</span>
                                    <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}>{bestInsight.badge}</span>
                                </div>
                                <p className="text-sm" style={{ color: '#6b6b8a' }}>
                                    A IA analisou <strong style={{ color: '#1a1040' }}>{bestInsight.stores} lojas</strong> e identificou que a{' '}
                                    <strong style={{ color: '#1a1040' }}>{bestInsight.bestStore}</strong> oferece o melhor custo-beneficio, com{' '}
                                    <strong style={{ color: '#059669' }}>{bestInsight.savingPct}% abaixo</strong> da media do mercado.
                                </p>
                                <div className="flex flex-wrap gap-4 text-sm">
                                    <div>
                                        <span style={{ color: '#6b6b8a' }}>Melhor preco</span>
                                        <p className="text-lg font-bold" style={{ color: '#059669' }}>{bestInsight.bestPrice}</p>
                                    </div>
                                    <div>
                                        <span style={{ color: '#6b6b8a' }}>Preco medio</span>
                                        <p className="text-lg font-bold" style={{ color: '#1a1040' }}>{bestInsight.avgPrice}</p>
                                    </div>
                                    <div>
                                        <span style={{ color: '#6b6b8a' }}>Economia</span>
                                        <p className="text-lg font-bold" style={{ color: '#ea580c' }}>{bestInsight.saving}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row gap-3 lg:flex-col lg:items-end">
                                <button
                                    type="button"
                                    className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                                    style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 4px 14px rgba(124,58,237,0.25)' }}
                                >
                                    Ver detalhes
                                </button>
                                <button
                                    type="button"
                                    className="rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all"
                                    style={{ borderColor: 'rgba(124,58,237,0.25)', color: '#7c3aed', backgroundColor: '#ffffff' }}
                                >
                                    Compartilhar
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="mb-5 flex items-center gap-1">
                            {[{ key: 'semana', label: 'Esta semana' }, { key: 'mes', label: 'Este mes' }].map((tab) => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setActiveTab(tab.key)}
                                    className="rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200"
                                    style={activeTab === tab.key ? { backgroundColor: '#7c3aed', color: '#ffffff' } : { backgroundColor: 'transparent', color: '#6b6b8a' }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                            <span className="ml-auto text-xs font-medium" style={{ color: '#6b6b8a' }}>
                                {weekInsights.length} insights encontrados
                            </span>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {weekInsights.map((insight) => {
                                const badge = getBadgeStyle(insight.badgeColor);
                                const isIdeal = insight.id === bestInsight.id;

                                return (
                                    <div
                                        key={insight.id}
                                        className="space-y-4 rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5"
                                        style={{
                                            backgroundColor: '#ffffff',
                                            borderColor: isIdeal ? 'rgba(124,58,237,0.35)' : 'rgba(124,58,237,0.12)',
                                            boxShadow: isIdeal ? '0 4px 20px rgba(124,58,237,0.10)' : 'none',
                                        }}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="truncate text-sm font-bold" style={{ color: '#1a1040' }}>{insight.product}</span>
                                                    {isIdeal && (
                                                        <span className="rounded-full px-2 py-0.5 text-xs font-semibold" style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}>
                                                            Ideal
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="mt-0.5 text-xs" style={{ color: '#6b6b8a' }}>
                                                    {insight.category} · {insight.stores} lojas · {insight.date}
                                                </span>
                                            </div>
                                            <span className="shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: badge.bg, color: badge.text, borderColor: badge.border }}>
                                                {insight.badge}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-end gap-4">
                                            <div>
                                                <span className="text-xs" style={{ color: '#6b6b8a' }}>Melhor preco</span>
                                                <p className="text-xl font-bold" style={{ color: '#059669' }}>{insight.bestPrice}</p>
                                                <span className="text-xs font-medium" style={{ color: '#059669' }}>
                                                    {insight.savingPct}% abaixo da media
                                                </span>
                                            </div>
                                            <div className="pb-0.5">
                                                <span className="text-xs" style={{ color: '#6b6b8a' }}>Media</span>
                                                <p className="text-base font-semibold line-through" style={{ color: '#6b6b8a' }}>{insight.avgPrice}</p>
                                            </div>
                                            <div className="ml-auto pb-0.5 text-right">
                                                <span className="text-xs" style={{ color: '#6b6b8a' }}>Economia</span>
                                                <p className="text-base font-bold" style={{ color: '#ea580c' }}>{insight.saving}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: 'rgba(124,58,237,0.10)' }}>
                                            <span className="rounded-lg px-3 py-1.5 text-xs font-semibold" style={{ backgroundColor: '#f0eeff', color: '#7c3aed' }}>
                                                {insight.bestStore}
                                            </span>
                                            <button type="button" className="text-xs font-semibold hover:underline" style={{ color: '#7c3aed' }}>
                                                Ver analise completa
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border" style={{ backgroundColor: '#ffffff', borderColor: 'rgba(124,58,237,0.12)' }}>
                        <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: 'rgba(124,58,237,0.10)' }}>
                            <div>
                                <h2 className="text-sm font-bold" style={{ color: '#1a1040' }}>Historico de analises</h2>
                                <p className="mt-0.5 text-xs" style={{ color: '#6b6b8a' }}>Ultimas {history.length} pesquisas realizadas</p>
                            </div>
                            <button type="button" className="text-xs font-semibold" style={{ color: '#7c3aed' }}>Ver tudo</button>
                        </div>
                        <div className="hidden overflow-x-auto sm:block">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ backgroundColor: '#f8f7ff' }}>
                                        {['Produto', 'Melhor loja', 'Preco', 'Economia', 'Data', 'Status'].map((heading) => (
                                            <th
                                                key={heading}
                                                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                                                style={{ color: '#6b6b8a' }}
                                            >
                                                {heading}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            style={{ borderTop: index > 0 ? '1px solid rgba(124,58,237,0.07)' : 'none' }}
                                            onMouseEnter={(event) => {
                                                event.currentTarget.style.backgroundColor = '#f8f7ff';
                                            }}
                                            onMouseLeave={(event) => {
                                                event.currentTarget.style.backgroundColor = 'transparent';
                                            }}
                                        >
                                            <td className="px-6 py-4 font-medium" style={{ color: '#1a1040' }}>{item.product}</td>
                                            <td className="px-6 py-4" style={{ color: '#6b6b8a' }}>{item.store}</td>
                                            <td className="px-6 py-4 font-semibold" style={{ color: '#1a1040' }}>{item.price}</td>
                                            <td className="px-6 py-4 font-semibold" style={{ color: '#059669' }}>{item.saving}</td>
                                            <td className="px-6 py-4" style={{ color: '#6b6b8a' }}>{item.date}</td>
                                            <td className="px-6 py-4"><StatusPill status={item.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="sm:hidden" style={{ borderColor: 'rgba(124,58,237,0.08)' }}>
                            {history.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="space-y-1.5 px-4 py-4"
                                    style={{ borderTop: index > 0 ? '1px solid rgba(124,58,237,0.08)' : 'none' }}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="text-sm font-semibold" style={{ color: '#1a1040' }}>{item.product}</span>
                                        <StatusPill status={item.status} />
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: '#6b6b8a' }}>
                                        <span>{item.store}</span>
                                        <span>·</span>
                                        <span className="font-semibold" style={{ color: '#1a1040' }}>{item.price}</span>
                                        <span>·</span>
                                        <span className="font-semibold" style={{ color: '#059669' }}>{item.saving}</span>
                                        <span className="ml-auto">{item.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
