import { auth } from "@/lib/auth";
import { createContact } from "@/lib/crm";
import { ContactStatus } from "@/lib/types/crm";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function NewContactPage() {
  async function handleSubmit(formData: FormData) {
    'use server';
    
    const { userId } = await auth();
    if (!userId) throw new Error('Non autorisé');

    const contact = {
      full_name: formData.get('full_name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      company: formData.get('company') as string,
      position: formData.get('position') as string,
      status: formData.get('status') as ContactStatus,
      notes: formData.get('notes') as string,
      tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()),
      owner_id: userId,
    };

    try {
      await createContact(contact);
      redirect('/novacore/crm/contacts');
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nouveau contact</h1>
          <p className="mt-1 text-sm text-gray-500">
            Ajoutez un nouveau contact à votre CRM
          </p>
        </div>
        <Link
          href="/novacore/crm/contacts"
          className="text-gray-500 hover:text-gray-700"
        >
          Retour aux contacts
        </Link>
      </div>

      {/* Formulaire */}
      <form action={handleSubmit} className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Nom complet */}
            <div className="sm:col-span-3">
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                Nom complet
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="full_name"
                  id="full_name"
                  required
                  className="input-field"
                />
              </div>
            </div>

            {/* Email */}
            <div className="sm:col-span-3">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="input-field"
                />
              </div>
            </div>

            {/* Téléphone */}
            <div className="sm:col-span-3">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <div className="mt-1">
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  className="input-field"
                />
              </div>
            </div>

            {/* Entreprise */}
            <div className="sm:col-span-3">
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Entreprise
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="company"
                  id="company"
                  className="input-field"
                />
              </div>
            </div>

            {/* Poste */}
            <div className="sm:col-span-3">
              <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                Poste
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="position"
                  id="position"
                  className="input-field"
                />
              </div>
            </div>

            {/* Statut */}
            <div className="sm:col-span-3">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Statut
              </label>
              <div className="mt-1">
                <select
                  name="status"
                  id="status"
                  required
                  className="input-field"
                >
                  <option value="lead">Lead</option>
                  <option value="active">Actif</option>
                  <option value="customer">Client</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div className="sm:col-span-6">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                Tags (séparés par des virgules)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="tags"
                  id="tags"
                  className="input-field"
                  placeholder="ex: vip, prospect, tech"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="sm:col-span-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <div className="mt-1">
                <textarea
                  name="notes"
                  id="notes"
                  rows={4}
                  className="input-field"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-3 bg-gray-50 flex items-center justify-end rounded-b-lg">
          <button
            type="button"
            className="btn-secondary mr-3"
            onClick={() => window.history.back()}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Créer le contact
          </button>
        </div>
      </form>
    </div>
  );
} 