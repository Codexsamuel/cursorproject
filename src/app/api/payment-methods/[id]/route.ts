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

// DELETE /api/payment-methods/[id]
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    // Récupérer la carte à supprimer
    const { data: paymentMethod, error: fetchError } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !paymentMethod) {
      return NextResponse.json(
        { error: 'Carte non trouvée' },
        { status: 404 }
      );
    }

    // Supprimer la carte de Stripe
    try {
      const { data: customer } = await supabase
        .from('customers')
        .select('stripe_customer_id')
        .eq('user_id', user.id)
        .single();

      if (customer?.stripe_customer_id) {
        await stripe.customers.deleteSource(
          customer.stripe_customer_id,
          paymentMethod.stripe_card_id
        );
      }
    } catch (stripeError) {
      console.error('Erreur Stripe:', stripeError);
      // On continue même si la suppression Stripe échoue
    }

    // Supprimer la carte de Supabase
    const { error: deleteError } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Erreur Supabase:', deleteError);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression de la carte' },
        { status: 500 }
      );
    }

    // Si la carte supprimée était par défaut, définir une nouvelle carte par défaut
    if (paymentMethod.is_default) {
      const { data: remainingCards } = await supabase
        .from('payment_methods')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (remainingCards?.length) {
        await supabase
          .from('payment_methods')
          .update({ is_default: true })
          .eq('id', remainingCards[0].id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
} 