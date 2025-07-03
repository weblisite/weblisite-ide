import React, { useState, useEffect } from 'react';
import { useWeblisite } from '../context/WeblisiteContext';
import { io } from 'socket.io-client';

interface DatabaseSchema {
  tables: DatabaseTable[];
  relationships: DatabaseRelationship[];
  policies: RLSPolicy[];
  indexes: DatabaseIndex[];
  storage: StorageConfiguration;
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

interface SupabaseProject {
  id: string;
  name: string;
  url: string;
  anon_key: string;
  service_role_key: string;
  database_url: string;
  created_at: string;
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

type DatabaseStep = 'check' | 'configure' | 'analyze' | 'review' | 'provision' | 'generate' | 'complete' | 'error';

const DatabaseIntegrationModal: React.FC = () => {
  const { 
    isDatabaseIntegrationModalOpen, 
    setIsDatabaseIntegrationModalOpen,
    supabaseProject,
    setSupabaseProject,
    databaseSchema,
    setDatabaseSchema,
    isDatabaseConnected,
    setIsDatabaseConnected
  } = useWeblisite();

  const [currentStep, setCurrentStep] = useState<DatabaseStep>('check');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');

  // Configuration form state
  const [projectName, setProjectName] = useState('');
  const [supabaseAccessToken, setSupabaseAccessToken] = useState('');
  const [environmentVariables, setEnvironmentVariables] = useState<Record<string, string>>({});
  const [newEnvKey, setNewEnvKey] = useState('');
  const [newEnvValue, setNewEnvValue] = useState('');

  // Schema review state
  const [reviewedSchema, setReviewedSchema] = useState<DatabaseSchema | null>(null);

  useEffect(() => {
    if (!isDatabaseIntegrationModalOpen) {
      // Reset state when modal is closed
      setCurrentStep('check');
      setLoading(false);
      setError(null);
      setProgress(0);
      setProgressMessage('');
      setProjectName('');
      setSupabaseAccessToken('');
      setEnvironmentVariables({});
      setReviewedSchema(null);
    }
  }, [isDatabaseIntegrationModalOpen]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!isDatabaseIntegrationModalOpen) return;

    const socket = io();

    socket.on('database-step', (data: { step: number; message: string; total: number }) => {
      setProgress((data.step / data.total) * 100);
      setProgressMessage(data.message);
    });

    socket.on('database-integration-complete', (data: { project: SupabaseProject; schema: DatabaseSchema }) => {
      setSupabaseProject(data.project);
      setDatabaseSchema(data.schema);
      setIsDatabaseConnected(true);
      setCurrentStep('complete');
      setLoading(false);
      setProgress(100);
      setProgressMessage('Database integration completed successfully!');
    });

    socket.on('database-integration-error', (data: { message: string }) => {
      setError(data.message);
      setCurrentStep('error');
      setLoading(false);
      setProgress(0);
      setProgressMessage('');
    });

    return () => {
      socket.disconnect();
    };
  }, [isDatabaseIntegrationModalOpen, setSupabaseProject, setDatabaseSchema, setIsDatabaseConnected]);

  const handleClose = () => {
    setIsDatabaseIntegrationModalOpen(false);
  };

  const handleNext = async () => {
    if (currentStep === 'check') {
      setCurrentStep('configure');
    } else if (currentStep === 'configure') {
      if (!projectName || !supabaseAccessToken) {
        setError('Please provide project name and Supabase access token');
        return;
      }
      await handleAnalyzeSchema();
    } else if (currentStep === 'analyze') {
      setCurrentStep('review');
    } else if (currentStep === 'review') {
      await handleCompleteIntegration();
    }
  };

