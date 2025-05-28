import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { PrismaClient } from '@prisma/client';
import { EMAIL_CONFIG } from '@/lib/config/email';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  subject: z.string().min(5),
  message: z.string().min(10),
  service: z.enum(['web', 'cloud', 'consulting', 'equipment', 'other']),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validation des données
    const validatedData = contactSchema.parse(body);

    // Stocker le message dans la base de données
    const message = await prisma.contactMessage.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        subject: validatedData.subject,
        message: validatedData.message,
        service: validatedData.service,
        status: 'new',
      },
    });

    // Envoyer l'email de notification à l'équipe
    await resend.emails.send({
      from: EMAIL_CONFIG.from.address,
      to: EMAIL_CONFIG.from.address,
      subject: EMAIL_CONFIG.templates.contactNotification.subject.replace('{{subject}}', validatedData.subject),
      text: EMAIL_CONFIG.templates.contactNotification.text
        .replace('{{name}}', validatedData.name)
        .replace('{{email}}', validatedData.email)
        .replace('{{phone}}', validatedData.phone)
        .replace('{{service}}', validatedData.service)
        .replace('{{subject}}', validatedData.subject)
        .replace('{{message}}', validatedData.message),
      reply_to: validatedData.email,
    });

    // Envoyer l'email de confirmation au client
    await resend.emails.send({
      from: EMAIL_CONFIG.from.address,
      to: validatedData.email,
      subject: EMAIL_CONFIG.templates.contactConfirmation.subject,
      text: EMAIL_CONFIG.templates.contactConfirmation.text
        .replace('{{name}}', validatedData.name)
        .replace('{{service}}', validatedData.service)
        .replace('{{subject}}', validatedData.subject)
        .replace('{{message}}', validatedData.message),
    });

    return NextResponse.json(
      { 
        message: 'Message envoyé avec succès',
        id: message.id 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors du traitement du message:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: 'Données invalides',
          errors: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Erreur lors du traitement du message' },
      { status: 500 }
    );
  }
} 