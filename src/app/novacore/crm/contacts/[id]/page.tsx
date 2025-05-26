import { auth } from "@/lib/auth";
import { getContact, getActivities, getNotes } from "@/lib/crm";
import { Contact, Activity, Note } from "@/lib/types/crm";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContactActions from "./ContactActions";
import NotesSection from "./NotesSection";
import { addNote } from "./actions";

interface ContactPageProps {
  params: {
    id: string;
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { userId } = await auth();
  if (!userId) throw new Error('Non autorisé');

  let contact: Contact | null = null;
  let activities: Activity[] = [];
  let notes: Note[] = [];
  let error = null;

  try {
    contact = await getContact(params.id);
    activities = await getActivities({
      userId,
      relatedType: 'contact',
      relatedId: params.id,
    });
    notes = await getNotes({
      relatedType: 'contact',
      relatedId: params.id,
    });
  } catch (e) {
    error = e;
    console.error("Error fetching contact:", e);
  }

  if (!contact) {
    return notFound();
  }

  async function handleAddNote(content: string) {
    'use server';
    await addNote(params.id, content);
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary text-lg font-medium">
              {contact.full_name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{contact.full_name}</h1>
            <p className="text-sm text-gray-500">
              {contact.position} {contact.company ? `chez ${contact.company}` : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href={`/novacore/crm/contacts/${contact.id}/edit`}
            className="btn-secondary"
          >
            Modifier
          </Link>
          <Link
            href="/novacore/crm/contacts"
            className="text-gray-500 hover:text-gray-700"
          >
            Retour aux contacts
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Détails du contact */}
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Détails du contact</h2>
            </div>
            <div className="px-6 py-5">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{contact.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{contact.phone || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Entreprise</dt>
                  <dd className="mt-1 text-sm text-gray-900">{contact.company || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Poste</dt>
                  <dd className="mt-1 text-sm text-gray-900">{contact.position || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Statut</dt>
                  <dd className="mt-1">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${contact.status === 'active' ? 'bg-green-100 text-green-800' :
                        contact.status === 'lead' ? 'bg-yellow-100 text-yellow-800' :
                        contact.status === 'customer' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                      {contact.status}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tags</dt>
                  <dd className="mt-1">
                    <div className="flex flex-wrap gap-2">
                      {contact.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Notes */}
          <NotesSection notes={notes} onAddNote={handleAddNote} />

          {/* Activités récentes */}
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Activités récentes</h2>
            </div>
            <div className="px-6 py-5">
              {activities.length > 0 ? (
                <ul className="space-y-4">
                  {activities.map((activity) => (
                    <li key={activity.id} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center
                          ${activity.type === 'email' ? 'bg-blue-100 text-blue-600' :
                            activity.type === 'call' ? 'bg-green-100 text-green-600' :
                            activity.type === 'meeting' ? 'bg-purple-100 text-purple-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                          {activity.type === 'email' ? '📧' :
                            activity.type === 'call' ? '📞' :
                            activity.type === 'meeting' ? '📅' :
                            activity.type === 'note' ? '📝' :
                            '🔄'}
                        </span>
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm text-gray-600">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.created_at).toLocaleString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Aucune activité récente</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions rapides et statistiques */}
        <div className="space-y-6">
          <ContactActions contactId={contact.id} onAddNote={handleAddNote} />

          {/* Statistiques */}
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Statistiques</h2>
            </div>
            <div className="px-6 py-5">
              <dl className="grid grid-cols-1 gap-5">
                <div className="px-4 py-5 bg-gray-50 shadow-sm rounded-lg overflow-hidden sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Dernier contact
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {contact.last_contacted
                      ? new Date(contact.last_contacted).toLocaleDateString()
                      : '-'}
                  </dd>
                </div>
                <div className="px-4 py-5 bg-gray-50 shadow-sm rounded-lg overflow-hidden sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Activités totales
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {activities.length}
                  </dd>
                </div>
                <div className="px-4 py-5 bg-gray-50 shadow-sm rounded-lg overflow-hidden sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Notes
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {notes.length}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 