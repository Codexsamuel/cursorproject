export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  messages: Message[];
}

export interface Template {
  id: string;
  title: string;
  description: string;
  system_prompt: string;
  example_messages: Message[];
  created_at: string;
  updated_at: string;
}

export type ChatContextType = {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  templates: Template[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  createConversation: (title: string) => Promise<void>;
  selectConversation: (id: string) => void;
  clearConversation: () => void;
}; 