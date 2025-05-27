'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { bulkUpdateContacts, bulkDeleteContacts, exportContacts, type ContactFilters } from '../actions';
import { Contact } from '@/lib/types/crm';

interface BulkActionsProps {
  selectedContacts: string[];
  filters: ContactFilters;
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

export default function BulkActions({
  selectedContacts,
  filters,
  onSuccess,
  onError,
}: BulkActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [isExporting, setIsExporting] = useState(false);
  const router = useRouter();

  const handleBulkUpdate = async (updates: Partial<Contact>) => {
    try {
      const result = await bulkUpdateContacts(selectedContacts, updates);
      onSuccess?.(result.message);
      router.refresh();
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedContacts.length} contact(s) ?`)) {
      return;
    }

    try {
      const result = await bulkDeleteContacts(selectedContacts);
      onSuccess?.(result.message);
      router.refresh();
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    setIsExporting(true);
    try {
      const result = await exportContacts(filters, format);
      
      // Créer un blob et télécharger le fichier
      const blob = new Blob([result.data], { type: result.contentType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      onSuccess?.(`Export ${format.toUpperCase()} réussi`);
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  };

  if (selectedContacts.length === 0) {
    return (
      <div className="flex space-x-2">
        <button
          onClick={() => handleExport('csv')}
          disabled={isExporting}
          className="btn-secondary"
        >
          {isExporting ? 'Export en cours...' : 'Exporter CSV'}
        </button>
        <button
          onClick={() => handleExport('json')}
          disabled={isExporting}
          className="btn-secondary"
        >
          {isExporting ? 'Export en cours...' : 'Exporter JSON'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
      <span className="text-sm text-gray-700">
        {selectedContacts.length} contact(s) sélectionné(s)
      </span>
      
      <div className="flex space-x-2">
        <select
          className="input-field"
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'delete') {
              handleBulkDelete();
            } else if (value) {
              handleBulkUpdate({ status: value });
            }
            e.target.value = ''; // Reset select
          }}
          disabled={isPending}
        >
          <option value="">Actions en masse...</option>
          <option value="active">Marquer comme actif</option>
          <option value="inactive">Marquer comme inactif</option>
          <option value="lead">Marquer comme lead</option>
          <option value="customer">Marquer comme client</option>
          <option value="delete">Supprimer</option>
        </select>

        <button
          onClick={() => handleExport('csv')}
          disabled={isExporting}
          className="btn-secondary"
        >
          {isExporting ? 'Export en cours...' : 'Exporter CSV'}
        </button>
        <button
          onClick={() => handleExport('json')}
          disabled={isExporting}
          className="btn-secondary"
        >
          {isExporting ? 'Export en cours...' : 'Exporter JSON'}
        </button>
      </div>
    </div>
  );
} 