import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const ChatSidebarContext = createContext(null);

export const chatHistoryItems = [
    { id: 1, title: 'Notebook para escritorio', date: 'Hoje' },
    { id: 2, title: 'iPhone 15 vs Samsung S24', date: 'Ontem' },
    { id: 3, title: 'Monitor gamer 144Hz', date: '19/05' },
    { id: 4, title: 'SSD Kingston 480GB', date: '15/05' },
    { id: 5, title: 'Teclado mecanico barato', date: '12/05' },
];

export function ChatSidebarProvider({ children }) {
    const [activeChat, setActiveChat] = useState(null);
    const startNewChatRef = useRef(() => {});

    const registerStartNewChat = useCallback((handler) => {
        startNewChatRef.current = handler;
    }, []);

    const startNewChat = useCallback(() => {
        startNewChatRef.current?.();
        setActiveChat(null);
    }, []);

    const value = useMemo(
        () => ({
            activeChat,
            setActiveChat,
            startNewChat,
            registerStartNewChat,
        }),
        [activeChat, startNewChat, registerStartNewChat],
    );

    return <ChatSidebarContext.Provider value={value}>{children}</ChatSidebarContext.Provider>;
}

export function useChatSidebar() {
    const context = useContext(ChatSidebarContext);

    if (!context) {
        throw new Error('useChatSidebar must be used within ChatSidebarProvider');
    }

    return context;
}

export function useChatSidebarOptional() {
    return useContext(ChatSidebarContext);
}
