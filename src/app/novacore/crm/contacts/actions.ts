'use server';

import { auth } from "@/lib/auth";
import { getContacts, updateContact, deleteContact } from "@/lib/crm";
import { Contact } from "@/lib/types/crm";
import { revalidatePath } from "next/cache";
import { Parser } from 'json2csv';

export type ContactFilters = {
  search?: string;
  status?: string;
  company?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
};

export async function searchContacts(filters: ContactFilters) {
  const { userId } = await auth();
  if (!userId) throw new Error('Non autorisé');

  try {
    const contacts = await getContacts(userId);
    
    // Appliquer les filtres
    let filteredContacts = [...contacts];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredContacts = filteredContacts.filter(contact => 
        contact.full_name.toLowerCase().includes(searchLower) ||
        contact.email.toLowerCase().includes(searchLower) ||
        (contact.company?.toLowerCase().includes(searchLower) ?? false)
      );
    }

    if (filters.status && filters.status !== 'all') {
      filteredContacts = filteredContacts.filter(contact => 
        contact.status === filters.status
      );
    }

    if (filters.company) {
      filteredContacts = filteredContacts.filter(contact => 
        contact.company?.toLowerCase().includes(filters.company!.toLowerCase())
      );
    }

    if (filters.dateFrom || filters.dateTo) {
      filteredContacts = filteredContacts.filter(contact => {
        if (!contact.last_contacted) return false;
        const contactDate = new Date(contact.last_contacted);
        if (filters.dateFrom && contactDate < new Date(filters.dateFrom)) return false;
        if (filters.dateTo && contactDate > new Date(filters.dateTo)) return false;
        return true;
      });
    }

    // Appliquer le tri
    if (filters.sortBy) {
      filteredContacts.sort((a, b) => {
        const aValue = a[filters.sortBy as keyof Contact];
        const bValue = b[filters.sortBy as keyof Contact];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return filters.sortOrder === 'desc' 
            ? bValue.localeCompare(aValue)
            : aValue.localeCompare(bValue);
        }
        
        if (aValue instanceof Date && bValue instanceof Date) {
          return filters.sortOrder === 'desc'
            ? bValue.getTime() - aValue.getTime()
            : aValue.getTime() - bValue.getTime();
        }
        
        return 0;
      });
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedContacts = filteredContacts.slice(startIndex, endIndex);

    return {
      contacts: paginatedContacts,
      total: filteredContacts.length,
      page,
      totalPages: Math.ceil(filteredContacts.length / limit)
    };
  } catch (error) {
    console.error('Error searching contacts:', error);
    throw new Error('Erreur lors de la recherche des contacts');
  }
}

export async function bulkUpdateContacts(contactIds: string[], updates: Partial<Contact>) {
  const { userId } = await auth();
  if (!userId) throw new Error('Non autorisé');

  try {
    const results = await Promise.allSettled(
      contactIds.map(id => updateContact(id, updates))
    );

    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const failureCount = results.filter(r => r.status === 'rejected').length;

    revalidatePath('/novacore/crm/contacts');
    
    return {
      success: true,
      message: `${successCount} contact(s) mis à jour, ${failureCount} échec(s)`,
      details: results
    };
  } catch (error) {
    console.error('Error in bulk update:', error);
    throw new Error('Erreur lors de la mise à jour en masse des contacts');
  }
}

export async function bulkDeleteContacts(contactIds: string[]) {
  const { userId } = await auth();
  if (!userId) throw new Error('Non autorisé');

  try {
    const results = await Promise.allSettled(
      contactIds.map(id => deleteContact(id))
    );

    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const failureCount = results.filter(r => r.status === 'rejected').length;

    revalidatePath('/novacore/crm/contacts');
    
    return {
      success: true,
      message: `${successCount} contact(s) supprimé(s), ${failureCount} échec(s)`,
      details: results
    };
  } catch (error) {
    console.error('Error in bulk delete:', error);
    throw new Error('Erreur lors de la suppression en masse des contacts');
  }
}

export async function exportContacts(filters: ContactFilters, format: 'csv' | 'json' = 'csv') {
  const { userId } = await auth();
  if (!userId) throw new Error('Non autorisé');

  try {
    // Récupérer tous les contacts (sans pagination)
    const contacts = await getContacts(userId);
    let filteredContacts = [...contacts];

    // Appliquer les mêmes filtres que searchContacts
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredContacts = filteredContacts.filter(contact => 
        contact.full_name.toLowerCase().includes(searchLower) ||
        contact.email.toLowerCase().includes(searchLower) ||
        (contact.company?.toLowerCase().includes(searchLower) ?? false)
      );
    }

    if (filters.status && filters.status !== 'all') {
      filteredContacts = filteredContacts.filter(contact => 
        contact.status === filters.status
      );
    }

    if (filters.company) {
      filteredContacts = filteredContacts.filter(contact => 
        contact.company?.toLowerCase().includes(filters.company!.toLowerCase())
      );
    }

    if (filters.dateFrom || filters.dateTo) {
      filteredContacts = filteredContacts.filter(contact => {
        if (!contact.last_contacted) return false;
        const contactDate = new Date(contact.last_contacted);
        if (filters.dateFrom && contactDate < new Date(filters.dateFrom)) return false;
        if (filters.dateTo && contactDate > new Date(filters.dateTo)) return false;
        return true;
      });
    }

    // Appliquer le tri
    if (filters.sortBy) {
      filteredContacts.sort((a, b) => {
        const aValue = a[filters.sortBy as keyof Contact];
        const bValue = b[filters.sortBy as keyof Contact];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return filters.sortOrder === 'desc' 
            ? bValue.localeCompare(aValue)
            : aValue.localeCompare(bValue);
        }
        
        if (aValue instanceof Date && bValue instanceof Date) {
          return filters.sortOrder === 'desc'
            ? bValue.getTime() - aValue.getTime()
            : aValue.getTime() - bValue.getTime();
        }
        
        return 0;
      });
    }

    // Préparer les données pour l'export
    const exportData = filteredContacts.map(contact => ({
      ...contact,
      last_contacted: contact.last_contacted ? new Date(contact.last_contacted).toISOString() : null,
      created_at: contact.created_at ? new Date(contact.created_at).toISOString() : null,
      updated_at: contact.updated_at ? new Date(contact.updated_at).toISOString() : null,
    }));

    if (format === 'csv') {
      const fields = [
        'id',
        'full_name',
        'email',
        'phone',
        'company',
        'position',
        'status',
        'last_contacted',
        'created_at',
        'updated_at'
      ];
      
      const json2csvParser = new Parser({ fields });
      return {
        data: json2csvParser.parse(exportData),
        contentType: 'text/csv',
        filename: `contacts_export_${new Date().toISOString().split('T')[0]}.csv`
      };
    } else {
      return {
        data: JSON.stringify(exportData, null, 2),
        contentType: 'application/json',
        filename: `contacts_export_${new Date().toISOString().split('T')[0]}.json`
      };
    }
  } catch (error) {
    console.error('Error exporting contacts:', error);
    throw new Error('Erreur lors de l\'export des contacts');
  }
} 