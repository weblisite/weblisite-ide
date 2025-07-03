import fs from 'fs/promises';
import path from 'path';
import { Project } from '@shared/schema';
import Anthropic from '@anthropic-ai/sdk';
import { emitFileCreated, emitFileContent, emitFileGenerated, emitGenerationComplete } from '../utils/websocket';
import { FileService } from './fileService';
import { syntaxValidator } from '../utils/syntaxValidator';

// This service provides an interface to the Claude AI model via Anthropic's SDK
export class AIService {
  private tempDir: string = path.join(process.cwd(), 'temp');
  private anthropic: Anthropic;
  private fileService: FileService;
  private MODEL = 'claude-sonnet-4-20250514'; // Claude 4 Sonnet - the latest model
  private userPreferences: any = null; // Store user preferences for personalized code generation
  
  constructor(private projectId: number, userPreferences?: any) {
    // Ensure temp directory exists
    this.ensureTempDir();
    
    // Initialize FileService
    this.fileService = new FileService(projectId);
    
    // Store user preferences for personalized code generation
    this.userPreferences = userPreferences;
    
    // Initialize Anthropic client
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set. Code generation requires a valid API key.');
      this.anthropic = null as any;
    } else {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
      
      console.log("AIService initialized with Claude 4 Sonnet" + (userPreferences ? " with user preferences" : ""));
    }
  }
  
  private async ensureTempDir(): Promise<void> {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Error creating temp directory:', error);
    } finally {
      // Any cleanup code here if needed
    }
  }
  
  /**
   * Generate code based on user prompt using Claude 4 Sonnet
   */
  async generateCode(prompt: string): Promise<{ path: string; content: string }[]> {
    console.log(`Generating code for prompt: ${prompt}`);
    
    // Prepare project directory by removing existing files
    await this.clearProjectDirectory();
    
    // Check for Anthropic API key
    if (!this.anthropic) {
      console.error('ANTHROPIC_API_KEY is required for code generation');
      throw new Error('Anthropic API key is required. Please set the ANTHROPIC_API_KEY environment variable.');
    }
    
    try {
      // Enhance the prompt with specific instructions for code generation
      const enhancedPrompt = this.createCodeGenerationPrompt(prompt);
      
      // Call Claude 4 Sonnet to generate code with streaming to avoid timeout
      console.log("Calling Claude 4 Sonnet API with streaming...");
      
      // Create streaming request without any timeout
      try {
        // No timeout - let the API call run as long as needed
        const controller = new AbortController();
        
        // Create and execute the stream - TypeScript definition might be out of date
        const stream = await this.anthropic.messages.stream({
          // signal: controller.signal, - commented out due to TypeScript errors
          model: this.MODEL,
          max_tokens: 32000, // Set to a reliable limit that works consistently
          system: `You are a senior software developer specializing in React and TypeScript. Your task is to generate a COMPLETE, production-ready React application based on the user's prompt. You MUST include ALL required files for the application to work.

CRITICAL REQUIREMENTS - YOU MUST FOLLOW THESE EXACTLY:

1. YOU MUST GENERATE ALL THESE MANDATORY FILES - THE APPLICATION WILL NOT FUNCTION WITHOUT THEM:
   - main.jsx or main.tsx (entry point file)
   - App.jsx or App.tsx (main component)
   - index.css (with Tailwind imports)
   - index.html (proper HTML structure)
   - package.json (with all dependencies)
   - vite.config.js or vite.config.ts
   - postcss.config.js
   - tailwind.config.js
   
2. YOU MUST INCLUDE:
   - At least 3-5 component files (in src/components/)
   - At least 2-3 page files (in src/pages/)
   - Basic routing setup with React Router
   - Simple Tailwind CSS styling
   - Basic responsive design

3. SYNTAX AND EXPORT REQUIREMENTS - ABSOLUTELY CRITICAL:
   - ALWAYS use explicit "export default ComponentName;" at the end of every component file
   - NEVER use inline exports like "export default function ComponentName()"
   - Follow this pattern for ALL components: "function ComponentName() {...}; export default ComponentName;"
   - VERIFY all JSX has properly closed tags and balanced brackets/parentheses
   - CHECK all object literals have proper comma placement (no trailing commas in older JS versions)
   - ENSURE all imports are correct with proper paths
   - VALIDATE all JavaScript syntax before completing each file - look for missing semicolons, unbalanced brackets
   - RUN a mental linter over your code and fix any potential syntax errors
   - TEST your mental model of the code execution to catch logical errors

4. FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

File: main.jsx
\`\`\`jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
\`\`\`

File: src/components/ExampleComponent.jsx
\`\`\`jsx
import React from 'react';

function ExampleComponent() {
  return (
    <div>Example Component</div>
  );
}

// Always use this explicit export default pattern for ALL components
export default ExampleComponent;
\`\`\`

5. CONFIRMATION CHECKLIST - CHECK THIS BEFORE RESPONDING:
   - Have I included ALL mandatory files listed in point #1?
   - Have I created at least 3-5 component files?
   - Have I created at least 2-3 page files?
   - Have I set up basic routing?
   - Have I included basic Tailwind CSS styling?
   - Have I formatted all files with the "File: path" format?
   - Have I included explicit "export default ComponentName;" at the end of every component file?
   - Have I verified all files for proper syntax (no missing brackets, semicolons, commas)?
   - Are all JSX elements properly closed with matching tags?
   - Are all object properties correctly formatted with proper commas?
   - Have I checked import paths to ensure they correctly point to the right locations?
   - Have I confirmed there are no syntax errors like unclosed quotes or parentheses?
   - Have I ensured proper nesting of components and function calls?

6. YOUR RESPONSE MUST INCLUDE:
   - Proper imports and dependencies
   - Modern React best practices (hooks, functional components)
   - Clean, basic code structure
   - Simple responsive design
   - Clear component organization
   - Explicit export default statements for ALL components

FAILURE TO INCLUDE ALL MANDATORY FILES AND PROPER EXPORT STATEMENTS WILL CAUSE THE APPLICATION TO BREAK. DOUBLE-CHECK YOUR WORK BEFORE RESPONDING.
`,
          messages: [
            { 
              role: 'user', 
              content: enhancedPrompt 
            }
          ],
          temperature: 0.7,
        });
        
        // Collect streamed content
        let responseText = '';
        
        // Use the websocket utilities imported at the top of the file
        // for real-time file creation and updates
        
        // Variables for streaming file creation
        let accumulatedText = "";  // Accumulated text to detect file blocks
        let inProgressFiles = new Map<string, string>(); // Files that we've started parsing but haven't completed
        let completedFiles = new Set<string>(); // Files we've completed parsing and created
        let fileCount = 0;

        // Process the stream with extra error protection
        try {
          // Real-time file parsing regex
          const fileStartRegex = /File:\s*([a-zA-Z0-9_\/.()-]+\.(tsx|jsx|ts|js|css|html|json|svg|md|jsx|js))\s*\n```/;
          const fileEndRegex = /```\s*(\n|$)/;
          
          let currentFile: { path: string, content: string } | null = null;
          let captureMode = false;
          
          for await (const chunk of stream) {
            // Safely extract text content with type checking
            if (chunk && chunk.type === 'content_block_delta' && chunk.delta && 'text' in chunk.delta && chunk.delta.text) {
              const chunkText = chunk.delta.text;
              responseText += chunkText;
              accumulatedText += chunkText;
              
              // If we're not already capturing a file, check if this chunk contains a file start
              if (!captureMode) {
                const fileStart = accumulatedText.match(fileStartRegex);
                if (fileStart) {
                  const filePath = fileStart[1].trim();
                  currentFile = { path: filePath, content: "" };
                  captureMode = true;
                  
                  // Emit file created event
                  console.log(`Started detecting file: ${filePath}`);
                  emitFileCreated({ 
                    path: filePath, 
                    name: filePath.split('/').pop() || filePath 
                  });
                  
                  // Reset accumulated text to after the file start
                  const startPos = accumulatedText.indexOf(fileStart[0]) + fileStart[0].length;
                  accumulatedText = accumulatedText.substring(startPos);
                }
              }
              
              // If we're capturing a file, check if this chunk contains the file end
              if (captureMode && currentFile) {
                const fileEnd = accumulatedText.match(fileEndRegex);
                if (fileEnd) {
                  // Extract content up to the end marker
                  const contentEndPos = accumulatedText.indexOf(fileEnd[0]);
                  const fileContent = accumulatedText.substring(0, contentEndPos);
                  currentFile.content = fileContent;
                  
                  // Emit file content line by line for typewriter effect
                  console.log(`Completed file: ${currentFile.path}`);
                  
                  // Process line by line for a better typewriter effect
                  const lines = fileContent.split('\n');
                  for (const line of lines) {
                    emitFileContent(currentFile.path, line + '\n');
                  }
                  
                  // Actually create the file immediately instead of waiting for the end
                  try {
                    const fullPath = path.join(this.tempDir, currentFile.path);
                    const dirPath = path.dirname(fullPath);
                    
                    // Ensure directory exists
                    await fs.mkdir(dirPath, { recursive: true });
                    
                    // Check if this is a JS/TS file that needs syntax validation
                    let validatedContent = fileContent;
                    const fileExt = path.extname(currentFile.path).toLowerCase();
                    if (['.js', '.jsx', '.ts', '.tsx'].includes(fileExt)) {
                      try {
                        // Perform syntax validation
                        console.log(`Validating syntax for ${currentFile.path} before saving...`);
                        validatedContent = await syntaxValidator.validateBeforeSave(currentFile.path, fileContent);
                        if (validatedContent !== fileContent) {
                          console.log(`⚠️ Syntax issues were detected and fixed in ${currentFile.path}`);
                        } else {
                          console.log(`✓ ${currentFile.path} passed syntax validation`);
                        }
                      } catch (validationError) {
                        console.error(`Error during syntax validation for ${currentFile.path}:`, validationError);
                        // Continue with original content if validation fails
                      }
                    }
                    
                    // Write the file to temp directory with validated content
                    await fs.writeFile(fullPath, validatedContent);
                    console.log(`Created file in real-time: ${currentFile.path}`);
                    
                    // Also save to the storage system via fileService
                    await this.fileService.createOrUpdateFile(currentFile.path, validatedContent);
                    console.log(`Automatically saved ${currentFile.path} to file storage`);
                  } catch (fileWriteError) {
                    console.error(`Error creating file ${currentFile.path}:`, fileWriteError);
                  }
                  
                  emitFileGenerated(currentFile.path);
                  
                  // Add to completed files
                  completedFiles.add(currentFile.path);
                  fileCount++;
                  
                  // Reset for next file
                  captureMode = false;
                  currentFile = null;
                  
                  // Trim accumulated text to after the file end
                  accumulatedText = accumulatedText.substring(contentEndPos + fileEnd[0].length);
                } else {
                  // We're still in the content of the file, continue accumulating
                  // If we accumulate content, emit it in line-by-line chunks for typewriter effect
                  if (accumulatedText.length > 0 && currentFile) {
                    // Find line breaks to send coherent lines of code
                    const lines = accumulatedText.split('\n');
                    if (lines.length > 1) {
                      // Send all complete lines except the last one, which might be incomplete
                      const completeLines = lines.slice(0, -1).join('\n') + '\n';
                      emitFileContent(currentFile.path, completeLines);
                      
                      // Keep the last potentially incomplete line in the buffer
                      accumulatedText = lines[lines.length - 1];
                      
                      // Add to our tracking map
                      const existingContent = inProgressFiles.get(currentFile.path) || "";
                      const updatedContent = existingContent + completeLines;
                      inProgressFiles.set(currentFile.path, updatedContent);
                    
                      // For larger files, periodically write partial content to disk
                      // This gives users immediate feedback as files are being generated
                      try {
                        const fullPath = path.join(this.tempDir, currentFile.path);
                        const dirPath = path.dirname(fullPath);
                        
                        // Ensure directory exists
                        await fs.mkdir(dirPath, { recursive: true });
                        
                        // Write the current partial content with a comment indicating it's incomplete
                        await fs.writeFile(
                          fullPath, 
                          updatedContent + "\n\n// File still generating... partial content\n"
                        );
                        console.log(`Updated in-progress file: ${currentFile.path}`);
                      } catch (partialWriteError) {
                        console.error(`Error writing partial file ${currentFile.path}:`, partialWriteError);
                      }
                    }
                  }
                }
              }
            }
            
            // Log progress
            if (responseText.length % 10000 === 0) {
              console.log(`Streaming in progress... received ${responseText.length} characters, detected ${fileCount} files so far.`);
            }
          }
          
          // Final checks for any remaining file content
          if (captureMode && currentFile) {
            // If we were in the middle of a file, complete it with what we have
            console.log(`Completing partial file: ${currentFile.path}`);
            currentFile.content = accumulatedText;
            
            // Emit the remaining content line by line for typewriter effect
            const lines = accumulatedText.split('\n');
            for (const line of lines) {
              emitFileContent(currentFile.path, line + '\n');
            }
            
            // Actually create the file since we're at the end
            try {
              const fullPath = path.join(this.tempDir, currentFile.path);
              const dirPath = path.dirname(fullPath);
              
              // Ensure directory exists
              await fs.mkdir(dirPath, { recursive: true });
              
              // Check if this is a JS/TS file that needs syntax validation
              let validatedContent = accumulatedText;
              const fileExt = path.extname(currentFile.path).toLowerCase();
              if (['.js', '.jsx', '.ts', '.tsx'].includes(fileExt)) {
                try {
                  // Perform syntax validation
                  console.log(`Validating syntax for ${currentFile.path} before saving...`);
                  validatedContent = await syntaxValidator.validateBeforeSave(currentFile.path, accumulatedText);
                  if (validatedContent !== accumulatedText) {
                    console.log(`⚠️ Syntax issues were detected and fixed in ${currentFile.path}`);
                  } else {
                    console.log(`✓ ${currentFile.path} passed syntax validation`);
                  }
                } catch (validationError) {
                  console.error(`Error during syntax validation for ${currentFile.path}:`, validationError);
                  // Continue with original content if validation fails
                }
              }
              
              // Write the file to temp directory with validated content
              await fs.writeFile(fullPath, validatedContent);
              console.log(`Created file from partial content: ${currentFile.path}`);
              
              // Also save to the storage system via fileService
              await this.fileService.createOrUpdateFile(currentFile.path, validatedContent);
              console.log(`Automatically saved ${currentFile.path} to file storage`);
            } catch (fileWriteError) {
              console.error(`Error creating file ${currentFile.path}:`, fileWriteError);
            }
            
            emitFileGenerated(currentFile.path);
            completedFiles.add(currentFile.path);
            fileCount++;
          }
          
          // Get the complete message at the end
          const finalMessage = await stream.finalMessage();
          console.log('Streaming completed successfully.');
          
          // Check for any remaining in-progress files and save them
          if (inProgressFiles.size > 0) {
            console.log(`Final cleanup: ${inProgressFiles.size} in-progress files to save`);
            
            // Convert Map entries to array for compatibility
            const filesArray = Array.from(inProgressFiles.entries());
            
            for (const [filePath, content] of filesArray) {
              try {
                // Create the file if it doesn't exist yet
                const fullPath = path.join(this.tempDir, filePath);
                const dirPath = path.dirname(fullPath);
                
                // Ensure directory exists
                await fs.mkdir(dirPath, { recursive: true });
                
                // Check if this is a JS/TS file that needs syntax validation
                let validatedContent = content;
                const fileExt = path.extname(filePath).toLowerCase();
                if (['.js', '.jsx', '.ts', '.tsx'].includes(fileExt)) {
                  try {
                    // Perform syntax validation
                    console.log(`Validating syntax for ${filePath} before final cleanup save...`);
                    validatedContent = await syntaxValidator.validateBeforeSave(filePath, content);
                    if (validatedContent !== content) {
                      console.log(`⚠️ Syntax issues were detected and fixed in ${filePath} during final cleanup`);
                    } else {
                      console.log(`✓ ${filePath} passed syntax validation during final cleanup`);
                    }
                  } catch (validationError) {
                    console.error(`Error during syntax validation for ${filePath}:`, validationError);
                    // Continue with original content if validation fails
                  }
                }
                
                // Write the file to temp directory with validated content
                await fs.writeFile(fullPath, validatedContent);
                console.log(`Final cleanup: Created in-progress file ${filePath}`);
                
                // Also save to the storage system via fileService
                await this.fileService.createOrUpdateFile(filePath, validatedContent);
                console.log(`Final cleanup: Saved ${filePath} to file storage`);
                
                // Emit file generated event
                emitFileGenerated(filePath);
                completedFiles.add(filePath);
              } catch (fileWriteError) {
                console.error(`Error creating file ${filePath} during final cleanup:`, fileWriteError);
              }
            }
          }
          
          emitGenerationComplete();
        } catch (streamError) {
          console.error('Error while processing stream:', streamError);
          // We'll continue with what we have so far, as long as we got some content
          if (responseText.length < 100) {
            throw new Error(`Stream processing error: ${streamError instanceof Error ? streamError.message : 'Unknown streaming error'}`);
          }
          console.log(`Continuing with partial content (${responseText.length} characters) despite streaming error`);
        } finally {
          // No timeout to clear
        }
        
        console.log('Claude response preview:', responseText.substring(0, 500) + '...');
        
        if (!responseText) {
          console.error('No text content in Claude response');
          throw new Error('Claude response did not contain any text content');
        }
        
        // Check if the response actually contains code blocks
        if (!responseText.includes('```')) {
          console.error('Claude response does not contain any code blocks');
          console.log('Full response:', responseText);
          throw new Error('Claude response did not contain any code blocks');
        }
        
        // We've been streaming files as we go, but now we'll do a final parse of the entire response
        // to make sure we didn't miss anything, especially if stream processing had issues
        const files = await this.parseClaudeResponse(responseText);
        
        // Log all generated files to help with debugging
        console.log("Final generated files:", files.map((f: { path: string; content: string }) => f.path).join(', '));
        
        // If no files were generated, throw an error
        if (files.length === 0) {
          console.error('Claude did not generate any code files');
          throw new Error('Claude did not generate any code files. Please try again with a different prompt.');
        }
        
        return files;
      } catch (innerError: any) {
        console.error('Error in Claude API call with streaming:', innerError);
        throw innerError;
      }
    } catch (error: any) {
      console.error('Error generating code with Claude:', error);
      throw new Error(`Failed to generate code with Claude: ${error.message || 'Unknown error'}`);
    } finally {
      // Final cleanup if needed
      console.log('Claude code generation operation completed');
    }
  }
  
  private async clearProjectDirectory(): Promise<void> {
    try {
      // Ensure project temp directory exists
      await fs.mkdir(this.tempDir, { recursive: true });
      
      // For a complete clean start - remove everything in the temp directory
      const allFiles = await fs.readdir(this.tempDir);
      
      for (const file of allFiles) {
        const filePath = path.join(this.tempDir, file);
        const stats = await fs.stat(filePath);
        
        if (stats.isDirectory()) {
          // Remove directory and all contents
          await fs.rm(filePath, { recursive: true, force: true });
        } else {
          // Remove individual file
          await fs.unlink(filePath);
        }
      }
      
      // Create src directory for component files
      const srcDir = path.join(this.tempDir, 'src');
      await fs.mkdir(srcDir, { recursive: true });
      
      // Create other common directories
      await fs.mkdir(path.join(srcDir, 'components'), { recursive: true });
      await fs.mkdir(path.join(srcDir, 'pages'), { recursive: true });
      await fs.mkdir(path.join(srcDir, 'assets'), { recursive: true });
      await fs.mkdir(path.join(srcDir, 'utils'), { recursive: true });
      await fs.mkdir(path.join(this.tempDir, 'public'), { recursive: true });
      
      console.log("Cleared project directory for fresh generation");
    } catch (error) {
      console.error("Failed to clear project directory:", error);
    } finally {
      // Any cleanup needed after directory operations
    }
  }
  
  /**
   * Create an enhanced prompt for code generation
   */
  private createCodeGenerationPrompt(userPrompt: string): string {
    // Generate preference-based instructions
    const preferenceInstructions = this.generatePreferenceInstructions();
    
    return `You are an expert code generation assistant. Create a React application based on this prompt:

${userPrompt}

${preferenceInstructions}

IMPORTANT: YOU MUST INCLUDE THESE MANDATORY FILES:
- main.jsx or main.tsx (entry point)
- App.jsx or App.tsx (main component)
- index.css (with Tailwind imports)
- index.html (with proper HTML structure)
- vite.config.js or vite.config.ts 
- postcss.config.js
- tailwind.config.js

CRITICAL: YOU MUST INCLUDE A PROPER package.json FILE:
- Place it at /src/package.json
- Do NOT include the word "json" at the beginning
- Must include core dependencies: react, react-dom, react-router-dom
- Make sure it has a valid, complete JSON structure with all brackets balanced
- The package.json must be properly formatted without any syntax errors

You must also include:
- 3-5 component files in src/components/
- 2-3 page files in src/pages/
- Basic routing with React Router
- Simple Tailwind CSS styling

CRITICAL REQUIREMENTS FOR ERROR-FREE CODE:

1. EXPORT STATEMENTS:
   - ALWAYS include explicit "export default ComponentName;" at the end of every component file
   - NEVER use inline export default in function declarations (like "export default function ComponentName()")
   - Use the format: "function ComponentName() {...}; export default ComponentName;"
   - Double-check ALL component files to ensure they have the export default statement

2. JSX STRUCTURE REQUIREMENTS:
   - All JSX must be enclosed in a SINGLE parent element in component returns
   - NEVER have adjacent JSX elements at the top level of a return statement
   - ALWAYS wrap multiple elements in a parent <div> or React Fragment (<>...</>)
   - Example CORRECT: return (<div><Header /><Main /><Footer /></div>);
   - Example INCORRECT: return (<Header /><Main /><Footer />);
   - Components should NEVER render multiple adjacent root elements

3. REACT ROUTER STRUCTURE:
   - In App.jsx: Ensure Routes component properly wraps all Route components
   - Route components should be self-closing with a forward slash: <Route path="/" element={<Home />} />
   - NEVER add closing tags to Route components like </Route> - this causes syntax errors
   - Example CORRECT: <Routes><Route path="/" element={<Home />} /></Routes>
   - Example INCORRECT: <Routes><Route path="/" element={<Home />}></Route></Routes>

4. SYNTAX CORRECTNESS:
   - VERIFY all JSX has properly closed tags (<Tag></Tag> or <Tag/>)
   - ENSURE balanced brackets/parentheses/braces throughout the code
   - NEVER add stray parentheses - especially after closing JSX tags
   - CHECK all object literals have proper comma placement (no trailing commas in older JS versions)
   - VALIDATE import paths to ensure they correctly point to the right locations
   - USE DOUBLE QUOTES for all string literals to avoid syntax errors from unescaped apostrophes
   - CONFIRM all string literals have matching quotes
   - INSPECT for missing semicolons in critical places
   - TEST your code mentally for any syntax errors before finalizing

5. COMPONENT STRUCTURE CHECKLIST:
   - Each component has a well-formed function declaration: function ComponentName() {...}
   - Each component has a complete return statement with proper parentheses: return (...);
   - All JSX is wrapped in a single parent element
   - There are no stray/misplaced closing tags like </div> that don't match an opening tag
   - There are no duplicate closing tags (</Tag></Tag>)
   - All self-closing tags end with /> not just >
   - The component function has its closing brace }
   - The final line is export default ComponentName; with nothing after it

6. PRE-SUBMISSION CODE REVIEW:
   - MANUALLY trace through each component's JSX structure to verify tag matching
   - CHECK for extra/stray parentheses or brackets (especially after JSX)
   - CONFIRM all component returns have a single root element
   - VERIFY no adjacent JSX elements without parent wrappers
   - ENSURE all Routes/Route structure follows React Router best practices
   - VALIDATE return statements have proper opening and closing parentheses

Before submitting EACH file, run it through this mental validation checklist to catch and fix syntax errors.

Format your files exactly like this:
File: src/main.jsx
\`\`\`jsx
// code here
\`\`\`

File: src/App.jsx
\`\`\`jsx
// Define component
function App() {
  // component logic
}

// Always include explicit export default statement
export default App;
\`\`\`

FOCUS ON THE CORE FUNCTIONALITY FIRST!`;
  }
  
  /**
   * Generate preference-based instructions for the AI prompt
   */
  private generatePreferenceInstructions(): string {
    if (!this.userPreferences) {
      return "USER PREFERENCES: Use React with modern JavaScript, Tailwind CSS, and beginner-friendly code comments.";
    }

    const profile = this.userPreferences.profile || {};
    const codeGen = this.userPreferences.code_generation || {};
    
    let instructions = "USER PREFERENCES:\n";
    
    // Language and framework preferences
    if (profile.preferred_languages && Array.isArray(profile.preferred_languages) && profile.preferred_languages.length > 0) {
      const languages = profile.preferred_languages.join(", ");
      instructions += `- Primary Languages: ${languages}\n`;
      
      // Framework selection based on languages
      if (profile.preferred_languages.includes('TypeScript')) {
        instructions += "- Use TypeScript for type safety and better development experience\n";
        instructions += "- Include proper TypeScript interfaces and type definitions\n";
      } else if (profile.preferred_languages.includes('JavaScript')) {
        instructions += "- Use modern JavaScript (ES6+) with clear syntax\n";
      }
    }
    
    // Framework preferences
    if (codeGen.default_framework) {
      instructions += `- Preferred Framework: ${codeGen.default_framework}\n`;
    }
    
    // Styling preferences
    if (codeGen.preferred_styling) {
      instructions += `- Styling Framework: ${codeGen.preferred_styling}\n`;
    }
    
    // Experience level adjustments
    if (profile.experience_level) {
      switch (profile.experience_level) {
        case 'beginner':
          instructions += "- Experience Level: Beginner - Include detailed comments explaining code logic\n";
          instructions += "- Use simple, clear patterns and avoid complex abstractions\n";
          instructions += "- Include explanatory comments for React concepts and hooks\n";
          break;
        case 'intermediate':
          instructions += "- Experience Level: Intermediate - Include moderate comments for complex logic\n";
          instructions += "- Use modern React patterns with some advanced features\n";
          break;
        case 'advanced':
          instructions += "- Experience Level: Advanced - Minimal comments, focus on clean, efficient code\n";
          instructions += "- Use advanced React patterns and performance optimizations where appropriate\n";
          break;
      }
    }
    
    // Comment verbosity
    if (codeGen.comment_verbosity) {
      switch (codeGen.comment_verbosity) {
        case 'verbose':
          instructions += "- Include detailed comments explaining each major code block and function\n";
          break;
        case 'medium':
          instructions += "- Include comments for complex logic and key functions\n";
          break;
        case 'minimal':
          instructions += "- Include only essential comments for complex or non-obvious code\n";
          break;
      }
    }
    
    // Error handling preferences
    if (codeGen.include_error_handling) {
      instructions += "- Include proper error handling and try-catch blocks where appropriate\n";
      instructions += "- Add user-friendly error messages and loading states\n";
    }
    
    // Code style preferences
    if (codeGen.code_style === 'modern') {
      instructions += "- Use modern React patterns: hooks, functional components, and contemporary best practices\n";
    }
    
    // User interests consideration
    if (profile.interests) {
      instructions += `- User Interests: ${profile.interests} - Consider incorporating relevant examples or themes\n`;
    }
    
    instructions += "\nIMPORTANT: Follow these user preferences while maintaining all the mandatory technical requirements listed below.\n";
    
    return instructions;
  }
  
  /**
   * Create a specialized prompt for error fixing
   */
  private createErrorFixingPrompt(errorMessage: string, affectedFilePath: string | null, codeContext: string): string {
    return `You are an expert debugger tasked with fixing errors in a web application. I'm going to provide you with:
1. An error message from the browser or development server
2. The code of the file that is likely causing the issue (or related files if the exact file can't be determined)
3. Context from related files that might be relevant

Please analyze the error carefully, determine the root cause, and provide a fixed version of the file.

ERROR MESSAGE:
${errorMessage}

${affectedFilePath ? `AFFECTED FILE (${affectedFilePath}):` : 'ERROR LOCATION UNKNOWN:'}
${codeContext}

Your task:
1. Identify the specific issue causing the error
2. Provide a clear explanation of what's wrong and how you're fixing it
3. Output the complete fixed version of the file (not just the part that needs changes)

CRITICAL REQUIREMENTS FOR CODE QUALITY:
1. FOR REACT COMPONENTS:
   - ALWAYS use explicit "export default ComponentName;" at the end
   - NEVER use inline exports like "export default function ComponentName()"
   - Follow this pattern for ALL components: "function ComponentName() {...}; export default ComponentName;"
   - This is absolutely required for the application to function correctly

2. FOR SYNTAX CORRECTNESS:
   - Verify all JSX has properly closed tags (<Tag></Tag> or <Tag/>)
   - Ensure balanced brackets/parentheses/braces throughout the code
   - Check for proper comma placement in object literals and arrays
   - USE DOUBLE QUOTES for all string literals to avoid syntax errors from unescaped apostrophes (e.g., "I've been here" instead of 'I've been here')
   - Confirm all string literals have matching quotes
   - Validate import paths to ensure they're correctly pointing to the right files
   - Make sure all required dependencies are imported
   - Check for missing semicolons where needed
   - Verify proper indentation and code structure

3. MANDATORY INSTRUCTIONS FOR ALL CODE FIXES:
   - Always include a closing brace } for every function or component definition. This ensures that every function block is properly closed, preventing errors like SyntaxError: Unexpected token due to incomplete code.
   - Ensure every React component has a complete return statement with matching parentheses. For example, use return ( <div>Content</div> ); to avoid errors from missing or mismatched parentheses.
   - Verify that all JSX tags are properly closed. Every opening tag (e.g., <div>) must have a matching closing tag (e.g., </div>), and self-closing tags (e.g., <img />) should be correctly formatted.
   - Include an export default statement for components intended to be used in other files. For example, add export default ComponentName; at the end of the file to ensure the component can be imported correctly without errors.
   - Check for and remove any stray characters or extra code after the component's closing brace. Ensure there are no unnecessary characters, tags, or code snippets that could cause syntax errors.
   - Ensure the file ends with the export statement and no additional code follows. This prevents unexpected tokens or syntax issues after the component definition.

These checks are absolutely critical - many errors are caused by simple syntax issues

Please output the fixed code in the following format:

File: <path>
\`\`\`<extension>
<complete fixed code>
\`\`\`

Make sure your fix addresses the root cause of the error while maintaining the original functionality and style of the code.`;
  }
  
  /**
   * Fix errors in code based on error message
   */
  async fixError(errorMessage: string): Promise<{ path: string; content: string }[]> {
    try {
      console.log(`Attempting to fix error: ${errorMessage.substring(0, 150)}...`);
      
      // Try to determine which file is causing the error
      const affectedFilePath = this.extractAffectedFilePath(errorMessage);
      console.log(`Detected affected file: ${affectedFilePath || 'Unknown'}`);
      
      // Get code context - either the specific file or a summary of project files
      const codeContext = await this.getCodeContext(affectedFilePath);
      
      // Create a specialized prompt for error fixing
      const prompt = this.createErrorFixingPrompt(errorMessage, affectedFilePath, codeContext);
      
      // Get Claude's response
      const response = await this.anthropic.messages.create({
        model: this.MODEL,
        max_tokens: 4000,
        messages: [
          { role: 'user', content: prompt }
        ],
      });
      
      // Parse Claude's response to extract files
      // Handle the response content safely
      const contentBlock = response.content[0];
      let responseText = '';
      
      // Check if the content block has text property (TextBlock type)
      if (contentBlock && typeof contentBlock === 'object' && 'type' in contentBlock) {
        if (contentBlock.type === 'text') {
          responseText = contentBlock.text;
        }
      }
      
      // Get the parsed files using our async method
      const parsedFiles = await this.parseClaudeResponse(responseText);
      
      // Log the results
      if (parsedFiles.length > 0) {
        console.log(`Claude provided fixes for ${parsedFiles.length} files`);
        for (const file of parsedFiles) {
          console.log(`Fixed file: ${file.path}`);
        }
      } else {
        console.log(`No fixed files found in Claude's response. Raw response (first 200 chars): ${responseText.substring(0, 200)}...`);
      }
      
      return parsedFiles;
    } catch (error) {
      console.error('Error fixing code:', error);
      throw error;
    }
  }
  
  /**
   * Extract the affected file path from an error message
   */
  private extractAffectedFilePath(errorMessage: string): string | null {
    try {
      // Common patterns in error messages that reference file paths
      const patterns = [
        // React/Vite error format: "src/components/Button.jsx"
        /["']([^"']+\.(jsx|tsx|js|ts|css))["']/,
        // Path with line number: src/components/Button.jsx:10:5
        /(?:^|\s)([a-zA-Z0-9_\-/.]+\.(jsx|tsx|js|ts|css))(?::\d+:\d+)?/,
        // Module not found errors
        /(?:Cannot find module|Failed to resolve module|Module not found)[^'"]+'([^']+)'/i,
        // Import errors 
        /(?:import|export)[^'"]+'([^']+)'/
      ];
      
      for (const pattern of patterns) {
        const match = errorMessage.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
      }
      
      // Check if error mentions a specific component name
      const componentMatch = errorMessage.match(/(?:component|Component|element)\s+([A-Z][a-zA-Z0-9]+)/);
      if (componentMatch && componentMatch[1]) {
        const componentName = componentMatch[1];
        // Look for component files in common locations
        return `src/components/${componentName}.jsx`;
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting file path from error message:', error);
      return null;
    }
  }
  
  /**
   * Get code context for error fixing
   */
  private async getCodeContext(affectedFilePath: string | null): Promise<string> {
    try {
      if (affectedFilePath) {
        try {
          // Try to get the specific file's content
          const fullPath = path.join(this.tempDir, affectedFilePath);
          if (await fs.access(fullPath).then(() => true).catch(() => false)) {
            const fileContent = await fs.readFile(fullPath, 'utf8');
            return fileContent;
          }
        } catch (error) {
          console.error(`Error reading file ${affectedFilePath}:`, error);
        }
      }
      
      // If specific file not found or not identified, provide a summary of project files
      const projectFiles = await this.getProjectFilesSummary();
      return projectFiles;
    } catch (error) {
      console.error('Error getting code context:', error);
      return 'Error retrieving code context. Please provide more details about the error.';
    }
  }
  
  /**
   * Get a summary of relevant project files for context
   */
  private async getProjectFilesSummary(): Promise<string> {
    try {
      let summary = '';
      
      // Look for package.json first to understand dependencies
      const packageJsonPath = path.join(this.tempDir, 'package.json');
      if (await fs.access(packageJsonPath).then(() => true).catch(() => false)) {
        const packageJson = await fs.readFile(packageJsonPath, 'utf8');
        summary += `File: package.json\n${packageJson}\n\n`;
      }
      
      // Get main app files which are likely to be relevant
      const keyFiles = [
        'index.html',
        'src/main.jsx',
        'src/main.tsx',
        'src/App.jsx',
        'src/App.tsx',
        'src/index.js',
        'src/index.tsx'
      ];
      
      for (const file of keyFiles) {
        const filePath = path.join(this.tempDir, file);
        if (await fs.access(filePath).then(() => true).catch(() => false)) {
          const content = await fs.readFile(filePath, 'utf8');
          summary += `File: ${file}\n${content}\n\n`;
        }
      }
      
      // If summary is still empty, add a few files as examples
      if (!summary) {
        const allFiles = await this.getAllFiles(this.tempDir);
        for (const file of allFiles.slice(0, 3)) {
          const relativePath = path.relative(this.tempDir, file);
          const content = await fs.readFile(file, 'utf8');
          summary += `File: ${relativePath}\n${content}\n\n`;
        }
      }
      
      return summary;
    } catch (error) {
      console.error('Error getting project files summary:', error);
      return 'Error retrieving project files summary.';
    }
  }
  
  /**
   * Recursively get all files in a directory
   */
  private async getAllFiles(dir: string): Promise<string[]> {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? this.getAllFiles(res) : res;
    }));
    return files.flat();
  }
  
  /**
   * Parse Claude's response to extract file paths and contents
   */
  private async parseClaudeResponse(responseText: string): Promise<{ path: string; content: string }[]> {
    const files: { path: string; content: string }[] = [];
    
    console.log("Parsing Claude response...");
    
    try {
      // Check for any file paths that are in backticks and remove them
      const invalidPathPattern = /`((?:src|public)\/[\w\/.-]+\.[a-z]+|[\w]+\.(jsx|js|css|html|json))`/g;
      responseText = responseText.replace(invalidPathPattern, '');
      
      // Try the new "File:" format first with more flexible pattern
      const fileColonRegex = /File:\s*([a-zA-Z0-9_\/.()-]+\.(tsx|jsx|ts|js|css|html|json|svg|md|jsx|js))\s*\n```(?:[a-z]*\n)?([\s\S]*?)```/gm;
      
      let match;
      while ((match = fileColonRegex.exec(responseText)) !== null) {
        const path = match[1].trim();
        let content = match[3] ? match[3].trim() : '';
        
        // Remove language identifier if it exists
        content = content.replace(/^(jsx|tsx|js|ts|css|html|json)\n/, '');
        
        console.log(`Found file (new format): ${path}`);
        files.push({
          path,
          content
        });
      }
      
      // Try alternative formatting patterns if no files found
      if (files.length === 0) {
        console.log("No files found using the primary format pattern. Trying alternative patterns...");
        
        const fileBlockRegex = /([a-zA-Z0-9_\/.()-]+\.(tsx|jsx|ts|js|css|html|json|svg|md|jsx|js))\s*\n```(?:[a-z]*\n)?([\s\S]*?)```/gm;
        
        while ((match = fileBlockRegex.exec(responseText)) !== null) {
          const path = match[1].trim();
          let content = match[3] ? match[3].trim() : '';
          
          // Remove language identifier if it exists
          content = content.replace(/^(jsx|tsx|js|ts|css|html|json)\n/, '');
          
          console.log(`Found file using alternative pattern: ${path}`);
          files.push({
            path,
            content
          });
        }
      }
      
      // Clean up content formatting and validate syntax for code files
      console.log(`Starting syntax validation on ${files.length} generated files...`);
      for (let i = 0; i < files.length; i++) {
        // Remove any triple backtick segments inside the content
        let cleanedContent = files[i].content.replace(/```(?:[a-z]*\n)?([^`]*?)```/g, '$1');
        
        // Validate and fix code with ESLint and syntax checks
        const filePath = files[i].path;
        const fileExt = path.extname(filePath).toLowerCase();
        
        // Only validate JavaScript/TypeScript files
        if (['.js', '.jsx', '.ts', '.tsx'].includes(fileExt)) {
          try {
            // Perform comprehensive syntax validation
            console.log(`Performing syntax validation for ${filePath}...`);
            cleanedContent = await syntaxValidator.validateBeforeSave(filePath, cleanedContent);
            
            // Check if we were able to fix any syntax issues
            if (cleanedContent !== files[i].content) {
              console.log(`⚠️ Syntax issues were detected and fixed in ${filePath}`);
            } else {
              console.log(`✓ ${filePath} passed syntax validation without issues`);
            }
          } catch (validationError) {
            console.error(`Error during syntax validation for ${filePath}:`, validationError);
            // Continue with the original content if validation fails
          }
        }
        
        files[i].content = cleanedContent;
      }
      
      console.log(`Parsed ${files.length} files from Claude response`);
      return files;
    } catch (error: any) {
      console.error('Error parsing Claude response:', error);
      throw new Error(`Failed to parse Claude response: ${error.message || 'Unknown parsing error'}`);
    } finally {
      // Any cleanup needed after parsing operation
      console.log('Parsing operation completed');
    }
  }
}