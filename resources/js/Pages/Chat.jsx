import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

const SendIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

const PlusIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const SparkleIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
);

const MenuIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

const StoreIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const getIsWide = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.innerWidth >= 1024;
};

const aiResponses = (message) => {
    const normalizedMessage = message.toLowerCase();

    if (normalizedMessage.includes('notebook') || normalizedMessage.includes('laptop')) {
        return {
            text: 'Analisei 6 lojas para notebooks. Estas sao as opcoes com melhor margem de revenda no momento:',
            products: [
                { name: 'Dell Inspiron 15', store: 'Magazine Luiza', price: 'R$ 2.599', badge: 'Melhor preco', badgeColor: 'green', margin: '+18%' },
                { name: 'Lenovo IdeaPad 3', store: 'Mercado Livre', price: 'R$ 2.899', badge: 'Mais vendido', badgeColor: 'purple', margin: '+6%' },
                { name: 'Acer Aspire 5', store: 'Amazon', price: 'R$ 2.749', badge: 'Boa margem', badgeColor: 'orange', margin: '+12%' },
            ],
            tip: 'O Dell Inspiron 15 na Magazine Luiza combina melhor preco, frete competitivo e giro rapido para revenda.',
        };
    }

    if (normalizedMessage.includes('iphone') || normalizedMessage.includes('celular') || normalizedMessage.includes('smartphone')) {
        return {
            text: 'Comparei os smartphones nas principais lojas e organizei os melhores cenarios de compra:',
            products: [
                { name: 'iPhone 15 128GB', store: 'Amazon', price: 'R$ 4.199', badge: 'Melhor preco', badgeColor: 'green', margin: '+22%' },
                { name: 'iPhone 15 128GB', store: 'Americanas', price: 'R$ 4.499', badge: 'Frete gratis', badgeColor: 'purple', margin: '+14%' },
                { name: 'Samsung Galaxy S24', store: 'Kabum', price: 'R$ 3.899', badge: 'Alternativa', badgeColor: 'orange', margin: '+28%' },
            ],
            tip: 'Hoje a Amazon esta com o menor preco para iPhone 15, mas o Galaxy S24 entrega a maior margem percentual.',
        };
    }

    if (normalizedMessage.includes('monitor') || normalizedMessage.includes('tela')) {
        return {
            text: 'Varredura concluida para monitores. Estes itens equilibram preco, busca e potencial de revenda:',
            products: [
                { name: 'Monitor LG 24" FHD', store: 'Kabum', price: 'R$ 899', badge: 'Melhor preco', badgeColor: 'green', margin: '+14%' },
                { name: 'Monitor Samsung 27"', store: 'Pichau', price: 'R$ 1.199', badge: 'Alta qualidade', badgeColor: 'purple', margin: '+10%' },
                { name: 'Monitor AOC 24"', store: 'Americanas', price: 'R$ 849', badge: 'Custo-beneficio', badgeColor: 'orange', margin: '+16%' },
            ],
            tip: 'O AOC 24" tem o melhor custo-beneficio, enquanto o LG 24" tende a vender mais rapido.',
        };
    }

    if (normalizedMessage.includes('ssd') || normalizedMessage.includes('hd') || normalizedMessage.includes('armazenamento')) {
        return {
            text: 'Analise de armazenamento concluida. Estes sao os precos mais interessantes entre os principais marketplaces:',
            products: [
                { name: 'SSD Kingston 480GB', store: 'Pichau', price: 'R$ 219', badge: 'Preco minimo', badgeColor: 'green', margin: '+15%' },
                { name: 'SSD Crucial 500GB', store: 'Kabum', price: 'R$ 239', badge: 'Mais vendido', badgeColor: 'purple', margin: '+12%' },
                { name: 'HD Seagate 1TB', store: 'Amazon', price: 'R$ 299', badge: 'Alta demanda', badgeColor: 'orange', margin: '+18%' },
            ],
            tip: 'O SSD Kingston 480GB na Pichau esta no menor preco observado no recorte mais recente.',
        };
    }

    return {
        text: 'Posso montar uma comparacao mais precisa se voce informar modelo, marca ou categoria do produto.',
        products: [],
        tip: 'Exemplos: "iPhone 15 Pro 256GB", "Notebook Dell para escritorio" ou "SSD NVMe 1TB".',
    };
};

