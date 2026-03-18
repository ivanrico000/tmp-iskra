"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ChatContextType {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <ChatContext.Provider value={{ open, setOpen }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat debe usarse dentro de ChatProvider");
  return context;
}
