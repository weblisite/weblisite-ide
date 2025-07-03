import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { FileItem, Message } from '../types';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

// Create Supabase client
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Types for database tables
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
  username?: string;
  password?: string;
  avatar_url?: string;
  plan: 'free' | 'pro' | 'team';
  stripe_customer_id?: string;
  
  // Professional Information
  bio?: string;
  job_title?: string;
  company?: string;
  location?: string;
  timezone?: string;
  years_experience?: number;
  availability_status?: 'available' | 'busy' | 'unavailable';
  
  // Social & Contact Links
  website?: string;
  github_username?: string;
  twitter_username?: string;
  linkedin_username?: string;
  
  // Technical Preferences
  preferred_languages?: string[]; // Array of programming languages
  interests?: string;
  
  // Account Preferences
  notification_preferences?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
    marketing?: boolean;
  };
  theme_preference?: 'light' | 'dark' | 'system';
  
  created_at: string;
  updated_at: string;
}

// User preferences for code generation and system behavior
export interface UserPreferences {
  code_generation?: {
    default_framework?: string;
    preferred_styling?: string;
    code_style?: string;
    comment_verbosity?: 'minimal' | 'medium' | 'verbose';
    include_types?: boolean;
    include_error_handling?: boolean;
  };
  ui_styling?: {
    component_library?: string;
    design_system?: string;
    responsive_approach?: string;
  };
  framework_defaults?: {
    [framework: string]: any;
  };
  deployment?: {
    preferred_platform?: string;
    auto_deploy?: boolean;
  };
}