const suggestedPrompts = [
    { label: 'Notebooks em promocao', sub: 'Comparar precos e margens' },
    { label: 'iPhone 15 mais barato', sub: 'Menor preco entre lojas' },
    { label: 'Monitor para trabalho', sub: 'Custo-beneficio e giro' },
    { label: 'SSD com melhor preco', sub: 'Armazenamento e margem' },
];

const chatHistory = [
    { id: 1, title: 'Notebook para escritorio', date: 'Hoje' },
    { id: 2, title: 'iPhone 15 vs Samsung S24', date: 'Ontem' },
    { id: 3, title: 'Monitor gamer 144Hz', date: '19/05' },
    { id: 4, title: 'SSD Kingston 480GB', date: '15/05' },
    { id: 5, title: 'Teclado mecanico barato', date: '12/05' },
];

function ProductCard({ product }) {
    const colors = {
        green: { bg: '#ecfdf5', text: '#059669', border: 'rgba(5,150,105,0.20)' },
        purple: { bg: '#ede9fe', text: '#7c3aed', border: 'rgba(124,58,237,0.18)' },
        orange: { bg: '#fff7ed', text: '#ea580c', border: 'rgba(234,88,12,0.20)' },
    };
    const selected = colors[product.badgeColor] || colors.purple;

    return (
        <div
            className="flex items-center justify-between gap-3 rounded-xl border p-3 transition-all duration-150"
            style={{ backgroundColor: '#ffffff', border: '1px solid rgba(124,58,237,0.10)' }}
            onMouseEnter={(event) => {
                event.currentTarget.style.borderColor = 'rgba(124,58,237,0.22)';
            }}
            onMouseLeave={(event) => {
                event.currentTarget.style.borderColor = 'rgba(124,58,237,0.10)';
            }}
        >
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <div
                    style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        backgroundColor: '#f0eeff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: '#7c3aed',
                    }}
                >
                    <StoreIcon />
                </div>
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold" style={{ color: '#1a1040' }}>{product.name}</p>
                    <p className="mt-0.5 text-xs" style={{ color: '#6b6b8a' }}>{product.store}</p>
                </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-full px-2 py-0.5 text-xs font-semibold" style={{ backgroundColor: selected.bg, color: selected.text, border: `1px solid ${selected.border}` }}>
                    {product.badge}
                </span>
                <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: '#1a1040' }}>{product.price}</p>
                    <p className="text-xs font-semibold" style={{ color: '#059669' }}>{product.margin}</p>
                </div>
            </div>
        </div>
    );
}

function TypingDots() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 0' }}>
            {[0, 1, 2].map((index) => (
                <span
                    key={index}
                    style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#a855f7',
                        display: 'inline-block',
                        animation: 'bounce 1.2s ease-in-out infinite',
                        animationDelay: `${index * 0.18}s`,
                    }}
                />
            ))}
            <style>{`
                @keyframes bounce {
                    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
                    40% { transform: translateY(-5px); opacity: 1; }
                }
            `}</style>
        </div>
    );
}

