'use client';

import { useState } from 'react';
import AddNoteModal from '@/components/modals/AddNoteModal';

interface ContactActionsProps {
  contactId: string;
  onAddNote: (content: string) => Promise<void>;
}

export default function ContactActions({ contactId, onAddNote }: ContactActionsProps) {
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Actions rapides</h2>
        </div>
        <div className="px-6 py-5 space-y-4">
          <button className="btn-secondary w-full justify-center">
            Envoyer un email
          </button>
          <button className="btn-secondary w-full justify-center">
            Planifier un appel
          </button>
          <button
            onClick={() => setIsAddNoteModalOpen(true)}
            className="btn-secondary w-full justify-center"
          >
            Ajouter une note
          </button>
          <button className="btn-secondary w-full justify-center">
            Créer une opportunité
          </button>
        </div>
      </div>

      <AddNoteModal
        isOpen={isAddNoteModalOpen}
        onClose={() => setIsAddNoteModalOpen(false)}
        onSubmit={onAddNote}
      />
    </>
  );
} 