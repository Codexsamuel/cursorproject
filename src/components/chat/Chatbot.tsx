'use client';

import { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{text: string; isUser: boolean}>>([
    { text: "Bonjour ! Je suis l'assistant virtuel de Dave & Luce Solutions. Comment puis-je vous aider aujourd'hui ?", isUser: false }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Ajouter le message de l'utilisateur
    setMessages(prev => [...prev, { text: message, isUser: true }]);
    setMessage('');

    // Simuler une réponse (à remplacer par une vraie API)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.",
        isUser: false
      }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-96 h-[500px] flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Chat avec nous</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:text-gray-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tapez votre message..."
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 