export default function Chat() {
    const { auth } = usePage().props;
    const user = auth.user;
    const firstName = user.name.split(' ')[0];
    const initials = user.name.split(' ').map((name) => name[0]).slice(0, 2).join('').toUpperCase();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isWide, setIsWide] = useState(getIsWide);
    const [sidebarOpen, setSidebarOpen] = useState(getIsWide);
    const [activeChat, setActiveChat] = useState(null);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            const nextIsWide = getIsWide();
            setIsWide(nextIsWide);
            setSidebarOpen((current) => (nextIsWide ? true : current && !nextIsWide));

            if (!nextIsWide) {
                setSidebarOpen(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) {
            return;
        }

        textarea.style.height = 'auto';
        textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }, [input]);

    const sendMessage = (text) => {
        const userMessage = (text || input).trim();
        if (!userMessage || isTyping) {
            return;
        }

        setInput('');
        setMessages((previous) => [...previous, { id: Date.now(), role: 'user', text: userMessage }]);
        setIsTyping(true);

        setTimeout(() => {
            const response = aiResponses(userMessage);
            setIsTyping(false);
            setMessages((previous) => [
                ...previous,
                {
                    id: Date.now() + 1,
                    role: 'ai',
                    text: response.text,
                    products: response.products,
                    tip: response.tip,
                },
            ]);
        }, 1200);
    };

    const startNewChat = () => {
        setMessages([]);
        setActiveChat(null);
        if (!isWide) {
            setSidebarOpen(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };

    const isEmpty = messages.length === 0;

    return (
        <AuthenticatedLayout>
            <Head title="Chat IA" />

            <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f8f7ff', overflow: 'hidden', position: 'relative' }}>
                {!isWide && sidebarOpen && (
                    <div
                        className="fixed inset-0"
                        style={{ backgroundColor: 'rgba(26,16,64,0.35)', backdropFilter: 'blur(2px)', zIndex: 60 }}
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <aside
                    style={{
                        width: sidebarOpen ? '260px' : '0px',
                        minWidth: sidebarOpen ? '260px' : '0px',
                        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1), min-width 0.25s cubic-bezier(0.4,0,0.2,1)',
                        overflow: 'hidden',
                        backgroundColor: '#3d2080',
                        borderRight: '1px solid rgba(168,85,247,0.20)',
                        display: 'flex',
                        flexDirection: 'column',
                        flexShrink: 0,
                        ...(isWide
                            ? { position: 'relative', zIndex: 1 }
                            : { position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 70 }),
                    }}
                >
                    <div style={{ padding: '16px 12px 12px', borderBottom: '1px solid rgba(168,85,247,0.15)' }}>
                        <button
                            type="button"
                            onClick={startNewChat}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '9px 16px',
                                borderRadius: '10px',
                                border: '1px solid rgba(168,85,247,0.30)',
                                backgroundColor: 'transparent',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#c4b5fd',
                                transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(event) => {
                                event.currentTarget.style.backgroundColor = 'rgba(168,85,247,0.15)';
                                event.currentTarget.style.borderColor = 'rgba(168,85,247,0.50)';
                            }}
                            onMouseLeave={(event) => {
                                event.currentTarget.style.backgroundColor = 'transparent';
                                event.currentTarget.style.borderColor = 'rgba(168,85,247,0.30)';
                            }}
                        >
                            <PlusIcon /> Nova conversa
                        </button>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px' }}>
                        <p
                            style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                color: 'rgba(255,255,255,0.40)',
                                padding: '4px 8px 8px',
                            }}
                        >
                            Recentes
                        </p>
                        {chatHistory.map((chat) => (
                            <button
                                key={chat.id}
                                type="button"
                                onClick={() => {
                                    setActiveChat(chat.id);
                                    if (!isWide) {
                                        setSidebarOpen(false);
                                    }
                                }}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '8px 10px',
                                    borderRadius: '9px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    backgroundColor: activeChat === chat.id ? 'rgba(168,85,247,0.20)' : 'transparent',
                                    transition: 'background 0.15s ease',
                                    marginBottom: '1px',
                                    display: 'block',
                                }}
                                onMouseEnter={(event) => {
                                    if (activeChat !== chat.id) {
                                        event.currentTarget.style.backgroundColor = 'rgba(168,85,247,0.10)';
                                    }
                                }}
                                onMouseLeave={(event) => {
                                    if (activeChat !== chat.id) {
                                        event.currentTarget.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: '13px',
                                        fontWeight: 500,
                                        margin: 0,
                                        color: activeChat === chat.id ? '#c4b5fd' : 'rgba(255,255,255,0.80)',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {chat.title}
                                </p>
                                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.40)', margin: '2px 0 0' }}>
                                    {chat.date}
                                </p>
                            </button>
                        ))}
                    </div>
                </aside>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '0 16px',
                            height: '56px',
                            flexShrink: 0,
                            backgroundColor: '#ffffff',
                            borderBottom: '1px solid rgba(124,58,237,0.10)',
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setSidebarOpen((open) => !open)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#6b6b8a',
                                padding: '7px',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'all 0.15s',
                            }}
                            onMouseEnter={(event) => {
                                event.currentTarget.style.backgroundColor = '#f0eeff';
                                event.currentTarget.style.color = '#7c3aed';
                            }}
                            onMouseLeave={(event) => {
                                event.currentTarget.style.backgroundColor = 'transparent';
                                event.currentTarget.style.color = '#6b6b8a';
                            }}
                        >
                            <MenuIcon />
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg,#1a1040,#4c1d95)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#a78bfa',
                                    flexShrink: 0,
                                }}
                            >
                                <SparkleIcon size={14} />
                            </div>
                            <div>
                                <p style={{ fontSize: '14px', fontWeight: 700, color: '#1a1040', margin: 0, lineHeight: 1.2 }}>
                                    Orin IA
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                                    <span
                                        style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            backgroundColor: '#059669',
                                            display: 'inline-block',
                                            animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
                                        }}
                                    />
                                    <style>{`@keyframes pulse { 0%,100%{opacity:1}50%{opacity:.4} }`}</style>
                                    <span style={{ fontSize: '11px', color: '#059669' }}>
                                        Analisando 50+ lojas
                                    </span>
                                </div>
                            </div>
                        </div>

                        {isWide && (
                            <div style={{ marginLeft: 'auto' }}>
                                <span
                                    style={{
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        color: '#7c3aed',
                                        backgroundColor: '#ede9fe',
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        border: '1px solid rgba(124,58,237,0.15)',
                                    }}
                                >
                                    95 analises restantes
                                </span>
                            </div>
                        )}
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 0' }}>
                        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>
                            {isEmpty && (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minHeight: '60vh',
                                        gap: '36px',
                                    }}
                                >
                                    <div style={{ textAlign: 'center' }}>
                                        <div
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '14px',
                                                background: 'linear-gradient(135deg,#1a1040,#4c1d95)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: '0 auto 20px',
                                                color: '#a78bfa',
                                                boxShadow: '0 8px 24px rgba(124,58,237,0.20)',
                                            }}
                                        >
                                            <SparkleIcon size={20} />
                                        </div>
                                        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1a1040', margin: '0 0 8px' }}>
                                            Ola, {firstName}
                                        </h2>
                                        <p style={{ fontSize: '14px', color: '#6b6b8a', margin: 0, lineHeight: 1.6, maxWidth: '340px' }}>
                                            Informe o produto que deseja analisar e eu comparo os precos das principais lojas em segundos.
                                        </p>
                                    </div>

                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: isWide ? '1fr 1fr' : '1fr',
                                            gap: '10px',
                                            width: '100%',
                                        }}
                                    >
                                        {suggestedPrompts.map((prompt) => (
                                            <button
                                                key={prompt.label}
                                                type="button"
                                                onClick={() => sendMessage(prompt.label)}
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '14px 16px',
                                                    borderRadius: '12px',
                                                    border: '1px solid rgba(124,58,237,0.13)',
                                                    backgroundColor: '#ffffff',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.15s ease',
                                                }}
                                                onMouseEnter={(event) => {
                                                    event.currentTarget.style.borderColor = 'rgba(124,58,237,0.30)';
                                                    event.currentTarget.style.backgroundColor = '#f8f7ff';
                                                    event.currentTarget.style.transform = 'translateY(-1px)';
                                                    event.currentTarget.style.boxShadow = '0 4px 16px rgba(124,58,237,0.08)';
                                                }}
                                                onMouseLeave={(event) => {
                                                    event.currentTarget.style.borderColor = 'rgba(124,58,237,0.13)';
                                                    event.currentTarget.style.backgroundColor = '#ffffff';
                                                    event.currentTarget.style.transform = 'none';
                                                    event.currentTarget.style.boxShadow = 'none';
                                                }}
                                            >
                                                <p style={{ fontSize: '13px', fontWeight: 600, color: '#1a1040', margin: '0 0 3px' }}>
                                                    {prompt.label}
                                                </p>
                                                <p style={{ fontSize: '11px', color: '#6b6b8a', margin: 0 }}>
                                                    {prompt.sub}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        style={{
                                            display: 'flex',
                                            flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                                            gap: '12px',
                                            alignItems: 'flex-start',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '30px',
                                                height: '30px',
                                                borderRadius: '9px',
                                                flexShrink: 0,
                                                background: message.role === 'user' ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : 'linear-gradient(135deg,#1a1040,#4c1d95)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: message.role === 'user' ? '#fff' : '#a78bfa',
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                marginTop: '2px',
                                            }}
                                        >
                                            {message.role === 'user' ? initials : <SparkleIcon size={13} />}
                                        </div>

                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '8px',
                                                alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
                                                flex: 1,
                                                minWidth: 0,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    padding: '11px 15px',
                                                    borderRadius: message.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                                    fontSize: '14px',
                                                    lineHeight: '1.6',
                                                    maxWidth: '520px',
                                                    ...(message.role === 'user'
                                                        ? {
                                                              background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
                                                              color: '#ffffff',
                                                          }
                                                        : {
                                                              backgroundColor: '#ffffff',
                                                              color: '#1a1040',
                                                              border: '1px solid rgba(124,58,237,0.10)',
                                                          }),
                                                }}
                                            >
                                                {message.text}
                                            </div>

                                            {message.products?.length > 0 && (
                                                <div style={{ width: '100%', maxWidth: '520px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                    {message.products.map((product, index) => (
                                                        <ProductCard key={`${product.name}-${index}`} product={product} />
                                                    ))}
                                                </div>
                                            )}

                                            {message.tip && (
                                                <div
                                                    style={{
                                                        maxWidth: '520px',
                                                        width: '100%',
                                                        padding: '11px 14px',
                                                        borderRadius: '10px',
                                                        fontSize: '13px',
                                                        lineHeight: 1.6,
                                                        color: '#1a1040',
                                                        backgroundColor: '#ecfdf5',
                                                        border: '1px solid rgba(5,150,105,0.20)',
                                                    }}
                                                >
                                                    <span style={{ fontWeight: 600, color: '#059669' }}>Recomendacao: </span>
                                                    {message.tip}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {isTyping && (
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                        <div
                                            style={{
                                                width: '30px',
                                                height: '30px',
                                                borderRadius: '9px',
                                                flexShrink: 0,
                                                background: 'linear-gradient(135deg,#1a1040,#4c1d95)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#a78bfa',
                                                marginTop: '2px',
                                            }}
                                        >
                                            <SparkleIcon size={13} />
                                        </div>
                                        <div style={{ padding: '11px 16px', borderRadius: '16px 16px 16px 4px', backgroundColor: '#ffffff', border: '1px solid rgba(124,58,237,0.10)' }}>
                                            <TypingDots />
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '12px 24px 16px', backgroundColor: '#ffffff', borderTop: '1px solid rgba(124,58,237,0.10)', flexShrink: 0 }}>
                        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    gap: '10px',
                                    padding: '10px 12px 10px 16px',
                                    borderRadius: '14px',
                                    border: '1px solid rgba(124,58,237,0.20)',
                                    backgroundColor: '#f8f7ff',
                                    transition: 'border-color 0.2s, box-shadow 0.2s',
                                }}
                                onFocusCapture={(event) => {
                                    event.currentTarget.style.borderColor = '#7c3aed';
                                    event.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.08)';
                                }}
                                onBlurCapture={(event) => {
                                    event.currentTarget.style.borderColor = 'rgba(124,58,237,0.20)';
                                    event.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <textarea
                                    ref={textareaRef}
                                    value={input}
                                    onChange={(event) => setInput(event.target.value)}
                                    onKeyDown={handleKeyDown}
                                    rows={1}
                                    placeholder="Qual produto voce quer analisar?"
                                    style={{
                                        flex: 1,
                                        background: 'transparent',
                                        border: 'none',
                                        outline: 'none',
                                        resize: 'none',
                                        fontSize: '14px',
                                        color: '#1a1040',
                                        lineHeight: '1.55',
                                        maxHeight: '160px',
                                        fontFamily: 'inherit',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => sendMessage()}
                                    disabled={!input.trim() || isTyping}
                                    style={{
                                        width: '34px',
                                        height: '34px',
                                        borderRadius: '9px',
                                        flexShrink: 0,
                                        border: 'none',
                                        cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                                        background: input.trim() && !isTyping ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : 'rgba(124,58,237,0.15)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: input.trim() && !isTyping ? '#ffffff' : '#a78bfa',
                                        transition: 'all 0.2s ease',
                                        transform: 'none',
                                    }}
                                    onMouseEnter={(event) => {
                                        if (input.trim() && !isTyping) {
                                            event.currentTarget.style.transform = 'scale(1.05)';
                                        }
                                    }}
                                    onMouseLeave={(event) => {
                                        event.currentTarget.style.transform = 'none';
                                    }}
                                >
                                    <SendIcon />
                                </button>
                            </div>
                            <p style={{ textAlign: 'center', fontSize: '11px', color: '#6b6b8a', marginTop: '8px' }}>
                                Enter para enviar · Shift+Enter para nova linha
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
