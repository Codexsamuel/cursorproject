import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// Middleware pour vérifier l'authentification
async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return new NextResponse(
      JSON.stringify({ message: 'Non autorisé' }),
      { status: 401 }
    );
  }
  return null;
}

// GET /api/admin/messages
export async function GET() {
  try {
    const authError = await checkAuth();
    if (authError) return authError;

    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des messages' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/messages/:id
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await checkAuth();
    if (authError) return authError;

    const { id } = params;
    const { status } = await request.json();

    if (!['new', 'read', 'replied', 'archived'].includes(status)) {
      return NextResponse.json(
        { message: 'Statut invalide' },
        { status: 400 }
      );
    }

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du message:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour du message' },
      { status: 500 }
    );
  }
} 