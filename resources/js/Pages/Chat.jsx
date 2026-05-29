import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ChatSidebarProvider, useChatSidebar } from '@/contexts/ChatSidebarContext';
import { Head, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';

const SendIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

const SparkleIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
);

const COMING_SOON_MESSAGE =
    'Analises com IA em breve. Esta funcionalidade ainda esta em desenvolvimento — em breve voce podera comparar precos entre lojas por aqui.';

export default function Chat() {
    return (
        <ChatSidebarProvider>
            <ChatPage />
        </ChatSidebarProvider>
    );
}

function ChatPage() {
    const { auth } = usePage().props;
    const user = auth.user;
    const chatSidebar = useChatSidebar();
    const firstName = user.name.split(' ')[0];
    const initials = user.name.split(' ').map((name) => name[0]).slice(0, 2).join('').toUpperCase();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    const clearConversation = useCallback(() => {
        setMessages([]);
        setInput('');
    }, []);

    useEffect(() => {
        chatSidebar.registerStartNewChat(clearConversation);
    }, [chatSidebar, clearConversation]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
        if (!userMessage) {
            return;
        }

        setInput('');
        setMessages((previous) => [
            ...previous,
            { id: Date.now(), role: 'user', text: userMessage },
            { id: Date.now() + 1, role: 'ai', text: COMING_SOON_MESSAGE },
        ]);
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

            <div
                className="flex h-[calc(100dvh-3.5rem)] min-h-0 flex-col overflow-hidden md:h-[100dvh]"
                style={{ backgroundColor: '#f8f7ff' }}
            >
                <div
                    className="flex min-h-[52px] flex-shrink-0 flex-wrap items-center gap-3 border-b px-4 py-2 sm:px-4"
                    style={{
                        backgroundColor: '#ffffff',
                        borderColor: 'rgba(124,58,237,0.10)',
                    }}
                >
                    <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
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
                        <div className="min-w-0">
                            <p className="m-0 truncate text-sm font-bold leading-tight sm:text-[14px]" style={{ color: '#1a1040' }}>
                                Orin IA
                            </p>
                            <p className="mt-0.5 truncate text-[11px]" style={{ color: '#6b6b8a' }}>
                                Em desenvolvimento
                            </p>
                        </div>
                    </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto py-6 sm:py-8">
                    <div className="mx-auto w-full min-w-0 max-w-[720px] px-4 sm:px-6">
                        {isEmpty && (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: '60vh',
                                    gap: '24px',
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
                                        Em breve voce podera informar um produto e comparar precos das principais lojas por aqui.
                                    </p>
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
                                    </div>
                                </div>
                            ))}

                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                </div>

                <div className="flex-shrink-0 border-t px-4 py-3 sm:px-6" style={{ backgroundColor: '#ffffff', borderColor: 'rgba(124,58,237,0.10)' }}>
                    <div className="mx-auto w-full min-w-0 max-w-[720px]">
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
                                disabled={!input.trim()}
                                style={{
                                    width: '34px',
                                    height: '34px',
                                    borderRadius: '9px',
                                    flexShrink: 0,
                                    border: 'none',
                                    cursor: input.trim() ? 'pointer' : 'not-allowed',
                                    background: input.trim() ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : 'rgba(124,58,237,0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: input.trim() ? '#ffffff' : '#a78bfa',
                                    transition: 'all 0.2s ease',
                                    transform: 'none',
                                }}
                                onMouseEnter={(event) => {
                                    if (input.trim()) {
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
        </AuthenticatedLayout>
    );
}
