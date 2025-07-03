import { z } from "zod";

// User interface (matching the structure that MemStorage expects)
export interface User {
  id: string; // UUID for Supabase compatibility
  username: string;
  password: string;
  email: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}

// Project interface
export interface Project {
  id: number;
  user_id: string; // UUID reference for Supabase compatibility
  name: string;
  created_at: string;
  updated_at: string;
}

// File interface
export interface File {
  id: number;
  project_id: number;
  path: string;
  content: string;
  updated_at: string;
}

// Deployment interface
export interface Deployment {
  id: number;
  project_id: number;
  url: string;
  created_at: string;
  status: string;
}

// Schema for Supabase config
export const supabaseConfigSchema = z.object({
  url: z.string().url(),
  key: z.string().min(1),
});

// Insert schemas using Zod (replacing Drizzle createInsertSchema)
export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().optional(),
});

export const insertProjectSchema = z.object({
  user_id: z.string(), // UUID for Supabase compatibility
  name: z.string(),
});

export const insertFileSchema = z.object({
  project_id: z.number(),
  path: z.string(),
  content: z.string(),
});

export const insertDeploymentSchema = z.object({
  project_id: z.number(),
  url: z.string(),
  status: z.string(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertFile = z.infer<typeof insertFileSchema>;
export type InsertDeployment = z.infer<typeof insertDeploymentSchema>;
export type SupabaseConfig = z.infer<typeof supabaseConfigSchema>;
