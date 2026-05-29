import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const ChatSidebarContext = createContext(null);

export const chatHistoryItems = [];

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
