'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { type ContactFilters as ContactFiltersType } from '../actions';

interface ContactFiltersProps {
  currentFilters: ContactFiltersType;
}

export default function ContactFilters({ currentFilters }: ContactFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    startTransition(() => {
      router.push(`/novacore/crm/contacts?${createQueryString(name, value)}`);
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Recherche */}
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <input
            type="text"
            placeholder="Rechercher un contact..."
            className="input-field w-full"
            value={currentFilters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        {/* Statut */}
        <div>
          <select
            className="input-field w-full"
            value={currentFilters.status || 'all'}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="lead">Lead</option>
            <option value="customer">Client</option>
          </select>
        </div>

        {/* Entreprise */}
        <div>
          <input
            type="text"
            placeholder="Filtrer par entreprise..."
            className="input-field w-full"
            value={currentFilters.company || ''}
            onChange={(e) => handleFilterChange('company', e.target.value)}
          />
        </div>

        {/* Date */}
        <div className="col-span-1 md:col-span-2 lg:col-span-1 grid grid-cols-2 gap-2">
          <input
            type="date"
            className="input-field"
            value={currentFilters.dateFrom || ''}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
          />
          <input
            type="date"
            className="input-field"
            value={currentFilters.dateTo || ''}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
          />
        </div>
      </div>

      {/* Boutons de réinitialisation */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            startTransition(() => {
              router.push('/novacore/crm/contacts');
            });
          }}
          className="text-sm text-gray-600 hover:text-gray-900"
          disabled={isPending}
        >
          Réinitialiser les filtres
        </button>
      </div>
    </div>
  );
} 