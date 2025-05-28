import { useEffect, useState } from 'react';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import { useStore } from '../store/useStore';

// Initialisation du client Supabase
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function useSupabase() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { setUser } = useStore(state => ({
    setUser: state.setUser,
  }));

  useEffect(() => {
    // Récupérer la session active
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);

      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          phone: session.user.phone,
        });
      }
    });

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          phone: session.user.phone,
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser]);

  return {
    supabase,
    session,
    loading,
  };
} 