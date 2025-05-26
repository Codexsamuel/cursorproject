import { auth } from "@/lib/auth";
import { getContacts } from "@/lib/crm";
import { Contact } from "@/lib/types/crm";
import Link from "next/link";

export default async function ContactsPage() {
  const { userId } = await auth();
  let contacts: Contact[] = [];
  let error = null;

  if (userId) {
    try {
      contacts = await getContacts(userId);
    } catch (e) {
      error = e;
      console.error("Error fetching contacts:", e);
    }
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
        <Link
          href="/novacore/crm/contacts/new"
          className="btn-primary"
        >
          Nouveau contact
        </Link>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Rechercher un contact..."
            className="input-field flex-1"
          />
          <select className="input-field w-48">
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="lead">Lead</option>
            <option value="customer">Client</option>
          </select>
        </div>
      </div>

      {/* Liste des contacts */}
      {error ? (
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-700">Une erreur est survenue lors du chargement des contacts.</p>
        </div>
      ) : contacts.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entreprise
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernier contact
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
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
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${contact.status === 'active' ? 'bg-green-100 text-green-800' :
                        contact.status === 'lead' ? 'bg-yellow-100 text-yellow-800' :
                        contact.status === 'customer' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contact.last_contacted ? new Date(contact.last_contacted).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/novacore/crm/contacts/${contact.id}`}
                      className="text-primary hover:text-primary/80"
                    >
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun contact</h3>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par créer un nouveau contact pour votre CRM.
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