  const handleAnalyzeSchema = async () => {
    setLoading(true);
    setError(null);
    setCurrentStep('analyze');
    setProgressMessage('Analyzing your code for database schema...');

    try {
      const response = await fetch('/api/database/analyze-schema', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: supabaseAccessToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze schema');
      }

      const data = await response.json();
      setReviewedSchema(data.schema);
      setCurrentStep('review');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      setCurrentStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteIntegration = async () => {
    setLoading(true);
    setError(null);
    setCurrentStep('provision');
    setProgress(0);
    setProgressMessage('Starting database integration...');

    try {
      const response = await fetch('/api/database/complete-integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName,
          accessToken: supabaseAccessToken,
          environmentVariables,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to start integration');
      }

      // The rest will be handled by WebSocket events
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      setCurrentStep('error');
      setLoading(false);
    }
  };

  const addEnvironmentVariable = () => {
    if (newEnvKey && newEnvValue) {
      setEnvironmentVariables(prev => ({
        ...prev,
        [newEnvKey]: newEnvValue
      }));
      setNewEnvKey('');
      setNewEnvValue('');
    }
  };

  const removeEnvironmentVariable = (key: string) => {
    setEnvironmentVariables(prev => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const handleRetry = () => {
    setError(null);
    setCurrentStep('check');
    setProgress(0);
    setProgressMessage('');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'check':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready for Database Integration</h3>
              <p className="text-gray-600">
                Connect your generated code to a Supabase database for full-stack functionality.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">What this will do:</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Analyze your generated code for optimal database schema</li>
                      <li>Detect file upload needs and create storage buckets</li>
                      <li>Create a new Supabase project with proper security policies</li>
                      <li>Generate database-connected React hooks and API endpoints</li>
                      <li>Create file upload components and storage utilities</li>
                      <li>Set up authentication and user management</li>
                      <li>Create TypeScript types for type-safe database operations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Get Started
              </button>
            </div>
          </div>
        );

      case 'configure':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Configure Database Integration</h3>
              <p className="text-gray-600">
                Set up your Supabase project and environment variables.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="My Awesome App"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supabase Access Token *
                </label>
                <input
                  type="password"
                  value={supabaseAccessToken}
                  onChange={(e) => setSupabaseAccessToken(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Supabase access token"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  You can find this in your Supabase dashboard under Settings → API
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Environment Variables
                </label>
                <div className="space-y-2">
                  {Object.entries(environmentVariables).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{key}</span>
                      <span className="text-sm text-gray-600">=</span>
                      <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded flex-1">{value}</span>
                      <button
                        onClick={() => removeEnvironmentVariable(key)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newEnvKey}
                      onChange={(e) => setNewEnvKey(e.target.value)}
                      placeholder="Variable name"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={newEnvValue}
                      onChange={(e) => setNewEnvValue(e.target.value)}
                      placeholder="Variable value"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                    />
                    <button
                      onClick={addEnvironmentVariable}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep('check')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!projectName || !supabaseAccessToken}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Analyze Code
              </button>
            </div>
          </div>
        );

      case 'analyze':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing Your Code</h3>
              <p className="text-gray-600">
                Our AI is analyzing your generated code to recommend the optimal database schema...
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="text-center">
                <div className="text-sm text-blue-800 mb-2">Analysis Progress</div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-blue-700 mt-2">{progressMessage}</div>
              </div>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Recommended Schema</h3>
              <p className="text-gray-600">
                Based on your code analysis, here's the recommended database schema:
              </p>
            </div>

            {reviewedSchema && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Database Tables ({reviewedSchema.tables.length})</h4>
                  <div className="space-y-3">
                    {reviewedSchema.tables.map((table, index) => (
                      <div key={index} className="border border-gray-200 rounded-md p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{table.name}</h5>
                          {table.isPrimary && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Primary</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{table.description}</p>
                        <div className="text-sm">
                          <div className="font-medium text-gray-700 mb-1">Columns:</div>
                          <div className="grid grid-cols-1 gap-1">
                            {table.columns.map((col, colIndex) => (
                              <div key={colIndex} className="flex items-center space-x-2 text-xs">
                                <span className="font-mono bg-gray-100 px-2 py-1 rounded">{col.name}</span>
                                <span className="text-gray-500">{col.type}</span>
                                {!col.nullable && <span className="text-red-500">NOT NULL</span>}
                                {col.isUnique && <span className="text-blue-500">UNIQUE</span>}
                                {col.references && (
                                  <span className="text-green-500">→ {col.references.table}.{col.references.column}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Security Policies ({reviewedSchema.policies.length})</h4>
                  <div className="space-y-2">
                    {reviewedSchema.policies.map((policy, index) => (
                      <div key={index} className="text-sm bg-gray-50 p-3 rounded-md">
                        <div className="font-medium text-gray-900">{policy.name}</div>
                        <div className="text-gray-600">{policy.description}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {policy.command} on {policy.table}: {policy.expression}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {reviewedSchema.storage.needsStorage && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                      Storage Buckets ({reviewedSchema.storage.buckets.length})
                    </h4>
                    <div className="bg-purple-50 border border-purple-200 rounded-md p-3 mb-3">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-purple-800">
                          File upload capabilities detected in your code. These storage buckets will be created:
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {reviewedSchema.storage.buckets.map((bucket, index) => (
                        <div key={index} className="border border-purple-200 rounded-md p-4 bg-purple-50">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900">{bucket.name}</h5>
                            <div className="flex items-center space-x-2">
                              {bucket.public ? (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Public</span>
                              ) : (
                                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Private</span>
                              )}
                              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                {bucket.file_size_limit ? `${Math.round(bucket.file_size_limit / 1024 / 1024)}MB limit` : 'No limit'}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{bucket.description}</p>
                          {bucket.allowed_mime_types && bucket.allowed_mime_types.length > 0 && (
                            <div className="text-xs">
                              <span className="font-medium text-gray-700">Allowed file types: </span>
                              <span className="text-gray-600">
                                {bucket.allowed_mime_types.map(type => type.split('/')[1]).join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3">
                      <h5 className="font-medium text-gray-900 mb-2">Storage Policies ({reviewedSchema.storage.policies.length})</h5>
                      <div className="space-y-2">
                        {reviewedSchema.storage.policies.map((policy, index) => (
                          <div key={index} className="text-sm bg-purple-50 p-3 rounded-md border border-purple-200">
                            <div className="font-medium text-gray-900">{policy.name}</div>
                            <div className="text-gray-600">{policy.description}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {policy.operation} on bucket '{policy.bucket}': {policy.expression}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep('configure')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Database
              </button>
            </div>
          </div>
        );

      case 'provision':
      case 'generate':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Setting Up Your Database</h3>
              <p className="text-gray-600">
                Creating your Supabase project and generating database-connected code...
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="text-center">
                <div className="text-sm text-blue-800 mb-2">Setup Progress</div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-blue-700 mt-2">{progressMessage}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                <div className="font-medium">This process includes:</div>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>Creating your Supabase project</li>
                  <li>Provisioning database schema with security policies</li>
                  <li>Setting up storage buckets for file uploads</li>
                  <li>Generating React hooks for database operations</li>
                  <li>Creating file upload utilities and components</li>
                  <li>Creating TypeScript types for type safety</li>
                  <li>Setting up authentication components</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Database Integration Complete!</h3>
              <p className="text-gray-600">
                Your Supabase database has been successfully integrated with your code.
              </p>
            </div>

            {supabaseProject && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h4 className="font-medium text-green-900 mb-3">Your Supabase Project</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Name:</strong> {supabaseProject.name}</div>
                  <div><strong>URL:</strong> <a href={supabaseProject.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{supabaseProject.url}</a></div>
                  <div><strong>Project ID:</strong> {supabaseProject.id}</div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                <div className="font-medium mb-2">What's been created:</div>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Database schema with security policies</li>
                  <li>Storage buckets for file uploads with access policies</li>
                  <li>React hooks for database operations in <code className="bg-gray-100 px-1 rounded">hooks/</code></li>
                  <li>Storage utilities and file upload hooks in <code className="bg-gray-100 px-1 rounded">lib/storage.ts</code></li>
                  <li>File upload components in <code className="bg-gray-100 px-1 rounded">components/FileUpload.tsx</code></li>
                  <li>TypeScript types in <code className="bg-gray-100 px-1 rounded">types/database.ts</code></li>
                  <li>Supabase client setup in <code className="bg-gray-100 px-1 rounded">lib/supabase.ts</code></li>
                  <li>Authentication components in <code className="bg-gray-100 px-1 rounded">components/auth/</code></li>
                  <li>Environment configuration files</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Next Steps:</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Update your <code className="bg-yellow-100 px-1 rounded">.env</code> file with the provided Supabase credentials</li>
                      <li>Install the Supabase client: <code className="bg-yellow-100 px-1 rounded">npm install @supabase/supabase-js</code></li>
                      <li>Test your database connection using the generated hooks</li>
                      <li>Deploy your updated code to production</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Integration Failed</h3>
              <p className="text-gray-600">
                There was an error setting up your database integration.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <h4 className="font-medium text-red-900 mb-2">Error Details</h4>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex justify-center space-x-3">
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Try Again
              </button>
              <button
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isDatabaseIntegrationModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Database Integration</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default DatabaseIntegrationModal; 