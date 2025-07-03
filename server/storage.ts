import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

import { 
  type User, type InsertUser,
  type Project, type InsertProject,
  type File, type InsertFile, 
  type Deployment, type InsertDeployment,
  SupabaseConfig
} from "@shared/schema";
import { createClient } from '@supabase/supabase-js';

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateStripeCustomerId(userId: string, customerId: string): Promise<User>;
  updateUserStripeInfo(userId: string, info: { customerId: string, subscriptionId: string }): Promise<User>;

  // Project operations
  createProject(project: InsertProject): Promise<Project>;
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByUserId(userId: number): Promise<Project[]>;

  // File operations
  createFile(file: InsertFile): Promise<File>;
  updateFile(id: number, content: string): Promise<File>;
  getFileById(id: number): Promise<File | undefined>;
  getFileByPath(projectId: number, path: string): Promise<File | undefined>;
  getFilesByProjectId(projectId: number): Promise<File[]>;

  // Deployment operations
  createDeployment(deployment: InsertDeployment): Promise<Deployment>;
  getDeploymentsByProjectId(projectId: number): Promise<Deployment[]>;
  
  // Supabase config
  saveSupabaseConfig(projectId: number, config: SupabaseConfig): Promise<void>;
  getSupabaseConfig(projectId: number): Promise<SupabaseConfig | undefined>;
}

export class SupabaseStorage implements IStorage {
  private supabase;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration:');
      console.error('SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
      console.error('SUPABASE_SERVICE_KEY:', supabaseServiceKey ? '✓ Set' : '✗ Missing');
      throw new Error('Supabase configuration is missing. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.');
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('✅ SupabaseStorage initialized successfully');
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return undefined; // Not found
      throw new Error(`Error fetching user: ${error.message}`);
    }

    return data;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return undefined; // Not found
      throw new Error(`Error fetching user by username: ${error.message}`);
    }

    return data;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .insert({
        username: insertUser.username,
        password: insertUser.password,
        email: insertUser.email || null,
        stripe_customer_id: null,
        stripe_subscription_id: null
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }

    return data;
  }

  async updateStripeCustomerId(userId: number, customerId: string): Promise<User> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating Stripe customer ID: ${error.message}`);
    }

    return data;
  }

  async updateUserStripeInfo(userId: number, info: { customerId: string, subscriptionId: string }): Promise<User> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .update({ 
        stripe_customer_id: info.customerId,
        stripe_subscription_id: info.subscriptionId 
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating user Stripe info: ${error.message}`);
    }

    return data;
  }

  // Project operations
  async createProject(insertProject: InsertProject): Promise<Project> {
    const { data, error } = await this.supabase
      .from('projects')
      .insert({
        user_id: insertProject.user_id,
        name: insertProject.name
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating project: ${error.message}`);
    }

    return data;
  }

  async getProject(id: number): Promise<Project | undefined> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return undefined; // Not found
      throw new Error(`Error fetching project: ${error.message}`);
    }

    return data;
  }

  async getProjectsByUserId(userId: number): Promise<Project[]> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching projects by user ID: ${error.message}`);
    }

    return data || [];
  }

  // File operations
  async createFile(insertFile: InsertFile): Promise<File> {
    const { data, error } = await this.supabase
      .from('project_files')
      .insert({
        project_id: insertFile.project_id,
        path: insertFile.path,
        content: insertFile.content
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating file: ${error.message}`);
    }

    return data;
  }

  async updateFile(id: number, content: string): Promise<File> {
    const { data, error } = await this.supabase
      .from('project_files')
      .update({ 
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating file: ${error.message}`);
    }

    return data;
  }

  async getFileById(id: number): Promise<File | undefined> {
    const { data, error } = await this.supabase
      .from('project_files')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return undefined; // Not found
      throw new Error(`Error fetching file by ID: ${error.message}`);
    }

    return data;
  }

  async getFileByPath(projectId: number, path: string): Promise<File | undefined> {
    const { data, error } = await this.supabase
      .from('project_files')
      .select('*')
      .eq('project_id', projectId)
      .eq('path', path)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return undefined; // Not found
      throw new Error(`Error fetching file by path: ${error.message}`);
    }

    return data;
  }

  async getFilesByProjectId(projectId: number): Promise<File[]> {
    const { data, error } = await this.supabase
      .from('project_files')
      .select('*')
      .eq('project_id', projectId)
      .order('path');

    if (error) {
      throw new Error(`Error fetching files by project ID: ${error.message}`);
    }

    return data || [];
  }

  // Deployment operations
  async createDeployment(insertDeployment: InsertDeployment): Promise<Deployment> {
    const { data, error } = await this.supabase
      .from('project_deployments')
      .insert({
        project_id: insertDeployment.project_id,
        url: insertDeployment.url,
        status: insertDeployment.status
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating deployment: ${error.message}`);
    }

    return data;
  }

  async getDeploymentsByProjectId(projectId: number): Promise<Deployment[]> {
    const { data, error } = await this.supabase
      .from('project_deployments')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching deployments by project ID: ${error.message}`);
    }

    return data || [];
  }

  // Supabase config - Store in a separate config table
  async saveSupabaseConfig(projectId: number, config: SupabaseConfig): Promise<void> {
    const { error } = await this.supabase
      .from('project_configs')
      .upsert({
        project_id: projectId,
        config_type: 'supabase',
        config_data: config
      });

    if (error) {
      throw new Error(`Error saving Supabase config: ${error.message}`);
    }
  }

  async getSupabaseConfig(projectId: number): Promise<SupabaseConfig | undefined> {
    const { data, error } = await this.supabase
      .from('project_configs')
      .select('config_data')
      .eq('project_id', projectId)
      .eq('config_type', 'supabase')
      .single();

    if (error) {
      if (error.code === 'PGRST116') return undefined; // Not found
      throw new Error(`Error fetching Supabase config: ${error.message}`);
    }

    return data?.config_data;
  }
}

