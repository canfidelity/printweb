'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  time: string;
  products?: { name: string; price: string; image: string; size: string }[];
}

const quickActions = [
  { label: 'Suggest products', icon: '✨' },
  { label: 'Track my order', icon: '📦' },
  { label: 'Place new order', icon: '🖨️' },
  { label: 'Help & Support', icon: '💬' },
];

const recommendedProducts = [
  { name: '4×6 Print', price: '$0.35', image: '/photo-1.png', size: '4×6' },
  { name: 'Retro 4×6', price: '$0.99', image: '/photo-2.png', size: '4×6 Retro' },
  { name: '5×7 Print', price: '$4.99', image: '/photo-3.png', size: '5×7' },
  { name: '8×10 Print', price: '$6.99', image: '/photo-1.png', size: '8×10' },
];

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Hi there! 👋 I'm your Easy Print assistant. I can help you place orders, track deliveries, and answer any questions. What can I do for you?",
    sender: 'bot',
    time: 'Now',
  },
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const getTimeNow = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const simulateBotReply = (userText: string) => {
    setIsTyping(true);
    const lower = userText.toLowerCase();

    let reply = "Thanks for your message! I'll connect you with the right info. Is there anything specific I can help with?";
    let products: Message['products'] = undefined;

    if (lower.includes('suggest') || lower.includes('recommend') || lower.includes('öner') || lower.includes('product')) {
      reply = "Here are our top picks for you! 🌟 Each one is printed on premium paper with vivid colors:";
      products = recommendedProducts;
    } else if (lower.includes('track') || lower.includes('order') || lower.includes('sipariş')) {
      reply = "Sure! Please share your order number (e.g. #EP-2024-001) and I'll pull up the latest status for you right away. 📋";
    } else if (lower.includes('price') || lower.includes('pricing') || lower.includes('cost') || lower.includes('fiyat')) {
      reply = "Our prints start at just $0.35 for 4×6! Here's a quick breakdown:\n\n• 4×6 — $0.35\n• 5×7 — $4.99\n• 8×10 — $6.99\n• Retro 4×6 — $0.99\n\nWant me to suggest products for you?";
    } else if (lower.includes('place') || lower.includes('new order') || lower.includes('yeni')) {
      reply = "Great! To place an order:\n\n1. Upload your photos\n2. Choose print size\n3. Select pickup store or delivery\n\nWould you like me to guide you through it step by step? 🚀";
    } else if (lower.includes('help') || lower.includes('support') || lower.includes('yardım')) {
      reply = "I'm here to help! You can ask me about:\n\n• Order tracking\n• Print pricing & sizes\n• Product recommendations\n• Pickup locations\n• Delivery times\n\nWhat would you like to know? 😊";
    } else if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey') || lower.includes('merhaba')) {
      reply = "Hey there! 👋 Great to see you! How can I help you today?";
    } else if (lower.includes('delivery') || lower.includes('ship') || lower.includes('kargo')) {
      reply = "We offer two options:\n\n🏪 Store Pickup — Ready in ~1 hour, free!\n🚚 Home Delivery — 2-5 business days, free on orders over $10\n\nWhich do you prefer?";
    }

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: reply,
        sender: 'bot',
        time: getTimeNow(),
        products,
      }]);
    }, 1000 + Math.random() * 800);
  };

  const sendMessage = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;

    setMessages(prev => [...prev, {
      id: Date.now(),
      text: msg,
      sender: 'user',
      time: getTimeNow(),
    }]);
    setInput('');
    simulateBotReply(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Window */}
      <div
        className="fixed bottom-24 right-6 z-50 w-[360px] origin-bottom-right transition-all duration-300"
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(16px)',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        <div className="rounded-2xl bg-white ring-1 ring-gray-200 shadow-2xl overflow-hidden flex flex-col" style={{ height: '520px' }}>

          {/* Header */}
          <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 8V4H8" />
                      <rect width="16" height="12" x="4" y="8" rx="2" />
                      <path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
                    </svg>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Easy Print Assistant</h3>
                  <p className="text-[10px] text-green-600 font-medium">Online — typically replies instantly</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${msg.sender === 'user' ? 'order-1' : 'order-1'}`}>
                  {msg.sender === 'bot' && (
                    <div className="flex items-end gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 8V4H8" />
                          <rect width="16" height="12" x="4" y="8" rx="2" />
                          <path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-gray-100 rounded-2xl rounded-bl-md px-3.5 py-2.5 ring-1 ring-gray-200/50">
                          <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{msg.text}</p>
                        </div>
                        {msg.products && (
                          <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide pb-1">
                            {msg.products.map((p) => (
                              <button
                                key={p.name}
                                onClick={() => sendMessage(`I'd like to order ${p.name}`)}
                                className="flex-shrink-0 w-[120px] rounded-xl ring-1 ring-gray-200 bg-white hover:ring-red-300 hover:shadow-md transition-all duration-200 overflow-hidden group/card"
                              >
                                <div className="h-[72px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-2">
                                  <div className="bg-white p-1 shadow-sm rounded group-hover/card:scale-105 transition-transform duration-200">
                                    <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-sm" />
                                  </div>
                                </div>
                                <div className="px-2 py-2">
                                  <p className="text-[10px] font-semibold text-gray-900 truncate">{p.name}</p>
                                  <div className="flex items-center justify-between mt-0.5">
                                    <span className="text-[9px] text-gray-400">{p.size}</span>
                                    <span className="text-[10px] font-bold text-red-600">{p.price}</span>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                        <p className="text-[9px] text-gray-400 mt-1 ml-1">{msg.time}</p>
                      </div>
                    </div>
                  )}
                  {msg.sender === 'user' && (
                    <div>
                      <div className="bg-red-600 rounded-2xl rounded-br-md px-3.5 py-2.5">
                        <p className="text-xs text-white leading-relaxed whitespace-pre-line">{msg.text}</p>
                      </div>
                      <p className="text-[9px] text-gray-400 mt-1 text-right mr-1">{msg.time}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-end gap-2">
                  <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 8V4H8" />
                      <rect width="16" height="12" x="4" y="8" rx="2" />
                      <path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
                    </svg>
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3 ring-1 ring-gray-200/50">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" style={{ animation: 'chatDotBounce 1.4s ease-in-out infinite' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" style={{ animation: 'chatDotBounce 1.4s ease-in-out 0.2s infinite' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" style={{ animation: 'chatDotBounce 1.4s ease-in-out 0.4s infinite' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions — only show when there's just the initial message */}
            {messages.length === 1 && !isTyping && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => sendMessage(action.label)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ring-1 ring-gray-200 bg-white text-[11px] font-medium text-gray-700 hover:ring-red-300 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    <span>{action.icon}</span>
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 pt-2 pb-4 border-t border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center ring-1 ring-gray-200 rounded-xl bg-gray-50 focus-within:ring-red-300 focus-within:bg-white transition-all duration-200 px-3.5 py-2.5">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-xs text-gray-900 placeholder:text-gray-400 outline-none"
                />
              </div>
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim()}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all duration-200 disabled:opacity-40 disabled:hover:bg-red-600 flex-shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 7-7 7 7" /><path d="M12 19V5" />
                </svg>
              </button>
            </div>
            <p className="text-[9px] text-gray-400 text-center mt-2">Powered by Easy Print AI</p>
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-red-600 text-white shadow-xl hover:bg-red-700 hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center group"
      >
        <div
          className="absolute inset-0 flex items-center justify-center transition-all duration-300"
          style={{
            opacity: isOpen ? 0 : 1,
            transform: isOpen ? 'scale(0.5) rotate(90deg)' : 'scale(1) rotate(0deg)',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          </svg>
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center transition-all duration-300"
          style={{
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(-90deg)',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </div>

        {/* Pulse ring when closed */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-20" />
        )}
      </button>

      {/* Keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes chatDotBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}} />
    </>
  );
}
