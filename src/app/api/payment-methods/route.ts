import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Initialisation de Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Initialisation de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Types
interface PaymentMethod {
  id: string;
  user_id: string;
  stripe_card_id: string;
  card_number: string;
  holder_name: string;
  expiry: string;
  is_default: boolean;
  created_at: string;
}

interface StripeTokenResponse {
  token: {
    id: string;
    card: {
      id: string;
      last4: string;
      exp_month: number;
      exp_year: number;
      brand: string;
      name?: string;
    };
  };
}

// GET /api/payment-methods
export async function GET(req: Request) {
  try {
    // Récupérer le token d'authentification
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token d\'authentification manquant' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Vérifier l'authentification avec Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Récupérer les moyens de paiement de l'utilisateur
    const { data: paymentMethods, error: dbError } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (dbError) {
      console.error('Erreur Supabase:', dbError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des moyens de paiement' },
        { status: 500 }
      );
    }

    return NextResponse.json(paymentMethods);
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}

// POST /api/payment-methods
export async function POST(req: Request) {
  try {
    // Vérifier l'authentification
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token d\'authentification manquant' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Récupérer les données de la carte
    const body = await req.json();
    const { token: stripeToken } = body as { token: string };

    if (!stripeToken) {
      return NextResponse.json(
        { error: 'Token Stripe manquant' },
        { status: 400 }
      );
    }

    // Créer ou récupérer le client Stripe
    let customerId: string;
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (existingCustomer?.stripe_customer_id) {
      customerId = existingCustomer.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id
        }
      });
      customerId = customer.id;

      // Sauvegarder l'ID client Stripe
      await supabase
        .from('customers')
        .insert({
          user_id: user.id,
          stripe_customer_id: customerId
        });
    }

    // Attacher la carte au client
    const card = await stripe.customers.createSource(customerId, {
      source: stripeToken
    }) as Stripe.Card;

    // Sauvegarder la carte dans Supabase
    const { data: paymentMethod, error: dbError } = await supabase
      .from('payment_methods')
      .insert({
        user_id: user.id,
        stripe_card_id: card.id,
        card_number: card.last4,
        holder_name: card.name || 'Sans nom',
        expiry: `${card.exp_month}/${card.exp_year.toString().slice(2)}`,
        is_default: false // La première carte sera définie comme défaut plus tard
      })
      .select()
      .single();

    if (dbError) {
      console.error('Erreur Supabase:', dbError);
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde de la carte' },
        { status: 500 }
      );
    }

    // Si c'est la première carte, la définir comme défaut
    const { count } = await supabase
      .from('payment_methods')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (count === 1) {
      await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', paymentMethod.id);
      
      paymentMethod.is_default = true;
    }

    return NextResponse.json(paymentMethod);
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
} 