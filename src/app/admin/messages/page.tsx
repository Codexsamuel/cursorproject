'use client';

import { useState, useEffect } from 'react';
import { PrismaClient } from '@prisma/client';

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  service: string;
  status: string;
  createdAt: string;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/messages');
      if (!response.ok) throw new Error('Erreur lors du chargement des messages');
      const data = await response.json();
      setMessages(data.messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour du statut');

      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, status: newStatus } : msg
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Messages de Contact</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des messages */}
          <div className="lg:col-span-2 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-colors ${
                  selectedMessage?.id === message.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{message.subject}</h3>
                    <p className="text-sm text-gray-600">{message.name} - {message.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    message.status === 'new' ? 'bg-blue-100 text-blue-800' :
                    message.status === 'read' ? 'bg-yellow-100 text-yellow-800' :
                    message.status === 'replied' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {message.status === 'new' ? 'Nouveau' :
                     message.status === 'read' ? 'Lu' :
                     message.status === 'replied' ? 'Répondu' :
                     'Archivé'}
                  </span>
                </div>
                <p className="text-gray-600 line-clamp-2">{message.message}</p>
                <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                  <span>{new Date(message.createdAt).toLocaleDateString()}</span>
                  <span className="capitalize">{message.service}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Détails du message sélectionné */}
          {selectedMessage && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">{selectedMessage.subject}</h2>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">De :</span> {selectedMessage.name}</p>
                  <p><span className="font-medium">Email :</span> {selectedMessage.email}</p>
                  <p><span className="font-medium">Téléphone :</span> {selectedMessage.phone}</p>
                  <p><span className="font-medium">Service :</span> {selectedMessage.service}</p>
                  <p><span className="font-medium">Date :</span> {new Date(selectedMessage.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-2">Message :</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    value={selectedMessage.status}
                    onChange={(e) => updateMessageStatus(selectedMessage.id, e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="new">Nouveau</option>
                    <option value="read">Lu</option>
                    <option value="replied">Répondu</option>
                    <option value="archived">Archivé</option>
                  </select>
                </div>

                <div className="flex space-x-4">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-center hover:bg-blue-700 transition-colors"
                  >
                    Répondre
                  </a>
                  <button
                    onClick={() => updateMessageStatus(selectedMessage.id, 'archived')}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Archiver
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 