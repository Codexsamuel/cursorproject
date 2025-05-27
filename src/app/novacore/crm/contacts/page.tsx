'use client';

import { auth } from "@/lib/auth";
import { searchContacts, type ContactFilters } from "./actions";
import { Contact } from "@/lib/types/crm";
import Link from "next/link";
import { Suspense, useState } from "react";
import ContactFilters from "./components/ContactFilters";
import ContactTable from "./components/ContactTable";
import ContactPagination from "./components/ContactPagination";
import BulkActions from "./components/BulkActions";
import { toast } from "react-hot-toast";

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { userId } = await auth();
  if (!userId) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Non autorisé</h3>
        <p className="mt-2 text-sm text-gray-500">
          Vous devez être connecté pour accéder à cette page.
        </p>
      </div>
    );
  }

  // Convertir les paramètres de recherche en filtres
  const filters: ContactFilters = {
    search: searchParams.search as string,
    status: searchParams.status as string,
    company: searchParams.company as string,
    dateFrom: searchParams.dateFrom as string,
    dateTo: searchParams.dateTo as string,
    sortBy: searchParams.sortBy as string,
    sortOrder: (searchParams.sortOrder as 'asc' | 'desc') || 'asc',
    page: searchParams.page ? parseInt(searchParams.page as string) : 1,
    limit: searchParams.limit ? parseInt(searchParams.limit as string) : 10,
  };

  let contactsData;
  let error = null;

  try {
    contactsData = await searchContacts(filters);
  } catch (e) {
    error = e;
    console.error("Error fetching contacts:", e);
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos contacts et suivez leurs interactions
          </p>
        </div>
        <div className="flex space-x-4">
          <Link
            href="/novacore/crm/contacts/export"
            className="btn-secondary"
          >
            Exporter
          </Link>
          <Link
            href="/novacore/crm/contacts/new"
            className="btn-primary"
          >
            Nouveau contact
          </Link>
        </div>
      </div>

      {/* Filtres */}
      <Suspense fallback={<div>Chargement des filtres...</div>}>
        <ContactFilters currentFilters={filters} />
      </Suspense>

      {/* Liste des contacts */}
      {error ? (
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-700">Une erreur est survenue lors du chargement des contacts.</p>
        </div>
      ) : contactsData?.contacts.length ? (
        <>
          {/* Actions en masse */}
          <ClientBulkActions filters={filters} />

          <Suspense fallback={<div>Chargement des contacts...</div>}>
            <ContactTable 
              contacts={contactsData.contacts}
              sortBy={filters.sortBy}
              sortOrder={filters.sortOrder}
            />
          </Suspense>

          {/* Pagination */}
          <Suspense fallback={<div>Chargement de la pagination...</div>}>
            <ContactPagination
              currentPage={contactsData.page}
              totalPages={contactsData.totalPages}
              totalItems={contactsData.total}
            />
          </Suspense>
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun contact trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filters.search || filters.status !== 'all' 
              ? "Aucun contact ne correspond à vos critères de recherche."
              : "Commencez par créer un nouveau contact pour votre CRM."}
          </p>
          <div className="mt-6">
            <Link
              href="/novacore/crm/contacts/new"
              className="btn-primary"
            >
              Nouveau contact
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// Composant client pour gérer l'état de sélection
function ClientBulkActions({ filters }: { filters: ContactFilters }) {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  return (
    <BulkActions
      selectedContacts={selectedContacts}
      filters={filters}
      onSuccess={(message) => {
        toast.success(message);
        setSelectedContacts([]);
      }}
      onError={(error) => {
        toast.error(error);
      }}
    />
  );
} 