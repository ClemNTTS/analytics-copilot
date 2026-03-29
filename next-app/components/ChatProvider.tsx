"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Message {
  role: "user" | "assistant";
  content: string;
  sql?: string;
  data?: any[];
  chartConfig?: {
    type: "bar" | "line" | "pie";
    xAxis: string;
    yAxis: string;
    label?: string;
  };
  error?: boolean;
}

interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Bonjour ! Je suis votre assistant analytique. Posez-moi une question sur les **clients**, les **abonnements** ou les **factures** de la base de demonstration.",
    },
  ]);
  const [input, setInput] = useState("");

  return (
    <ChatContext.Provider value={{ messages, setMessages, input, setInput }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);

  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }

  return context;
}
