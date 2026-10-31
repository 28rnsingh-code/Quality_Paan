import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  ExternalLink, 
  HelpCircle, 
  MessageSquare, 
  BookOpen, 
  PhoneCall,
  Flame,
  CheckCircle2,
  FileText,
  ShoppingBag
} from 'lucide-react';
import { searchKnowledgeBase, searchRelevantProducts } from '../../utils/ragEngine';
import { ChatMessage, KnowledgeDocType } from '../../types';

export const ChatbotWidget: React.FC = () => {
  const { 
    chatbotConfig, 
    knowledgeDocs, 
    products, 
    isChatbotOpen, 
    setIsChatbotOpen, 
    setSelectedProduct,
    showToast 
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'bot',
      text: chatbotConfig.welcomeMessage || 'Hello! Welcome to our store. How may I assist you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: chatbotConfig.suggestedQuestions.slice(0, 3),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isChatbotOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setHasUnread(false);
    }
  }, [messages, isChatbotOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isChatbotOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isChatbotOpen]);

  // If chatbot is disabled by admin in config panel
  if (!chatbotConfig.enabled) {
    return null;
  }

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputText).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // 1. RAG STEP: Retrieve relevant knowledge documents using vector/lexical retrieval
      const topK = chatbotConfig.ragTopK || 4;
      const ragResults = searchKnowledgeBase(textToSend, knowledgeDocs, topK);
      
      const retrievedContext = ragResults.map((r) => ({
        id: r.document.id,
        title: r.document.title,
        type: r.document.type,
        category: r.document.category,
        summary: r.document.summary,
        content: r.snippet,
      }));

      // 2. PRODUCT STEP: Search relevant catalog items
      const matchedProds = searchRelevantProducts(textToSend, products, 3);

      // 3. LLM GENERATION: Query server API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: messages.slice(-5),
          retrievedContext,
          matchedProducts: matchedProds.map((p) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: p.price,
            mrp: p.mrp,
            stock: p.stock,
            shortDescription: p.shortDescription,
          })),
          config: chatbotConfig,
        }),
      });

      const data = await response.json();
      const botReply = data.reply || "I am here to assist with our catalog, shipping, or payment questions!";

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: ragResults.length > 0 
          ? ragResults.map((r) => ({
              title: r.document.title,
              type: r.document.type,
              snippet: r.snippet,
            })) 
          : undefined,
        productCards: matchedProds.length > 0
          ? matchedProds.map((p) => ({
              id: p.id,
              name: p.name,
              price: p.price,
              image: (p.images && p.images[0]) || '',
              category: p.category,
            }))
          : undefined,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: "I am having a brief connection delay, but I'm still here! For instant orders or priority questions, feel free to tap WhatsApp support.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: chatbotConfig.welcomeMessage || 'Conversation refreshed. How may I assist you now?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: chatbotConfig.suggestedQuestions.slice(0, 3),
      },
    ]);
    showToast('Chat history cleared', 'info');
  };

  const getDocTypeBadge = (type: KnowledgeDocType) => {
    switch (type) {
      case 'whats_new':
        return <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 font-bold">What's New</span>;
      case 'pdf':
        return <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-500/30 font-bold">PDF Doc</span>;
      case 'image':
        return <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-500/30 font-bold">Image</span>;
      default:
        return <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-950/80 text-sky-400 border border-sky-500/30 font-bold">Guide</span>;
    }
  };

  return (
    <>
      {/* Floating Trigger Bubble */}
      {!isChatbotOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          {/* Pulsing Hint Tooltip on Desktop */}
          <div className="hidden md:flex items-center gap-2 bg-[#14120B]/95 text-[#E5C158] border border-[#D4AF37]/50 shadow-2xl px-3.5 py-2 rounded-2xl text-xs font-royal animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-[#F3D079]" />
            <span>Ask AI: What's New &amp; Catalog?</span>
          </div>

          <button
            type="button"
            onClick={() => setIsChatbotOpen(true)}
            className="group relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#9B7817] via-[#D4AF37] to-[#F3D079] text-black shadow-2xl shadow-[#D4AF37]/40 flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-[#D4AF37]/20"
            aria-label="Open AI Concierge Chatbot"
          >
            <Bot className="w-7 h-7 text-black transition-transform group-hover:rotate-12" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2ECC71] border-2 border-black flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            </span>
          </button>
        </div>
      )}

      {/* Main Chatbot Floating Window */}
      {isChatbotOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-[#0F0E0C] border border-[#D4AF37]/60 shadow-2xl shadow-black/90 rounded-2xl overflow-hidden font-sans ${
            isExpanded
              ? 'inset-4 md:inset-12 w-auto h-auto'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[410px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1E1706] via-[#2A1E06] to-[#14120B] border-b border-[#D4AF37]/40 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#F3D079] text-black flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-black" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#2ECC71] border border-black" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-royal text-sm font-bold text-[#E5C158] leading-tight">
                    {chatbotConfig.botName}
                  </h3>
                  <span className="text-[9px] uppercase px-1.5 py-0.2 rounded-full bg-[#3D2C0C] text-[#F3D079] border border-[#D4AF37]/50 font-bold">
                    RAG + LLM
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 truncate max-w-[200px]">
                  {chatbotConfig.botTitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-gray-400">
              <button
                type="button"
                onClick={handleClearHistory}
                className="p-1.5 rounded-lg hover:text-[#E5C158] hover:bg-[#2A1E06] transition-colors"
                title="Clear conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg hover:text-[#E5C158] hover:bg-[#2A1E06] transition-colors hidden sm:block"
                title={isExpanded ? 'Minimize' : 'Maximize'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsChatbotOpen(false)}
                className="p-1.5 rounded-lg hover:text-white hover:bg-rose-900/40 transition-colors"
                title="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Subheader: RAG Status & Quick What's New Alert */}
          <div className="bg-[#18140B] px-3.5 py-2 border-b border-[#2A200B] flex items-center justify-between text-[11px] text-[#A89050]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Grounded in {knowledgeDocs.filter(d => d.active).length} store documents</span>
            </div>
            <a
              href={`https://wa.me/${chatbotConfig.whatsappSupportNumber.replace(/\D/g, '')}?text=Hi%2C%20I%20have%20an%20inquiry%20from%20the%20store`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#2ECC71] hover:underline"
            >
              <PhoneCall className="w-3 h-3" />
              <span>WhatsApp Live</span>
            </a>
          </div>

          {/* Conversation Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#0F0E0C] via-[#12100C] to-[#0A0A0A]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-lg ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#C59B27] to-[#D4AF37] text-black font-medium rounded-br-none'
                      : 'bg-[#1C1810] text-[#E5E5E5] border border-[#3A2E14] rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Sources / Verified Reference Badges */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-[#332810]">
                      <div className="text-[10px] text-[#D4AF37] font-semibold mb-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#2ECC71]" />
                        <span>Sources &amp; Verified Policies:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((src, i) => (
                          <div
                            key={i}
                            className="bg-[#120F08] border border-[#443312] rounded-lg px-2 py-1 flex items-center gap-1.5 text-[10px] text-gray-300"
                            title={src.snippet}
                          >
                            {getDocTypeBadge(src.type)}
                            <span className="truncate max-w-[150px] font-medium text-gray-200">
                              {src.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Product Recommendation Cards (if matched) */}
                  {msg.productCards && msg.productCards.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-[#332810]">
                      <div className="text-[10px] text-[#E5C158] font-bold mb-2 flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3 text-[#D4AF37]" />
                        <span>Recommended Products:</span>
                      </div>
                      <div className="grid grid-cols-1 gap-1.5">
                        {msg.productCards.map((p) => {
                          const fullProd = products.find((prod) => prod.id === p.id);
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => fullProd && setSelectedProduct(fullProd)}
                              className="text-left w-full flex items-center gap-2 p-1.5 rounded-xl bg-[#251E0E] hover:bg-[#322812] border border-[#D4AF37]/40 transition-all cursor-pointer group"
                            >
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-9 h-9 rounded-lg object-cover border border-[#443312]"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-gray-100 group-hover:text-[#E5C158] truncate">
                                  {p.name}
                                </div>
                                <div className="text-[10px] text-[#D4AF37] font-bold">
                                  ₹{p.price}
                                </div>
                              </div>
                              <span className="text-[10px] text-gray-400 group-hover:text-white px-2 py-1 rounded bg-[#17130A]">
                                View &gt;
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <span
                    className={`block text-[9px] mt-1.5 ${
                      msg.sender === 'user' ? 'text-black/60 text-right' : 'text-gray-500'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {/* Suggested Follow-up Questions / Pills */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
                    {msg.suggestedActions.map((sug, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(sug)}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-[#1C170B] hover:bg-[#2B220F] text-[#E5C158] border border-[#D4AF37]/40 transition-all text-left shadow-sm active:scale-95 cursor-pointer"
                      >
                        ⚡ {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing / Retrieval Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[#D4AF37] bg-[#1C1810] border border-[#3A2E14] px-3.5 py-2.5 rounded-2xl rounded-bl-none w-fit shadow-md">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-[#F3D079]" />
                <span className="animate-pulse">Retrieving verified knowledge &amp; composing answer...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Starter Questions Bar */}
          {messages.length <= 2 && chatbotConfig.suggestedQuestions.length > 0 && (
            <div className="px-3 py-2 bg-[#141008] border-t border-[#261E0D] overflow-x-auto flex gap-1.5 no-scrollbar flex-shrink-0">
              {chatbotConfig.suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(q)}
                  className="whitespace-nowrap text-[10px] px-2.5 py-1 rounded-lg bg-[#221C0E] hover:bg-[#302613] text-[#E5C158] border border-[#4D3A13] transition-all cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#16120A] border-t border-[#D4AF37]/40 flex items-center gap-2 flex-shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about products, flavours, delivery, what's new..."
              className="flex-1 bg-[#0D0B07] text-gray-100 text-xs px-3.5 py-2.5 rounded-xl border border-[#382C10] focus:border-[#D4AF37] focus:outline-none placeholder-gray-500"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 rounded-xl bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#B38C1B] text-black font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
