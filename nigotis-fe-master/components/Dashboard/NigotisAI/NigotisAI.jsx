"use client";

import { marked } from "marked";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  SendHorizonal,
  Sparkles,
  History,
  Copy,
  Check,
  Loader2,
  User2,
  TrendingUp,
  ShoppingBag,
  Wallet,
  Target,
  Award,
  Eye,
  Lightbulb,
} from "lucide-react";
import { PrevChats } from "./PrevChats";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Image from "next/image";
import useUser from "@/hooks/useUser";
import { createNewSession } from "@/lib/chatbot";
import { useCompany } from "@/contexts/company";

export default function NigotisAI() {
  const [inputValue, setInputValue] = useState("");
  const [showPreviousChats, setShowPreviousChats] = useState(false);
  const [isNewChat, setIsNewChat] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChat, setCurrentChat] = useState([]);
  const [showIntro, setShowIntro] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const { user, setUser } = useUser();
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const { company } = useCompany();
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (user?.currentSessionId !== null && currentSessionId === null) {
      setCurrentSessionId(user.currentSessionId);
      setIsNewChat(false);
    }
    if (currentSessionId && !isNewChat) {
      getSessionChat();
    }
  }, [currentSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 180) + "px";
  }, [inputValue]);

  async function getSessionChat() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: `/session/${currentSessionId}/messages`,
          options: { method: "GET" },
        }),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setCurrentChat(data?.data.reverse());
      setIsNewChat(false);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const suggestions = [
    {
      id: 1,
      text: "Analyze my business performance",
      icon: TrendingUp,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      text: "How can I get more sales from current inventory?",
      icon: ShoppingBag,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      text: "Help me manage my expenses",
      icon: Wallet,
      gradient: "from-amber-500 to-orange-500",
    },
    {
      id: 4,
      text: "Suggest a marketing strategy for my business",
      icon: Target,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      id: 5,
      text: "Which products had record sales last month?",
      icon: Award,
      gradient: "from-rose-500 to-red-500",
    },
    {
      id: 6,
      text: "Which products in my inventory need attention?",
      icon: Eye,
      gradient: "from-indigo-500 to-blue-500",
    },
  ];

  const quickQuestions = [
    "How can I track employee performance?",
    "What's my current cash flow status?",
    "Generate monthly financial report",
    "Analyze my customer payment trends",
  ];

  const handleSuggestionClick = (text) => {
    setInputValue(text);
    textareaRef.current?.focus();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    let sessionId = currentSessionId;

    if (showIntro) {
      setShowIntro(false);
      setIsNewChat(true);
    } else {
      setIsNewChat(false);
    }

    const userMessage = { sender: "USER", content: inputValue };
    setCurrentChat((prev) => [...prev, userMessage]);
    setInputValue("");

    setIsLoading(true);
    if (!currentSessionId) {
      const sessionData = await createNewSession(user?.botClientId);
      setCurrentSessionId(sessionData?.id);
      sessionId = sessionData?.id;
      setUser({ ...user, currentSessionId: sessionData?.id });
    }

    try {
      const timeout = 5 * 60000;
      const fetchWithTimeout = async (url, options = {}) =>
        Promise.race([
          fetch(url, options),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timed out")), timeout)
          ),
        ]);

      const response = await fetchWithTimeout(
        `${process.env.NEXT_PUBLIC_BOT_API_URL}/talk-to-bot/${sessionId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage.content }),
        }
      );

      if (!response.ok) throw new Error("Failed to get response from AI");

      const data = await response.json();
      const botMessage = {
        sender: "BOT",
        content: data?.message || "I'm sorry, I couldn't process your request.",
      };
      setCurrentChat((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setCurrentChat((prev) => [
        ...prev,
        {
          sender: "BOT",
          content:
            "Sorry, I encountered an error. Please try again with a new chat.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const startNewChat = () => {
    setCurrentChat([]);
    setCurrentSessionId(null);
    setShowIntro(true);
    setIsNewChat(true);
    setUser({ ...user, currentSessionId: null });
  };

  const loadChatSession = async (selectedSessionId) => {
    if (selectedSessionId === currentSessionId) {
      setShowPreviousChats(false);
      return;
    }
    setShowIntro(true);
    setIsNewChat(false);
    setCurrentChat([]);
    setCurrentSessionId(selectedSessionId);
    setUser({ ...user, currentSessionId: selectedSessionId });
    setShowPreviousChats(false);
  };

  const greetingName =
    user?.personalInfo?.firstName || user?.email?.split("@")[0] || "there";

  return (
    <div className="w-full h-[calc(100vh-7rem)] flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#003B6D] to-[#26B9B3] flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-semibold text-gray-900 leading-none">
              Nigotis AI
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Your intelligent business assistant
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreviousChats(true)}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-9"
          >
            <History className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">History</span>
          </Button>
          <Button
            size="sm"
            onClick={startNewChat}
            className="h-9 bg-gradient-to-r from-[#003B6D] to-[#26B9B3] hover:opacity-90 text-white shadow-sm"
          >
            <PlusCircle className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">New chat</span>
          </Button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-hidden relative">
        {showIntro && currentChat.length === 0 && !isLoading ? (
          /* ── Empty state / Welcome ── */
          <ScrollArea className="h-full">
            <div className="w-full px-4 md:px-10 lg:px-16 xl:px-24 py-10 md:py-14">
              {/* Hero */}
              <div className="text-center mb-10 space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#003B6D] to-[#26B9B3] shadow-lg shadow-[#26B9B3]/20">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                  Hello, <span className="bg-gradient-to-r from-[#003B6D] to-[#26B9B3] bg-clip-text text-transparent">{greetingName}</span>
                </h2>
                <p className="text-gray-500 text-base max-w-md mx-auto">
                  Ask anything about your business. Insights, strategy, and answers — guided by AI.
                </p>
              </div>

              {/* Suggestion cards */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4 px-1">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Try asking
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {suggestions.map((s) => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.id}
                        onClick={() => handleSuggestionClick(s.text)}
                        className="group flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#26B9B3]/50 hover:shadow-md transition-all text-left"
                      >
                        <div className={cn(
                          "w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0 shadow-sm",
                          s.gradient
                        )}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 leading-snug pt-1">
                          {s.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </ScrollArea>
        ) : (
          /* ── Chat messages ── */
          <ScrollArea className="h-full">
            <div className="w-full px-4 md:px-10 lg:px-16 xl:px-24 py-6 space-y-6">
              {currentChat.map((message, index) => {
                const isBot = message.sender === "BOT";
                return (
                  <div
                    key={index}
                    className={cn(
                      "flex gap-3",
                      isBot ? "flex-row" : "flex-row-reverse"
                    )}
                  >
                    {/* Avatar */}
                    <div className="shrink-0">
                      {isBot ? (
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#003B6D] to-[#26B9B3] flex items-center justify-center shadow-sm">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                      ) : user?.personalInfo?.avatar ? (
                        <Image
                          width={36}
                          height={36}
                          src={
                            user?.provider !== "local"
                              ? user?.personalInfo?.avatar
                              : `${process.env.NEXT_PUBLIC_AWS_OBJECT_BASE_URL}${user?.personalInfo?.avatar}`
                          }
                          alt="You"
                          className="w-9 h-9 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-gray-200 flex items-center justify-center">
                          <User2 className="w-4 h-4 text-gray-600" />
                        </div>
                      )}
                    </div>

                    {/* Bubble */}
                    <div className={cn("flex-1 min-w-0 max-w-[85%]", isBot ? "" : "flex flex-col items-end")}>
                      <div className="flex items-center gap-2 mb-1.5 px-1">
                        <span className="text-xs font-semibold text-gray-700">
                          {isBot
                            ? "Nigotis AI"
                            : [user?.personalInfo?.title, user?.personalInfo?.firstName]
                                .filter(Boolean)
                                .join(" ") || "You"}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "relative group rounded-2xl px-4 py-3 text-sm leading-relaxed",
                          isBot
                            ? "bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm"
                            : "bg-gradient-to-br from-[#003B6D] to-[#26B9B3] text-white rounded-tr-sm shadow-md shadow-[#26B9B3]/20"
                        )}
                      >
                        <div className={cn("prose-sm max-w-none break-words", isBot ? "prose" : "")}>
                          <ChatMessage message={message.content} isBot={isBot} />
                        </div>
                        <button
                          onClick={() => copyToClipboard(message.content, index)}
                          className={cn(
                            "absolute -bottom-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md bg-white border border-gray-200 shadow-sm hover:bg-gray-50",
                            isBot ? "right-2" : "left-2"
                          )}
                          title="Copy"
                        >
                          {copiedIndex === index ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#003B6D] to-[#26B9B3] flex items-center justify-center shadow-sm shrink-0">
                    <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <div className="flex-1 max-w-[85%]">
                    <div className="flex items-center gap-2 mb-1.5 px-1">
                      <span className="text-xs font-semibold text-gray-700">Nigotis AI</span>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}
      </div>

      {/* ── Composer ── */}
      <div className="border-t border-gray-100 bg-white/80 backdrop-blur-md px-4 md:px-10 lg:px-16 xl:px-24 py-4">
        <div className="w-full">
          {!isLoading && currentChat.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(question)}
                  disabled={isLoading}
                  className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors disabled:opacity-50"
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="relative flex items-end bg-white rounded-2xl border border-gray-200 shadow-sm focus-within:border-[#26B9B3] focus-within:ring-2 focus-within:ring-[#26B9B3]/20 transition-all">
              <textarea
                ref={textareaRef}
                placeholder="Ask Nigotis AI anything…"
                rows={1}
                className="flex-1 resize-none outline-none bg-transparent px-4 py-3.5 text-sm placeholder:text-gray-400 max-h-44"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className={cn(
                  "m-2 h-9 w-9 rounded-xl flex items-center justify-center transition-all shrink-0",
                  inputValue.trim() && !isLoading
                    ? "bg-gradient-to-br from-[#003B6D] to-[#26B9B3] text-white shadow-md hover:shadow-lg shadow-[#26B9B3]/30"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <SendHorizonal className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-gray-400 text-center mt-2">
              Press <kbd className="px-1 py-0.5 rounded bg-gray-100 border border-gray-200 text-[10px] font-medium">Enter</kbd> to send · <kbd className="px-1 py-0.5 rounded bg-gray-100 border border-gray-200 text-[10px] font-medium">Shift + Enter</kbd> for new line
            </p>
          </form>
        </div>
      </div>

      {showPreviousChats && (
        <PrevChats
          clientId={user?.botClientId}
          open={showPreviousChats}
          onOpenChange={setShowPreviousChats}
          onSelectSession={loadChatSession}
          currentSessionId={currentSessionId}
        />
      )}
    </div>
  );
}

function ChatMessage({ message, isBot }) {
  return (
    <div
      className={cn(
        "[&>p]:my-1 [&>ul]:my-2 [&>ol]:my-2 [&>h1]:font-semibold [&>h2]:font-semibold [&>h3]:font-semibold [&_a]:underline",
        isBot ? "[&_a]:text-[#26B9B3]" : "[&_a]:text-white/90"
      )}
      dangerouslySetInnerHTML={{ __html: marked.parse(message) }}
    />
  );
}
