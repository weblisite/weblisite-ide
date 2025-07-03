import { FileService } from './fileService';

interface SupabaseProject {
  id: string;
  name: string;
  url: string;
  anon_key: string;
  service_role_key: string;
  database_url: string;
  created_at: string;
}

interface DatabaseSchema {
  tables: DatabaseTable[];
  relationships: DatabaseRelationship[];
  policies: RLSPolicy[];
  indexes: DatabaseIndex[];
  storage: StorageConfiguration;
}

interface StorageConfiguration {
  buckets: StorageBucket[];
  policies: StoragePolicy[];
  needsStorage: boolean;
  detectedFileTypes: string[];
}

interface StorageBucket {
  name: string;
  public: boolean;
  file_size_limit?: number;
  allowed_mime_types?: string[];
  description: string;
}

interface StoragePolicy {
  bucket: string;
  name: string;
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
  expression: string;
  description: string;
}

interface DatabaseTable {
  name: string;
  columns: DatabaseColumn[];
  description: string;
  isPrimary?: boolean;
}

interface DatabaseColumn {
  name: string;
  type: string;
  nullable: boolean;
  default?: string;
  description: string;
  isUnique?: boolean;
  references?: {
    table: string;
    column: string;
  };
}

interface DatabaseRelationship {
  fromTable: string;
  toTable: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  foreignKey: string;
}

interface RLSPolicy {
  table: string;
  name: string;
  command: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
  expression: string;
  description: string;
}

interface DatabaseIndex {
  table: string;
  name: string;
  columns: string[];
  unique: boolean;
}

export class SupabaseDatabaseService {
  private supabaseApiUrl = 'https://api.supabase.com/v1';
  private supabaseAccessToken: string;
  private projectId: number;
  private fileService: FileService;

  constructor(projectId: number, accessToken: string) {
    this.projectId = projectId;
    this.supabaseAccessToken = accessToken;
    this.fileService = new FileService(projectId);
  }

  /**
   * Create a new Supabase project with AI-generated description
   */
  async createSupabaseProject(projectName: string, codeAnalysis?: any): Promise<SupabaseProject> {
    try {
      // Generate AI-powered description based on codebase analysis
      const description = await this.generateProjectDescription(projectName, codeAnalysis);
      
      // For now, we'll mock a Supabase project creation
      const mockProject: SupabaseProject = {
        id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        name: projectName,
        url: `https://${projectName.toLowerCase().replace(/\s+/g, '-')}.supabase.co`,
        anon_key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake_anon_key`,
        service_role_key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake_service_role_key`,
        database_url: `postgresql://postgres:[YOUR-PASSWORD]@db.${projectName.toLowerCase().replace(/\s+/g, '-')}.supabase.co:5432/postgres`,
        created_at: new Date().toISOString()
      };

      console.log(`Created Supabase project: ${mockProject.name} (${mockProject.id})`);
      console.log(`Generated description: ${description}`);
      return mockProject;
    } catch (error) {
      console.error('Error creating Supabase project:', error);
      throw new Error('Failed to create Supabase project');
    }
  }

  /**
   * Generate AI-powered project description based on codebase analysis
   */
  private async generateProjectDescription(projectName: string, codeAnalysis?: any): Promise<string> {
    try {
      // Get all files from the project for context
      const files = await this.fileService.getFiles();
      
      // Analyze the main components and pages
      let codeContext = '';
      for (const file of files.slice(0, 5)) {
        const content = await this.fileService.getFileContent(file.path);
        codeContext += `\n// ${file.path}\n${content.slice(0, 500)}...`;
      }

      // Create a smart description based on detected patterns
      const detectedFeatures = this.analyzeCodeFeatures(codeContext);
      const description = this.generateDescriptionFromFeatures(projectName, detectedFeatures);

      return description;
    } catch (error) {
      console.error('Error generating project description:', error);
      return `A modern web application built with React, featuring database integration and user authentication.`;
    }
  }

  /**
   * Analyze code to detect key features and patterns
   */
  private analyzeCodeFeatures(codeContext: string): string[] {
    const features: string[] = [];

    // Detect UI patterns
    if (/property|real.?estate|listing/i.test(codeContext)) {
      features.push('real estate platform');
    } else if (/e.?commerce|shop|cart|product/i.test(codeContext)) {
      features.push('e-commerce platform');
    } else if (/blog|article|post|content/i.test(codeContext)) {
      features.push('content management system');
    } else if (/dashboard|admin|analytics/i.test(codeContext)) {
      features.push('admin dashboard');
    } else if (/portfolio|showcase|gallery/i.test(codeContext)) {
      features.push('portfolio website');
    }

    // Detect technical features
    if (/search|filter|query/i.test(codeContext)) {
      features.push('advanced search');
    }
    if (/auth|login|signup|user/i.test(codeContext)) {
      features.push('user authentication');
    }
    if (/upload|file|image|avatar/i.test(codeContext)) {
      features.push('file uploads');
    }

    return features;
  }

