'use server';

import { auth } from "@/lib/auth";
import { createNote } from "@/lib/crm";
import { revalidatePath } from "next/cache";

export async function addNote(contactId: string, content: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Non autorisé');

  await createNote({
    content,
    related_to: {
      type: 'contact',
      id: contactId,
    },
    created_by: userId,
  });

  revalidatePath(`/novacore/crm/contacts/${contactId}`);
} 