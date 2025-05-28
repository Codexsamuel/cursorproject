export interface PaymentMethod {
  id: string;
  user_id: string;
  type: 'card' | 'mobile_money';
  stripe_card_id?: string;
  card_number?: string;
  holder_name?: string;
  expiry?: string;
  brand?: string;
  phone?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CinetPayTransaction {
  transaction_id: string;
  amount: number;
  currency: string;
  channels: string;
  description: string;
  status: 'pending' | 'success' | 'failed';
  payment_url?: string;
  phone?: string;
  operator?: 'MTN' | 'ORANGE' | 'MOOV';
} 