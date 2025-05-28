-- Création de la table customers si elle n'existe pas
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  stripe_customer_id text UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Création de la table payment_methods si elle n'existe pas
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  stripe_card_id text,
  card_number text,
  holder_name text,
  expiry text,
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Création des index
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);

-- Fonction pour définir une carte comme défaut
CREATE OR REPLACE FUNCTION set_default_payment_method(
  p_payment_method_id uuid,
  p_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Démarrer une transaction
  BEGIN
    -- Réinitialiser toutes les cartes de l'utilisateur
    UPDATE payment_methods
    SET is_default = false,
        updated_at = now()
    WHERE user_id = p_user_id;

    -- Définir la nouvelle carte par défaut
    UPDATE payment_methods
    SET is_default = true,
        updated_at = now()
    WHERE id = p_payment_method_id
    AND user_id = p_user_id;

    -- Vérifier qu'une carte a bien été mise à jour
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Carte non trouvée ou n''appartient pas à l''utilisateur';
    END IF;
  END;
END;
$$;

-- Politiques de sécurité RLS
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Politiques pour payment_methods
CREATE POLICY "Les utilisateurs peuvent voir leurs propres cartes"
  ON payment_methods FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent ajouter leurs propres cartes"
  ON payment_methods FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent modifier leurs propres cartes"
  ON payment_methods FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent supprimer leurs propres cartes"
  ON payment_methods FOR DELETE
  USING (auth.uid() = user_id);

-- Politiques pour customers
CREATE POLICY "Les utilisateurs peuvent voir leurs propres données client"
  ON customers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent ajouter leurs propres données client"
  ON customers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent modifier leurs propres données client"
  ON customers FOR UPDATE
  USING (auth.uid() = user_id);

-- Triggers pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 