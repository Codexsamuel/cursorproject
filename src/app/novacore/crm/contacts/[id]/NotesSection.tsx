'use client';

import { useState } from 'react';
import { Note } from '@/lib/types/crm';
import AddNoteModal from '@/components/modals/AddNoteModal';

interface NotesSectionProps {
  notes: Note[];
  onAddNote: (content: string) => Promise<void>;
}

export default function NotesSection({ notes, onAddNote }: NotesSectionProps) {
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Notes</h2>
            <button
              onClick={() => setIsAddNoteModalOpen(true)}
              className="text-sm text-primary hover:text-primary/80"
            >
              + Ajouter une note
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div key={note.id} className="px-6 py-4">
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {note.content}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(note.created_at).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <div className="px-6 py-4">
              <p className="text-sm text-gray-500">Aucune note</p>
            </div>
          )}
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