// Choose storage implementation based on environment
const createStorage = (): IStorage => {
  const useSupabase = process.env.NODE_ENV === 'production' || process.env.USE_SUPABASE === 'true';
  
  if (useSupabase) {
    try {
      return new SupabaseStorage();
    } catch (error) {
      console.error('Failed to initialize SupabaseStorage, falling back to MemStorage:', error);
      return new MemStorage();
    }
  } else {
    console.log('Using MemStorage for development (set USE_SUPABASE=true to use Supabase)');
    return new MemStorage();
  }
};

// Keep MemStorage for fallback
export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<number, Project>;
  private files: Map<number, File>;
  private deployments: Map<number, Deployment>;
  private supabaseConfigs: Map<number, SupabaseConfig>;
  userCurrentId: number;
  projectCurrentId: number;
  fileCurrentId: number;
  deploymentCurrentId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.files = new Map();
    this.deployments = new Map();
    this.supabaseConfigs = new Map();
    this.userCurrentId = 1;
    this.projectCurrentId = 1;
    this.fileCurrentId = 1;
    this.deploymentCurrentId = 1;
    console.log('📝 MemStorage initialized (development mode)');
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    
    // Ensure email is not undefined to satisfy TypeScript
    const user: User = {
      ...insertUser,
      id,
      email: insertUser.email || null, // Convert undefined to null
      stripe_customer_id: null,
      stripe_subscription_id: null
    };
    
    this.users.set(id, user);
    return user;
  }

  async updateStripeCustomerId(userId: number, customerId: string): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error(`User with ID ${userId} not found`);
    
    const updatedUser = { ...user, stripe_customer_id: customerId };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateUserStripeInfo(userId: number, info: { customerId: string, subscriptionId: string }): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error(`User with ID ${userId} not found`);
    
    const updatedUser = { 
      ...user, 
      stripe_customer_id: info.customerId,
      stripe_subscription_id: info.subscriptionId
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Project operations
  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectCurrentId++;
    const now = new Date().toISOString();
    const project: Project = { 
      ...insertProject, 
      id,
      created_at: now,
      updated_at: now
    };
    this.projects.set(id, project);
    return project;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByUserId(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(project => project.user_id === userId);
  }

  // File operations
  async createFile(insertFile: InsertFile): Promise<File> {
    const id = this.fileCurrentId++;
    const now = new Date().toISOString();
    const file: File = {
      ...insertFile,
      id,
      updated_at: now
    };
    this.files.set(id, file);
    return file;
  }

  async updateFile(id: number, content: string): Promise<File> {
    const file = await this.getFileById(id);
    if (!file) throw new Error(`File with ID ${id} not found`);
    
    const updatedFile: File = {
      ...file,
      content,
      updated_at: new Date().toISOString()
    };
    this.files.set(id, updatedFile);
    return updatedFile;
  }

  async getFileById(id: number): Promise<File | undefined> {
    return this.files.get(id);
  }

  async getFileByPath(projectId: number, path: string): Promise<File | undefined> {
    return Array.from(this.files.values())
      .find(file => file.project_id === projectId && file.path === path);
  }

  async getFilesByProjectId(projectId: number): Promise<File[]> {
    return Array.from(this.files.values())
      .filter(file => file.project_id === projectId);
  }

  // Deployment operations
  async createDeployment(insertDeployment: InsertDeployment): Promise<Deployment> {
    const id = this.deploymentCurrentId++;
    const now = new Date().toISOString();
    const deployment: Deployment = {
      ...insertDeployment,
      id,
      created_at: now
    };
    this.deployments.set(id, deployment);
    return deployment;
  }

  async getDeploymentsByProjectId(projectId: number): Promise<Deployment[]> {
    return Array.from(this.deployments.values())
      .filter(deployment => deployment.project_id === projectId);
  }
  
  // Supabase config
  async saveSupabaseConfig(projectId: number, config: SupabaseConfig): Promise<void> {
    this.supabaseConfigs.set(projectId, config);
  }
  
  async getSupabaseConfig(projectId: number): Promise<SupabaseConfig | undefined> {
    return this.supabaseConfigs.get(projectId);
  }
}

export const storage = createStorage();

// Initialize demo data if using MemStorage
if (storage instanceof MemStorage) {
  // Create a demo project without initial files
  (async () => {
    try {
      // Create a demo user
      const user = await storage.createUser({
        username: 'demo',
        password: 'password123',
        email: 'demo@example.com'
      });
      
      // Create a demo project
      const project = await storage.createProject({
        user_id: user.id,
        name: 'Demo Project'
      });
      
      // No initial files are created - users will start with a clean slate
      
      console.log('Demo project created successfully (clean slate)');
    } catch (error) {
      console.error('Error creating demo project:', error);
    }
  })();
}
