import { createPortal } from 'react-dom';
import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import BrandLogo from '@/Components/branding/BrandLogo';
import { chatHistoryItems, useChatSidebarOptional } from '@/contexts/ChatSidebarContext';

const DashboardIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
);

const ChatIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

const LogoutIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const ProfileIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const PlansNavIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <line x1="8" y1="15" x2="12" y2="15" />
    </svg>
);

const SettingsNavIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

const SparkleIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
);

const PlusIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const HamburgerIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

const getIsDesktop = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.innerWidth >= 768;
};

export default function AuthenticatedLayout({ children }) {
    const page = usePage();
    const { auth } = page.props;
    const pageUrl = page.url ?? '';
    const user = auth.user;
    const chatSidebar = useChatSidebarOptional();
    const isChatRoute = useMemo(() => route().current('chat'), [pageUrl]);

    const [isDesktop, setIsDesktop] = useState(getIsDesktop);
    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        try {
            return localStorage.getItem('sidebar_collapsed') === 'true';
        } catch {
            return false;
        }
    });
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const profileButtonRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            const nextIsDesktop = getIsDesktop();
            setIsDesktop(nextIsDesktop);

            if (nextIsDesktop) {
                setMobileOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setUserMenuOpen(false);
                setMobileOpen(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [pageUrl]);

    const toggleCollapsed = () => {
        const next = !collapsed;
        setCollapsed(next);

        try {
            localStorage.setItem('sidebar_collapsed', String(next));
        } catch {
            // Ignore storage failures.
        }
    };

    const closeMobileSidebar = () => setMobileOpen(false);

    const initials = user.name
        .split(' ')
        .map((name) => name[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const navLinks = [
        { label: 'Dashboard', route: 'dashboard', icon: <DashboardIcon /> },
        { label: 'Chat IA', route: 'chat', icon: <ChatIcon />, isChat: true },
        { label: 'Planos', href: route('profile.edit', { section: 'plans' }), icon: <PlansNavIcon /> },
        { label: 'Configuracoes', route: 'settings', icon: <SettingsNavIcon /> },
    ];

    const sidebarWidth = isDesktop ? (collapsed ? '72px' : '260px') : '280px';
    const mainOffset = isDesktop ? sidebarWidth : '0px';
    const showChatPanel = isChatRoute && chatSidebar && (!isDesktop || !collapsed);

    const getDropdownPosition = () => {
        if (!profileButtonRef.current || typeof window === 'undefined') {
            return {};
        }

        const rect = profileButtonRef.current.getBoundingClientRect();

        if (collapsed && isDesktop) {
            return {
                position: 'fixed',
                bottom: window.innerHeight - rect.bottom,
                left: rect.right + 8,
                width: '200px',
                transformOrigin: 'left bottom',
                animation: 'slideInRight 0.22s cubic-bezier(0.4,0,0.2,1)',
            };
        }

        return {
            position: 'fixed',
            bottom: window.innerHeight - rect.top + 8,
            left: rect.left,
            width: Math.max(rect.width, 220) + 'px',
            transformOrigin: 'bottom center',
            animation: 'slideInUp 0.22s cubic-bezier(0.4,0,0.2,1)',
        };
    };

    return (
        <div className="min-h-screen min-h-[100dvh]" style={{ backgroundColor: '#f8f7ff' }}>
            <style>{`
                @keyframes slideInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(-10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>

            {!isDesktop && (
                <header
                    className="fixed left-0 right-0 top-0 z-20 flex h-14 items-center gap-3 border-b px-4 md:hidden"
                    style={{
                        backgroundColor: '#f8f7ff',
                        borderColor: 'rgba(124,58,237,0.14)',
                    }}
                >
                    <button
                        type="button"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Abrir menu"
                        aria-expanded={mobileOpen}
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border"
                        style={{
                            borderColor: 'rgba(124,58,237,0.22)',
                            backgroundColor: '#ffffff',
                            color: '#1a1040',
                        }}
                    >
                        <HamburgerIcon />
                    </button>
                    <BrandLogo
                        href={route('dashboard')}
                        iconClassName="h-8 w-8 rounded-[10px]"
                        nameClassName="min-w-0 truncate text-[17px]"
                        nameStyle={{ color: '#1a1040' }}
                    />
                </header>
            )}

            {mobileOpen && !isDesktop && (
                <div
                    className="fixed inset-0 z-30 md:hidden"
                    style={{ backgroundColor: 'rgba(26,16,64,0.45)', backdropFilter: 'blur(4px)' }}
                    onClick={closeMobileSidebar}
                    aria-hidden="true"
                />
            )}

            <aside
                style={{
                    width: sidebarWidth,
                    minWidth: sidebarWidth,
                    backgroundColor: '#1a1040',
                    borderRight: '1px solid rgba(124,58,237,0.18)',
                    transition:
                        'width 0.28s cubic-bezier(0.4,0,0.2,1), min-width 0.28s cubic-bezier(0.4,0,0.2,1), transform 0.28s cubic-bezier(0.4,0,0.2,1)',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    height: '100vh',
                    zIndex: 40,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
                className={`transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed && isDesktop ? 'center' : 'space-between',
                        padding: collapsed && isDesktop ? '18px 0' : '18px 16px',
                        borderBottom: '1px solid rgba(124,58,237,0.12)',
                        minHeight: '64px',
                        gap: '10px',
                        flexShrink: 0,
                    }}
                >
                    <button
                        type="button"
                        onClick={() => {
                            if (isDesktop) {
                                toggleCollapsed();
                            } else {
                                setMobileOpen((open) => !open);
                            }
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'rgba(255,255,255,0.60)',
                            padding: '4px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            flexShrink: 0,
                        }}
                        title={isDesktop ? (collapsed ? 'Expandir menu' : 'Recolher menu') : 'Fechar menu'}
                        aria-label={isDesktop ? (collapsed ? 'Expandir menu' : 'Recolher menu') : 'Menu'}
                    >
                        <HamburgerIcon />
                    </button>

                    {(!collapsed || !isDesktop) && (
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <BrandLogo
                                href={route('dashboard')}
                                iconClassName="h-8 w-8 rounded-[10px]"
                                nameClassName="text-[17px] text-white"
                            />
                        </div>
                    )}
                </div>

                <nav
                    style={{
                        padding: '12px 8px',
                        flexShrink: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                    }}
                >
                    {navLinks.map((link) => {
                        const isActive = link.href ? pageUrl.includes('section=plans') : route().current(link.route);

                        return (
                            <Link
                                key={link.href ?? link.route}
                                href={link.href ?? route(link.route)}
                                title={collapsed && isDesktop ? link.label : undefined}
                                onClick={closeMobileSidebar}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: collapsed && isDesktop ? '0' : '10px',
                                    justifyContent: collapsed && isDesktop ? 'center' : 'flex-start',
                                    padding: collapsed && isDesktop ? '10px 0' : '10px 12px',
                                    borderRadius: '10px',
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    transition: 'all 0.18s ease',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    ...(isActive
                                        ? { backgroundColor: 'rgba(124,58,237,0.22)', color: '#c4b5fd' }
                                        : link.isChat
                                          ? {
                                                backgroundColor: 'rgba(124,58,237,0.10)',
                                                color: '#a78bfa',
                                                border: '1px solid rgba(124,58,237,0.20)',
                                            }
                                          : { color: 'rgba(255,255,255,0.60)' }),
                                }}
                            >
                                <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                                    {link.isChat ? <SparkleIcon /> : link.icon}
                                </span>
                                {(!collapsed || !isDesktop) && <span>{link.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {showChatPanel && (
                    <div
                        className="mx-2 mb-2 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border"
                        style={{
                            borderColor: 'rgba(124,58,237,0.22)',
                            backgroundColor: 'rgba(61,32,128,0.40)',
                        }}
                    >
                        <div className="border-b p-3" style={{ borderColor: 'rgba(168,85,247,0.15)' }}>
                            <button
                                type="button"
                                onClick={() => {
                                    chatSidebar.startNewChat();
                                    closeMobileSidebar();
                                }}
                                className="flex w-full items-center justify-center gap-2 rounded-[10px] border px-3 py-2 text-[13px] font-semibold transition-colors"
                                style={{
                                    borderColor: 'rgba(168,85,247,0.35)',
                                    color: '#e9d5ff',
                                    backgroundColor: 'rgba(168,85,247,0.08)',
                                }}
                            >
                                <PlusIcon />
                                Nova conversa
                            </button>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto p-2">
                            <p
                                className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider"
                                style={{ color: 'rgba(255,255,255,0.45)' }}
                            >
                                Recentes
                            </p>
                            {chatHistoryItems.map((chat) => (
                                <button
                                    key={chat.id}
                                    type="button"
                                    onClick={() => {
                                        chatSidebar.setActiveChat(chat.id);
                                        closeMobileSidebar();
                                    }}
                                    className="mb-0.5 block w-full rounded-[9px] px-2.5 py-2 text-left transition-colors"
                                    style={{
                                        backgroundColor:
                                            chatSidebar.activeChat === chat.id
                                                ? 'rgba(168,85,247,0.22)'
                                                : 'transparent',
                                    }}
                                >
                                    <p
                                        className="truncate text-[13px] font-medium"
                                        style={{
                                            color:
                                                chatSidebar.activeChat === chat.id
                                                    ? '#e9d5ff'
                                                    : 'rgba(255,255,255,0.82)',
                                        }}
                                    >
                                        {chat.title}
                                    </p>
                                    <p className="mt-0.5 text-[11px]" style={{ color: 'rgba(255,255,255,0.40)' }}>
                                        {chat.date}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {!showChatPanel && <div style={{ flex: 1 }} />}

                <div
                    style={{
                        borderTop: '1px solid rgba(124,58,237,0.12)',
                        padding: '10px 8px',
                        flexShrink: 0,
                    }}
                >
                    <button
                        ref={profileButtonRef}
                        type="button"
                        onClick={() => setUserMenuOpen((open) => !open)}
                        title={collapsed && isDesktop ? user.name : undefined}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: collapsed && isDesktop ? '0' : '10px',
                            justifyContent: collapsed && isDesktop ? 'center' : 'flex-start',
                            width: '100%',
                            padding: collapsed && isDesktop ? '8px 0' : '8px 10px',
                            borderRadius: '10px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        <div
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '9px',
                                background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: '12px',
                                fontWeight: 700,
                                flexShrink: 0,
                            }}
                        >
                            {initials}
                        </div>
                        {(!collapsed || !isDesktop) && (
                            <div style={{ textAlign: 'left', overflow: 'hidden', flex: 1, minWidth: 0 }}>
                                <p
                                    style={{
                                        color: '#fff',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        margin: 0,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {user.name.split(' ')[0]}
                                </p>
                                <p
                                    style={{
                                        color: 'rgba(255,255,255,0.45)',
                                        fontSize: '11px',
                                        margin: 0,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {user.email}
                                </p>
                            </div>
                        )}
                    </button>
                </div>
            </aside>

            {userMenuOpen &&
                createPortal(
                    <>
                        <div className="fixed inset-0" style={{ zIndex: 9998 }} onClick={() => setUserMenuOpen(false)} />
                        <div
                            style={{
                                ...getDropdownPosition(),
                                zIndex: 9999,
                                backgroundColor: '#3d2080',
                                borderRadius: '14px',
                                border: '1px solid rgba(168,85,247,0.25)',
                                boxShadow: '0 8px 32px rgba(124,58,237,0.25)',
                                overflow: 'hidden',
                            }}
                        >
                            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(168,85,247,0.20)' }}>
                                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#fff' }}>{user.name}</p>
                                <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.55)', marginTop: '2px' }}>
                                    {user.email}
                                </p>
                            </div>
                            <div style={{ padding: '6px' }}>
                                <Link
                                    href={route('profile.edit')}
                                    onClick={() => setUserMenuOpen(false)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '9px 12px',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                        fontSize: '13px',
                                        color: 'rgba(255,255,255,0.85)',
                                    }}
                                >
                                    <ProfileIcon /> Meu perfil
                                </Link>
                                <Link
                                    href={route('settings')}
                                    onClick={() => setUserMenuOpen(false)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '9px 12px',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                        fontSize: '13px',
                                        color: 'rgba(255,255,255,0.85)',
                                    }}
                                >
                                    <SettingsNavIcon /> Configuracoes
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setUserMenuOpen(false);
                                        router.post(route('logout'));
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        width: '100%',
                                        padding: '9px 12px',
                                        borderRadius: '8px',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        color: '#f97316',
                                    }}
                                >
                                    <LogoutIcon /> Sair
                                </button>
                            </div>
                        </div>
                    </>,
                    document.body,
                )}

            <main
                className={`min-w-0 overflow-x-hidden ${!isDesktop ? 'pt-14' : ''}`}
                style={{
                    marginLeft: mainOffset,
                    transition: 'margin-left 0.28s cubic-bezier(0.4,0,0.2,1)',
                }}
            >
                {children}
            </main>
        </div>
    );
}
