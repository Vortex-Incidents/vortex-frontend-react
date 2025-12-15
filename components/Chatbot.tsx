import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Aperture } from 'lucide-react';
import { chatWithIVA } from '../services/geminiService';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: "Greetings. I am the Vortex Assistant. How may I assist you with your incident today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    // Filter history for API context (last 10 messages to save context window)
    const history = messages.slice(-10);
    const reply = await chatWithIVA(history, userMsg);

    setMessages(prev => [...prev, { role: 'model', text: reply }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window */}
      {isOpen && (
        <div className="pointer-events-auto mb-4 w-[calc(100vw-32px)] sm:w-96 h-[450px] sm:h-[500px] bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-700 flex flex-col animate-slide-up overflow-hidden backdrop-blur-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-dark-900 to-dark-800 p-4 flex justify-between items-center text-white border-b border-primary-500/20">
            <div className="flex items-center space-x-2">
              <Aperture size={20} className="text-primary-500 animate-spin-slow" />
              <span className="font-semibold tracking-wide">Vortex Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 rounded-full p-1 transition text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-dark-900/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary-600 text-white rounded-br-none' 
                    : 'bg-white dark:bg-dark-700 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-dark-600 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                 <div className="bg-white dark:bg-dark-700 p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 dark:border-dark-600">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white dark:bg-dark-800 border-t border-gray-100 dark:border-dark-700 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Query Vortex AI..."
              className="flex-1 bg-gray-100 dark:bg-dark-900 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 dark:text-white"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-primary-500/20"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto h-14 w-14 rounded-full bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-900/20 flex items-center justify-center transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-500/30 border border-primary-400/20"
      >
        {isOpen ? <X size={28} /> : <Aperture size={28} />}
      </button>
    </div>
  );
};

export default Chatbot;