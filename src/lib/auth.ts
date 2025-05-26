import { auth as clerkAuth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs";

export async function auth() {
  const { userId } = clerkAuth();
  if (!userId) {
    throw new Error('Non autorisé');
  }
  return { userId };
}

export async function getCurrentUser() {
  const user = await currentUser();
  if (!user) {
    throw new Error('Non autorisé');
  }
  return user;
} 