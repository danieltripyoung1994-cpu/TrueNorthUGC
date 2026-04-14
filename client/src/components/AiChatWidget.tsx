import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Loader2, RotateCcw, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import { useMyCreatorProfile } from "@/hooks/use-creators";
import { useBrand } from "@/hooks/use-brand";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const CREATOR_PROMPTS = [
  "How do I set my rate card?",
  "How do I get found by brands?",
  "What goes in my portfolio?",
  "How does payment work?",
  "How do contest deals work?",
];

const BRAND_PROMPTS = [
  "How do I post a campaign?",
  "What are the pricing plans?",
  "How do I find the right creator?",
  "What is a CPM deal?",
  "How does the contest deal type work?",
];

const GENERAL_PROMPTS = [
  "How do I get started?",
  "Tell me about pricing",
  "How does payment work?",
  "What is a UGC creator?",
  "How do I contact support?",
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.18,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = (key: string) => {
    if (listBuffer.length > 0) {
      elements.push(
        <ul key={key} className="list-disc list-inside space-y-0.5 ml-1 text-sm">
          {listBuffer.map((item, i) => (
            <li key={i} className="text-foreground/85">{renderInline(item)}</li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.match(/^\d+\.\s/)) {
      listBuffer.push(trimmed.replace(/^[-*]\s|^\d+\.\s/, ""));
    } else {
      flushList(`list-${idx}`);
      if (trimmed === "") {
        elements.push(<div key={`space-${idx}`} className="h-1" />);
      } else if (trimmed.startsWith("### ")) {
        elements.push(<p key={idx} className="font-semibold text-sm text-foreground/90 mt-1">{renderInline(trimmed.slice(4))}</p>);
      } else if (trimmed.startsWith("## ")) {
        elements.push(<p key={idx} className="font-bold text-sm mt-1">{renderInline(trimmed.slice(3))}</p>);
      } else {
        elements.push(<p key={idx} className="text-sm leading-relaxed">{renderInline(trimmed)}</p>);
      }
    }
  });
  flushList("list-end");
  return <div className="space-y-1">{elements}</div>;
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i} className="bg-white/10 rounded px-1 text-xs font-mono">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { user } = useAuth();
  const { data: creatorProfile } = useMyCreatorProfile();
  const { brand: brandProfile } = useBrand();

  const role = creatorProfile ? "creator" : brandProfile ? "brand" : "general";
  const suggestions = role === "creator" ? CREATOR_PROMPTS : role === "brand" ? BRAND_PROMPTS : GENERAL_PROMPTS;

  const scrollToBottom = useCallback((smooth = true) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (atBottom) scrollToBottom();
    else setShowScrollDown(true);
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 120);
    }
  }, [isOpen]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowScrollDown(el.scrollHeight - el.scrollTop - el.clientHeight > 60);
  };

  const createConversation = async () => {
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Mercedes Chat" }),
      credentials: "include",
    });
    const data = await res.json();
    return data.id;
  };

  const sendMessage = async (text?: string) => {
    const userMessage = (text ?? input).trim();
    if (!userMessage || isLoading) return;
    setInput("");

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: userMessage };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      let convId = conversationId;
      if (!convId) {
        convId = await createConversation();
        setConversationId(convId);
      }

      const res = await fetch(`/api/conversations/${convId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userMessage }),
        credentials: "include",
      });

      const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: "" };
      setMessages((prev) => [...prev, assistantMsg]);

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          for (const line of chunk.split("\n")) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  setMessages((prev) => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    if (last.role === "assistant") last.content += data.content;
                    return [...updated];
                  });
                }
              } catch {}
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again!" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetConversation = () => {
    setMessages([]);
    setConversationId(null);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const roleLabel = role === "creator" ? "Creator" : role === "brand" ? "Brand" : null;
  const roleBadgeClass = role === "creator"
    ? "bg-pink-500/15 text-pink-400 border-pink-500/20"
    : role === "brand"
    ? "bg-purple-500/15 text-purple-400 border-purple-500/20"
    : "";

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            className="fixed bottom-24 right-4 z-50 w-[400px] max-w-[calc(100vw-1.5rem)] rounded-2xl border border-white/10 bg-card/97 backdrop-blur-2xl shadow-2xl shadow-black/40 overflow-hidden"
            data-testid="chat-widget-panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-pink-500/20">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card" />
                </div>
                <div className="flex items-center gap-2">
                  <div>
                    <h3 className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 leading-none">
                      Mercedes
                    </h3>
                    <p className="text-xs text-muted-foreground leading-none mt-0.5">AI Assistant · Online</p>
                  </div>
                  {roleLabel && (
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${roleBadgeClass}`}>
                      {roleLabel}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={resetConversation}
                    className="h-7 w-7 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground"
                    title="New conversation"
                    data-testid="button-new-chat"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-7 w-7 rounded-full hover:bg-white/10"
                  data-testid="button-close-chat"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="relative">
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="h-[360px] overflow-y-auto px-4 py-4 space-y-3 scroll-smooth"
                style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
              >
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center h-full text-center px-2 pt-4"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center mb-4"
                    >
                      <Sparkles className="w-7 h-7 text-pink-400" />
                    </motion.div>
                    <h4 className="font-bold text-base mb-1 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">
                      Hey{user?.firstName ? `, ${user.firstName}` : ""}! I'm Mercedes
                    </h4>
                    <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                      {role === "creator"
                        ? "Your creator success guide — from rate cards to landing brand deals."
                        : role === "brand"
                        ? "Your brand growth partner — from finding creators to launching campaigns."
                        : "Your TrueNorthUGC assistant. Ask me anything to get started."}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center w-full">
                      {suggestions.map((prompt) => (
                        <motion.button
                          key={prompt}
                          whileHover={{ scale: 1.03, y: -1 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => sendMessage(prompt)}
                          className="px-3 py-1.5 text-xs rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/40 text-muted-foreground hover:text-foreground transition-all duration-200"
                          data-testid={`button-suggestion-${prompt.slice(0, 20).replace(/\s+/g, '-').toLowerCase()}`}
                        >
                          {prompt}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {messages.map((msg, idx) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}
                      >
                        {msg.role === "assistant" && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center flex-shrink-0 mb-0.5">
                            <Sparkles className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <div
                          className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 ${
                            msg.role === "user"
                              ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-br-sm"
                              : "bg-white/6 border border-white/10 rounded-bl-sm"
                          }`}
                          data-testid={`chat-message-${msg.role}-${idx}`}
                        >
                          {msg.role === "assistant" && !msg.content && isLoading && idx === messages.length - 1 ? (
                            <TypingDots />
                          ) : msg.role === "assistant" ? (
                            renderMarkdown(msg.content)
                          ) : (
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </>
                )}
              </div>

              <AnimatePresence>
                {showScrollDown && messages.length > 0 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => { scrollToBottom(); setShowScrollDown(false); }}
                    className="absolute bottom-2 right-3 w-7 h-7 rounded-full bg-card border border-white/20 flex items-center justify-center shadow-lg hover:bg-white/10 transition-colors"
                  >
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-white/10 bg-background/40">
              <div className="flex gap-2 items-end">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything… (Enter to send)"
                  className="flex-1 bg-white/5 border-white/10 focus:border-pink-500/50 rounded-xl resize-none min-h-[40px] max-h-[120px] text-sm py-2.5 leading-relaxed placeholder:text-muted-foreground/50"
                  rows={1}
                  disabled={isLoading}
                  data-testid="input-chat-message"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-pink-500/25 transition-shadow"
                  data-testid="button-send-message"
                >
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5 text-white" />
                  )}
                </motion.button>
              </div>
              <p className="text-[10px] text-muted-foreground/50 mt-1.5 text-center">
                Shift+Enter for new line · Powered by Mercedes AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 shadow-lg shadow-pink-500/30 flex items-center justify-center"
        whileHover={{ scale: 1.08, boxShadow: "0 0 32px rgba(236,72,153,0.5)" }}
        whileTap={{ scale: 0.92 }}
        animate={{ boxShadow: isOpen ? "0 0 0px rgba(0,0,0,0)" : ["0 0 0px rgba(236,72,153,0)", "0 0 20px rgba(236,72,153,0.4)", "0 0 0px rgba(236,72,153,0)"] }}
        transition={{ boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut" } }}
        data-testid="button-open-chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="relative"
            >
              <MessageCircle className="w-6 h-6 text-white" />
              <motion.div
                className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
