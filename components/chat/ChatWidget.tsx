"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ChevronDown,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Namaste! 🙏 I am your **KisanMitra AI Assistant**.\n\nAsk me about live mandi prices, best selling markets, transport costs, or quality grading advice.",
    timestamp: "Just now",
  },
];

const SUGGESTED_QUESTIONS = [
  "🍅 Tomato price in Vijayawada?",
  "🌶️ Guntur Chilli rate today?",
  "⏱️ Should I sell or wait?",
  "⭐ How to get Grade A price?",
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Close on Escape or click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");
      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        role: "assistant",
        content: data.reply || "Sorry, I could not process your request right now.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: "assistant",
        content:
          "⚠️ Unable to reach the assistant service. Please check your network connection or try again.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Quick markdown rendering helper for bold, bullet points, and emoji
  const renderMessageContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      // Process bold markers **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={pIdx} className="font-bold text-[#0E2318]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.startsWith("• ") || line.startsWith("- ")) {
        return (
          <li key={idx} className="ml-4 list-disc my-0.5 text-xs sm:text-sm">
            {formattedLine}
          </li>
        );
      }

      return (
        <p key={idx} className={line.trim() === "" ? "h-2" : "my-1 text-xs sm:text-sm"}>
          {formattedLine}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end print:hidden">
      {/* ─── Floating Chat Panel ─── */}
      {isOpen && (
        <div
          ref={panelRef}
          className={cn(
            "flex flex-col overflow-hidden bg-white shadow-2xl border border-km-neutral-200 transition-all duration-200 ease-out",
            // Desktop: 380px wide, 520px high, rounded card
            // Mobile: full-width bottom sheet
            "w-[94vw] sm:w-[390px] h-[520px] max-h-[85vh] rounded-3xl mb-3 mr-0"
          )}
        >
          {/* Header */}
          <div className="bg-[#0E2318] text-[#F4F1E4] px-5 py-4 flex items-center justify-between border-b border-white/10 shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#D9A441] text-[#0E2318] shadow-sm">
                <Bot className="h-5 w-5" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0E2318]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-fraunces font-bold text-base leading-tight tracking-wide text-[#F4F1E4]">
                    KisanMitra Assistant
                  </h3>
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#D9A441]/20 text-[#D9A441] border border-[#D9A441]/30">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-[#D9D5BE] flex items-center gap-1 mt-0.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live APMC Mandi & Crop Advisor
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-[#D9D5BE] hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-[#F7F6F0]/60 to-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-2.5 max-w-[85%]",
                  msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    msg.role === "user"
                      ? "bg-[#D9A441] text-[#0E2318]"
                      : "bg-[#0E2318] text-[#D9A441]"
                  )}
                >
                  {msg.role === "user" ? (
                    <User className="h-3.5 w-3.5" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs",
                    msg.role === "user"
                      ? "bg-[#0E2318] text-[#F4F1E4] rounded-tr-xs"
                      : "bg-white text-km-neutral-800 border border-km-neutral-200/80 rounded-tl-xs"
                  )}
                >
                  <div className="space-y-1">{renderMessageContent(msg.content)}</div>
                  <div
                    className={cn(
                      "text-[9px] mt-1.5 text-right font-medium",
                      msg.role === "user" ? "text-[#D9D5BE]/70" : "text-km-neutral-400"
                    )}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading typing indicator */}
            {loading && (
              <div className="flex items-start gap-2.5 max-w-[80%] mr-auto">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0E2318] text-[#D9A441]">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div className="rounded-2xl rounded-tl-xs px-4 py-3 bg-white border border-km-neutral-200 shadow-xs flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#D9A441] animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-[#0E2318] animate-bounce [animation-delay:0.2s]" />
                  <span className="h-2 w-2 rounded-full bg-[#4E8F5E] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-km-neutral-400 ml-1 font-medium">
                    Consulting Mandi intelligence...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Questions Chips */}
          <div className="px-3 pt-2 pb-1.5 bg-white border-t border-km-neutral-100 flex gap-1.5 overflow-x-auto no-scrollbar">
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(q)}
                disabled={loading}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-semibold bg-km-neutral-100 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 border border-km-neutral-200 text-km-neutral-700 transition-all cursor-pointer shrink-0 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input & Send Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-km-neutral-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about crop prices, mandis, sell timing..."
              disabled={loading}
              className="flex-1 rounded-xl border border-km-neutral-200 px-3.5 py-2.5 text-xs sm:text-sm text-km-neutral-800 placeholder:text-km-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D9A441] focus:border-transparent bg-km-neutral-50/50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D9A441] text-[#0E2318] hover:bg-[#c49234] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
              aria-label="Send message"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </form>
        </div>
      )}

      {/* ─── Circular Floating Action Button (FAB) ─── */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "group relative flex h-14 w-14 sm:h-15 sm:w-15 items-center justify-center rounded-full shadow-2xl transition-all duration-300 active:scale-95",
          isOpen
            ? "bg-[#0E2318] text-[#D9A441] rotate-90 border-2 border-[#D9A441]"
            : "bg-gradient-to-tr from-[#0E2318] via-[#153424] to-[#0E2318] text-[#F4F1E4] hover:scale-105 border-2 border-[#D9A441]"
        )}
        aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
      >
        {/* Glow effect */}
        <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#D9A441] to-[#7CB342] opacity-40 blur-xs group-hover:opacity-75 transition-opacity" />

        <div className="relative z-10 flex items-center justify-center">
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <div className="relative">
              <MessageSquare className="h-6 w-6 text-[#D9A441]" />
              <Sparkles className="h-3 w-3 text-emerald-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
          )}
        </div>

        {/* Pulse ring when closed */}
        {!isOpen && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#D9A441] opacity-20 animate-ping" />
        )}
      </button>
    </div>
  );
}
