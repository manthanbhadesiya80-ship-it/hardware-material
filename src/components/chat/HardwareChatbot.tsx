import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';
import { Product } from '../../types';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShoppingBag,
  ArrowRight,
  Phone,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  recommendedProducts?: Product[];
  timestamp: string;
}

export const HardwareChatbot: React.FC = () => {
  const { settings, setCurrentPage, addToCart } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-1',
          sender: 'bot',
          text: settings.chatbotWelcomeMsg ||
            'Namaste! Welcome to Devshree - The Hardware Gallery. How can I help with your furniture or construction project today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [settings.chatbotWelcomeMsg]);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  if (!settings.chatbotEnabled) return null;

  const quickPrompts = [
    '🛏️ Recommend Bed Hydraulic Lift',
    '🚪 Soft-Close Cabinet Hinges',
    '🔒 Secure Main Door Locks',
    '🏗️ Bulk Contractor Pricing',
    '🚚 Shipping Time & Delivery'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await api.sendChatMessage(
        text,
        messages.slice(-4).map(m => ({ role: m.sender === 'user' ? 'user' : 'model', text: m.text }))
      );

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: response.reply,
        recommendedProducts: response.recommendedProducts,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'I am always available to help! For instant personalized recommendations or wholesale trade inquiries, you can also reach our Rajkot hotline at +91 81280 40556.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 bg-gradient-to-r from-[#124DA6] to-[#083B82] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:shadow-blue-900/30 flex items-center gap-2.5 transition-all transform hover:scale-105 group"
          aria-label="Ask Devshree AI Shopping Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#F28C00] rounded-full ring-2 ring-white animate-pulse" />
          </div>
          <span className="hidden sm:inline text-xs font-bold tracking-wide">
            Hardware Assistant
          </span>
        </button>
      )}

      {/* Chat Window Dialog */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-50 w-[94vw] sm:w-[420px] h-[560px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#083B82] text-white p-3.5 flex items-center justify-between border-b border-blue-900">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#124DA6] border border-blue-300/30 flex items-center justify-center text-amber-300">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold flex items-center gap-1.5">
                  <span>Devshree Hardware AI</span>
                  <span className="bg-[#E87500] text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                    Live
                  </span>
                </h3>
                <p className="text-[10px] text-blue-200">Expert Product Consultant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: 'welcome-' + Date.now(),
                      sender: 'bot',
                      text: settings.chatbotWelcomeMsg,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ])
                }
                title="Restart Chat"
                className="p-1.5 text-blue-200 hover:text-white hover:bg-blue-800/50 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-blue-200 hover:text-white hover:bg-blue-800/50 rounded-lg transition-colors"
                aria-label="Close Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#F7F9FC]">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-[#124DA6] text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    D
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#124DA6] text-white rounded-br-none shadow-xs'
                      : 'bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Render Visual Recommended Product Cards inside chat */}
                  {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Suggested Hardware:
                      </p>
                      {msg.recommendedProducts.map(prod => (
                        <div
                          key={prod.id}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex items-center gap-2 hover:bg-blue-50/50 transition-colors"
                        >
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-10 h-10 rounded object-cover border border-gray-200 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-[11px] font-bold text-gray-900 truncate">{prod.name}</h5>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] font-extrabold text-[#083B82]">₹{prod.price}</span>
                              <span className="text-[9px] text-gray-400 line-through">₹{prod.mrp}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              addToCart(prod, 1);
                            }}
                            title="Add to Cart"
                            className="bg-[#124DA6] hover:bg-[#083B82] text-white text-[10px] font-bold p-1.5 rounded flex items-center gap-1 shrink-0"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2.5 items-center">
                <div className="w-6 h-6 rounded-full bg-[#124DA6] text-white flex items-center justify-center shrink-0 text-xs">
                  D
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none p-3 shadow-2xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#124DA6] rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-[#124DA6] rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-[#124DA6] rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Chips */}
          <div className="p-2 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto text-[11px] whitespace-nowrap">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="bg-gray-100 hover:bg-blue-50 hover:text-[#124DA6] hover:border-[#124DA6]/40 border border-gray-200 text-gray-700 font-medium px-2.5 py-1 rounded-full shrink-0 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-gray-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder="Ask about bed fittings, hinges, screws..."
              className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-hidden focus:border-[#124DA6] focus:ring-1 focus:ring-[#124DA6]"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className={`p-2 rounded-xl transition-all ${
                inputMessage.trim() && !isTyping
                  ? 'bg-[#124DA6] text-white hover:bg-[#083B82] shadow-xs'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
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