export class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    this.client = supabase;
  }

  // =====================
  // AUTHENTICATION
  // =====================

  /**
   * Redirect to our custom auth page
   */
  async redirectToAuth() {
    // Redirect to our custom auth page instead of trying to use non-existent Supabase hosted auth
    window.location.href = '/auth';
  }

  /**
   * Get Supabase hosted auth URL (fallback)
   */
  getHostedAuthUrl(): string {
    // This is kept for compatibility but may not work as expected
    return `${supabaseUrl}/auth/v1/authorize?redirect_to=${encodeURIComponent(`${window.location.origin}/auth/callback`)}`;
  }

  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle() {
    const { data, error } = await this.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) throw error;
    return data;
  }

  /**
   * Sign in with GitHub OAuth
   */
  async signInWithGitHub() {
    const { data, error } = await this.client.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) throw error;
    return data;
  }

  /**
   * Sign in with GitHub OAuth with enhanced repository permissions
   * This is used specifically for GitHub integration features
   */
  async signInWithGitHubForRepos() {
    const { data, error } = await this.client.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'repo user:email' // Request repository access and email
      }
    });

    if (error) throw error;
    return data;
  }

  /**
   * Get GitHub access token from current session
   * This extracts the GitHub token for API calls
   */
  async getGitHubAccessToken(): Promise<string | null> {
    const session = await this.getSession();
    if (!session?.provider_token) {
      return null;
    }

    // The provider_token contains the GitHub access token when using GitHub OAuth
    return session.provider_token;
  }

  /**
   * Sign out the current user
   */
  async signOut() {
    const { error } = await this.client.auth.signOut();
    if (error) throw error;
  }

  /**
   * Get current user session
   */
  async getSession(): Promise<Session | null> {
    const { data } = await this.client.auth.getSession();
    return data.session;
  }

  /**
   * Get current user
   */
  async getUser(): Promise<User | null> {
    const { data } = await this.client.auth.getUser();
    return data.user;
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return this.client.auth.onAuthStateChange(callback);
  }

  // =====================
  // USER PROFILES
  // =====================

  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.client
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Create or update user profile (upsert)
   */
  async upsertUserProfile(userId: string, profileData: Partial<UserProfile>) {
    const { data, error } = await this.client
      .from('user_profiles')
      .upsert({ 
        id: userId,
        ...profileData, 
        updated_at: new Date().toISOString() 
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await this.client
      .from('user_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // =====================
  // USER PREFERENCES
  // =====================

  /**
   * Get user preferences for code generation
   */
  async getUserCodeGenerationPreferences(userId: string): Promise<any> {
    const { data, error } = await this.client
      .rpc('get_user_code_generation_preferences', { user_uuid: userId });

    if (error) throw error;
    return data;
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(userId: string, preferenceType: string, preferences: any) {
    const { error } = await this.client
      .rpc('upsert_user_preference', {
        user_uuid: userId,
        pref_type: preferenceType,
        pref_data: preferences
      });

    if (error) throw error;
  }

  /**
   * Get specific user preference
   */
  async getUserPreference(userId: string, preferenceType: string): Promise<any> {
    const { data, error } = await this.client
      .from('user_preferences')
      .select('preference_data')
      .eq('user_id', userId)
      .eq('preference_type', preferenceType)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data?.preference_data;
  }

  /**
   * Update code generation preferences based on user profile
   */
  async updateCodeGenerationPreferences(userId: string, profile: Partial<UserProfile>) {
    const preferences = {
      default_framework: this.getDefaultFramework(profile.preferred_languages),
      preferred_styling: 'tailwind',
      code_style: 'modern',
      comment_verbosity: this.getCommentVerbosity(profile.years_experience),
      include_types: profile.preferred_languages?.includes('TypeScript') ?? false,
      include_error_handling: true,
      experience_level: this.getExperienceLevel(profile.years_experience)
    };

    await this.updateUserPreferences(userId, 'code_generation', preferences);
  }

  /**
   * Helper: Determine default framework based on preferred languages
   */
  private getDefaultFramework(preferredLanguages?: string[]): string {
    if (!preferredLanguages || preferredLanguages.length === 0) return 'react';
    
    if (preferredLanguages.includes('JavaScript') || preferredLanguages.includes('TypeScript')) {
      return 'react';
    } else if (preferredLanguages.includes('Python')) {
      return 'flask';
    } else if (preferredLanguages.includes('PHP')) {
      return 'laravel';
    } else if (preferredLanguages.includes('Java')) {
      return 'spring';
    } else if (preferredLanguages.includes('C#')) {
      return 'dotnet';
    }
    
    return 'react'; // Default fallback
  }

  /**
   * Helper: Determine comment verbosity based on experience
   */
  private getCommentVerbosity(yearsExperience?: number): 'minimal' | 'medium' | 'verbose' {
    if (!yearsExperience || yearsExperience === 0) return 'verbose';
    if (yearsExperience <= 2) return 'verbose';
    if (yearsExperience <= 5) return 'medium';
    return 'minimal';
  }

  /**
   * Helper: Determine experience level
   */
  private getExperienceLevel(yearsExperience?: number): 'beginner' | 'intermediate' | 'advanced' {
    if (!yearsExperience || yearsExperience === 0) return 'beginner';
    if (yearsExperience <= 2) return 'beginner';
    if (yearsExperience <= 5) return 'intermediate';
    return 'advanced';
  }

  // =====================
  // PROJECTS
  // =====================

  /**
   * Create a new project
   */
  async createProject(name: string, description?: string): Promise<Project> {
    const user = await this.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.client
      .from('projects')
      .insert({
        user_id: user.id,
        name,
        description,
        is_public: false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get all projects for the current user
   */
  async getUserProjects(): Promise<Project[]> {
    const user = await this.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.client
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get a specific project
   */
  async getProject(projectId: string): Promise<Project | null> {
    const { data, error } = await this.client
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Update a project
   */
  async updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
    const { data, error } = await this.client
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete a project
   */
  async deleteProject(projectId: string) {
    const { error } = await this.client
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;
  }

  // =====================
  // PROJECT FILES
  // =====================

  /**
   * Get all files for a project
   */
  async getProjectFiles(projectId: string): Promise<ProjectFile[]> {
    const { data, error } = await this.client
      .from('project_files')
      .select('*')
      .eq('project_id', projectId)
      .order('path');

    if (error) throw error;
    return data || [];
  }

  /**
   * Get a specific file
   */
  async getProjectFile(projectId: string, filePath: string): Promise<ProjectFile | null> {
    const { data, error } = await this.client
      .from('project_files')
      .select('*')
      .eq('project_id', projectId)
      .eq('path', filePath)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Create or update a project file
   */
  async saveProjectFile(projectId: string, path: string, content: string): Promise<ProjectFile> {
    const existingFile = await this.getProjectFile(projectId, path);

    if (existingFile) {
      // Update existing file
      const { data, error } = await this.client
        .from('project_files')
        .update({ 
          content, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', existingFile.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new file
      const { data, error } = await this.client
        .from('project_files')
        .insert({
          project_id: projectId,
          path,
          content
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  /**
   * Delete a project file
   */
  async deleteProjectFile(projectId: string, filePath: string) {
    const { error } = await this.client
      .from('project_files')
      .delete()
      .eq('project_id', projectId)
      .eq('path', filePath);

    if (error) throw error;
  }

  // =====================
  // FILE STORAGE
  // =====================

  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile(bucket: string, path: string, file: File): Promise<string> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = this.client.storage
      .from(bucket)
      .getPublicUrl(path);

    return publicUrl;
  }

  /**
   * Delete a file from Supabase Storage
   */
  async deleteFile(bucket: string, path: string) {
    const { error } = await this.client.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  }

  /**
   * Get file URL from storage
   */
  getFileUrl(bucket: string, path: string): string {
    const { data } = this.client.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  // =====================
  // DEPLOYMENTS
  // =====================

  /**
   * Create a new deployment record
   */
  async createDeployment(projectId: string, url: string, status: 'pending' | 'success' | 'error' = 'pending'): Promise<ProjectDeployment> {
    const { data, error } = await this.client
      .from('project_deployments')
      .insert({
        project_id: projectId,
        url,
        status
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update deployment status
   */
  async updateDeployment(deploymentId: string, status: 'pending' | 'success' | 'error', url?: string) {
    const updates: any = { status };
    if (url) updates.url = url;

    const { data, error } = await this.client
      .from('project_deployments')
      .update(updates)
      .eq('id', deploymentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get deployments for a project
   */
  async getProjectDeployments(projectId: string): Promise<ProjectDeployment[]> {
    const { data, error } = await this.client
      .from('project_deployments')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // =====================
  // REAL-TIME SUBSCRIPTIONS
  // =====================

  /**
   * Subscribe to project file changes
   */
  subscribeToProjectFiles(projectId: string, callback: (payload: any) => void) {
    return this.client
      .channel(`project_files:${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_files',
          filter: `project_id=eq.${projectId}`
        },
        callback
      )
      .subscribe();
  }

  /**
   * Subscribe to project changes
   */
  subscribeToProject(projectId: string, callback: (payload: any) => void) {
    return this.client
      .channel(`project:${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `id=eq.${projectId}`
        },
        callback
      )
      .subscribe();
  }

  // =====================
  // UTILITY METHODS
  // =====================

  /**
   * Create Supabase client configuration file for generated projects
   */
  async createSupabaseClientFile(config: { url: string; key: string }): Promise<string> {
    const content = `
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = '${config.url}';
const supabaseKey = '${config.key}';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Auth helpers
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};

export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
`.trim();

    return content;
  }

  /**
   * Check if Supabase is properly configured
   */
  isConfigured(): boolean {
    return !!(supabaseUrl && supabaseAnonKey && 
              supabaseUrl !== 'https://placeholder.supabase.co' && 
              supabaseAnonKey !== 'placeholder-key');
  }
}

// Export singleton instance
export const supabaseService = new SupabaseService();

// Additional utility functions for Supabase configuration
export async function saveSupabaseConfig(config: { url: string; key: string }): Promise<void> {
  const response = await fetch('/api/supabase-config', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to save Supabase configuration');
  }
}

export async function createSupabaseClientFile(config: { url: string; key: string }): Promise<string> {
  return supabaseService.createSupabaseClientFile(config);
}

// Export types
export type { User, Session } from '@supabase/supabase-js';
