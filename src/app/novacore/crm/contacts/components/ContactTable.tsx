'use client';

import { Contact } from "@/lib/types/crm";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition, useState } from "react";

interface ContactTableProps {
  contacts: Contact[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSelectionChange?: (selectedIds: string[]) => void;
}

export default function ContactTable({ 
  contacts, 
  sortBy, 
  sortOrder,
  onSelectionChange 
}: ContactTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

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

  const handleSort = (column: string) => {
    const newSortOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
    startTransition(() => {
      router.push(
        `/novacore/crm/contacts?${createQueryString('sortBy', column)}&${createQueryString(
          'sortOrder',
          newSortOrder
        )}`
      );
    });
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelection = checked ? contacts.map(c => c.id) : [];
    setSelectedContacts(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleSelectContact = (contactId: string, checked: boolean) => {
    const newSelection = checked
      ? [...selectedContacts, contactId]
      : selectedContacts.filter(id => id !== contactId);
    setSelectedContacts(newSelection);
    onSelectionChange?.(newSelection);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary focus:ring-primary"
                checked={selectedContacts.length === contacts.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('full_name')}
            >
              Nom {getSortIcon('full_name')}
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('email')}
            >
              Email {getSortIcon('email')}
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('company')}
            >
              Entreprise {getSortIcon('company')}
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('status')}
            >
              Statut {getSortIcon('status')}
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('last_contacted')}
            >
              Dernier contact {getSortIcon('last_contacted')}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {contacts.map((contact) => (
            <tr 
              key={contact.id} 
              className={`hover:bg-gray-50 ${
                selectedContacts.includes(contact.id) ? 'bg-primary/5' : ''
              }`}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                  checked={selectedContacts.includes(contact.id)}
                  onChange={(e) => handleSelectContact(contact.id, e.target.checked)}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary text-sm font-medium">
                        {contact.full_name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {contact.full_name}
                    </div>
                    {contact.position && (
                      <div className="text-sm text-gray-500">
                        {contact.position}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{contact.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{contact.company || '-'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${
                      contact.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : contact.status === 'lead'
                        ? 'bg-yellow-100 text-yellow-800'
                        : contact.status === 'customer'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                >
                  {contact.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {contact.last_contacted
                  ? new Date(contact.last_contacted).toLocaleDateString()
                  : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <Link
                    href={`/novacore/crm/contacts/${contact.id}`}
                    className="text-primary hover:text-primary/80"
                  >
                    Voir
                  </Link>
                  <Link
                    href={`/novacore/crm/contacts/${contact.id}/edit`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Modifier
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 