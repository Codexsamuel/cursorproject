import { supabase } from './supabase';
import { Contact, Deal, Task, Note, Activity } from './types/crm';

// Fonctions pour les contacts
export async function getContacts(userId: string) {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Contact[];
}

export async function getContact(id: string) {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Contact;
}

export async function createContact(contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('contacts')
    .insert([{
      ...contact,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return data as Contact;
}

export async function updateContact(id: string, updates: Partial<Contact>) {
  const { data, error } = await supabase
    .from('contacts')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Contact;
}

// Fonctions pour les deals
export async function getDeals(userId: string) {
  const { data, error } = await supabase
    .from('deals')
    .select(`
      *,
      contacts (
        id,
        full_name,
        email
      )
    `)
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as (Deal & { contacts: Pick<Contact, 'id' | 'full_name' | 'email'> })[];
}

export async function createDeal(deal: Omit<Deal, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('deals')
    .insert([{
      ...deal,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return data as Deal;
}

// Fonctions pour les tâches
export async function getTasks(userId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('assigned_to', userId)
    .order('due_date', { ascending: true });

  if (error) throw error;
  return data as Task[];
}

export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([{
      ...task,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return data as Task;
}

// Fonctions pour les activités
export async function logActivity(activity: Omit<Activity, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('activities')
    .insert([{
      ...activity,
      created_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return data as Activity;
}

export async function getActivities(params: {
  userId: string;
  relatedType?: 'contact' | 'deal' | 'task';
  relatedId?: string;
}) {
  let query = supabase
    .from('activities')
    .select('*')
    .eq('created_by', params.userId);

  if (params.relatedType && params.relatedId) {
    query = query
      .eq('related_to->type', params.relatedType)
      .eq('related_to->id', params.relatedId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data as Activity[];
}

// Fonctions pour les notes
export async function createNote(note: {
  content: string;
  related_to: {
    type: 'contact' | 'deal' | 'task';
    id: string;
  };
  created_by: string;
}) {
  const { data: noteData, error: noteError } = await supabase
    .from('notes')
    .insert([{
      ...note,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (noteError) throw noteError;

  // Créer une activité pour la note
  const activity = {
    type: 'note' as const,
    description: `Note ajoutée : ${note.content.slice(0, 100)}${note.content.length > 100 ? '...' : ''}`,
    related_to: note.related_to,
    created_by: note.created_by,
  };

  const { error: activityError } = await supabase
    .from('activities')
    .insert([{
      ...activity,
      created_at: new Date().toISOString(),
    }]);

  if (activityError) throw activityError;

  return noteData as Note;
}

export async function getNotes(params: {
  relatedType: 'contact' | 'deal' | 'task';
  relatedId: string;
}) {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('related_to->type', params.relatedType)
    .eq('related_to->id', params.relatedId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Note[];
} 