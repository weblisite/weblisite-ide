export interface FileItem {
  path: string;
  name: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
  id?: number;
}

export interface FolderStructure {
  name: string;
  path: string;
  isFolder: boolean;
  children: FolderStructure[];
}

export interface SupabaseConfig {
  url: string;
  key: string;
}

// Database types for Supabase tables
export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  path: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectDeployment {
  id: string;
  project_id: string;
  url: string;
  status: 'pending' | 'success' | 'error';
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  plan: 'free' | 'pro' | 'team';
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
}

// Re-export Supabase types
export type { User, Session } from '@supabase/supabase-js';