  /**
   * Generate a natural description from detected features
   */
  private generateDescriptionFromFeatures(projectName: string, features: string[]): string {
    if (features.length === 0) {
      return `${projectName} is a modern web application built with React, featuring database integration and user authentication.`;
    }

    const primaryFeature = features[0];
    const additionalFeatures = features.slice(1, 3);

    let description = `${projectName} is a comprehensive ${primaryFeature}`;

    if (additionalFeatures.length > 0) {
      const featureList = additionalFeatures.join(', ');
      description += ` with ${featureList}`;
    }

    description += '. Built with React and powered by Supabase for scalable database and authentication services.';

    return description;
  }

  /**
   * Analyze generated code to recommend database schema and storage configuration
   */
  async analyzeCodeForSchema(): Promise<DatabaseSchema> {
    try {
      const files = await this.fileService.getFiles();
      
      let combinedCode = '';
      for (const file of files) {
        const content = await this.fileService.getFileContent(file.path);
        combinedCode += `\n// File: ${file.path}\n${content}\n`;
      }

      const analysis = this.parseCodeForDataStructures(combinedCode);
      const storageAnalysis = this.analyzeStorageNeeds(combinedCode);
      
      const schema = this.generateRecommendedSchema(analysis, storageAnalysis);
      
      return schema;
    } catch (error) {
      console.error('Error analyzing code for schema:', error);
      throw new Error('Failed to analyze code for database schema');
    }
  }

  /**
   * Store environment variables
   */
  async storeEnvironmentVariables(variables: Record<string, string>, supabaseProject: SupabaseProject): Promise<void> {
    try {
      const envContent = this.generateEnvironmentFile(variables, supabaseProject);
      await this.fileService.createOrUpdateFile('.env', envContent);
      console.log('Environment variables stored successfully');
    } catch (error) {
      console.error('Error storing environment variables:', error);
      throw new Error('Failed to store environment variables');
    }
  }

  // Helper methods
  private parseCodeForDataStructures(code: string): any {
    return {
      hasAuth: /auth|login|signup|user/i.test(code),
      hasSearch: /search|filter|query/i.test(code),
      hasUpload: /upload|file|image/i.test(code)
    };
  }

  private generateRecommendedSchema(analysis: any, storageAnalysis: any): DatabaseSchema {
    const tables: DatabaseTable[] = [];
    const policies: RLSPolicy[] = [];
    const indexes: DatabaseIndex[] = [];
    const relationships: DatabaseRelationship[] = [];

    if (analysis.hasAuth) {
      tables.push({
        name: 'profiles',
        description: 'User profiles and additional user data',
        columns: [
          { name: 'id', type: 'uuid', nullable: false, description: 'Primary key, references auth.users' },
          { name: 'email', type: 'text', nullable: false, description: 'User email address' },
          { name: 'full_name', type: 'text', nullable: true, description: 'User full name' },
          { name: 'avatar_url', type: 'text', nullable: true, description: 'User avatar URL' },
          { name: 'created_at', type: 'timestamp', nullable: false, default: 'now()', description: 'Profile creation timestamp' }
        ]
      });

      policies.push({
        table: 'profiles',
        name: 'Users can view own profile',
        command: 'SELECT',
        expression: 'auth.uid() = id',
        description: 'Allow users to view their own profile'
      });
    }

    const storage: StorageConfiguration = {
      ...storageAnalysis,
      buckets: storageAnalysis.buckets || [],
      policies: storageAnalysis.policies || []
    };

    return { tables, relationships, policies, indexes, storage };
  }

  private analyzeStorageNeeds(code: string): any {
    const buckets: StorageBucket[] = [];
    const policies: StoragePolicy[] = [];

    if (/upload|file|image|avatar/i.test(code)) {
      buckets.push({
        name: 'avatars',
        public: true,
        file_size_limit: 5 * 1024 * 1024,
        allowed_mime_types: ['image/jpeg', 'image/png', 'image/gif'],
        description: 'User avatar images'
      });

      policies.push({
        bucket: 'avatars',
        name: 'Allow users to upload own avatar',
        operation: 'INSERT',
        expression: 'auth.uid()::text = (storage.foldername(name))[1]',
        description: 'Users can upload avatars to their own folder'
      });
    }

    if (/image|photo|gallery/i.test(code)) {
      buckets.push({
        name: 'images',
        public: true,
        file_size_limit: 10 * 1024 * 1024,
        allowed_mime_types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        description: 'General image uploads'
      });
    }

    return {
      buckets,
      policies,
      needsStorage: buckets.length > 0,
      detectedFileTypes: []
    };
  }

  private generateEnvironmentFile(variables: Record<string, string>, supabaseProject: SupabaseProject): string {
    let content = `# Supabase Configuration
VITE_SUPABASE_URL=${supabaseProject.url}
VITE_SUPABASE_ANON_KEY=${supabaseProject.anon_key}
SUPABASE_SERVICE_ROLE_KEY=${supabaseProject.service_role_key}

# Additional Environment Variables
`;

    for (const [key, value] of Object.entries(variables)) {
      content += `${key}=${value}\n`;
    }

    return content;
  }
} 