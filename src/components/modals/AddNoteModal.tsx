import { useState } from 'react';
import { Dialog } from '@headlessui/react';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: string) => Promise<void>;
}

export default function AddNoteModal({ isOpen, onClose, onSubmit }: AddNoteModalProps) {
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(note);
      setNote('');
      onClose();
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex min-h-screen items-center justify-center">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg w-full max-w-md mx-4 p-6">
          <Dialog.Title className="text-lg font-medium text-gray-900">
            Ajouter une note
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="note"
                  className="block text-sm font-medium text-gray-700"
                >
                  Note
                </label>
                <textarea
                  id="note"
                  name="note"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  placeholder="Saisissez votre note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
} 