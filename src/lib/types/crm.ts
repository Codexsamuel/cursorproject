export type ContactStatus = 'active' | 'inactive' | 'lead' | 'customer' | 'archived';
export type DealStage = 'prospect' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'cancelled';

export interface Contact {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  status: ContactStatus;
  notes?: string;
  tags: string[];
  last_contacted?: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
}

export interface Deal {
  id: string;
  title: string;
  contact_id: string;
  amount: number;
  currency: string;
  stage: DealStage;
  probability: number;
  expected_close_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  due_date: string;
  priority: TaskPriority;
  status: TaskStatus;
  assigned_to: string;
  related_to?: {
    type: 'contact' | 'deal';
    id: string;
  };
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface Note {
  id: string;
  content: string;
  related_to: {
    type: 'contact' | 'deal' | 'task';
    id: string;
  };
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface Activity {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'note' | 'task' | 'deal_update';
  description: string;
  related_to: {
    type: 'contact' | 'deal' | 'task';
    id: string;
  };
  created_at: string;
  created_by: string;
} 