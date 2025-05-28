import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialisation de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// PUT /api/payment-methods/[id]/default
export async function PUT(
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

    // Vérifier que la carte existe et appartient à l'utilisateur
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

    // Démarrer une transaction Supabase
    const { error: transactionError } = await supabase.rpc('set_default_payment_method', {
      p_payment_method_id: params.id,
      p_user_id: user.id
    });

    if (transactionError) {
      console.error('Erreur transaction:', transactionError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de la carte par défaut' },
        { status: 500 }
      );
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