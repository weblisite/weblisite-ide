# User Preferences System

This system enables personalized code generation based on user profile settings and technical preferences.

## Key Features
- Preferred programming languages selection
- Experience-level appropriate code generation  
- Framework preferences (React, Vue, Flask, etc.)
- Customized comment verbosity
- Error fixing with user's coding style

## How to Use
1. Update your profile by clicking your name in navigation
2. Set preferences in the Profile and Preferences tabs
3. Generate code - AI automatically uses your preferences
4. Error fixing maintains your preferred style

## Technical Implementation
- Enhanced user_profiles table with preference fields
- Server-side preference fetching from Supabase
- AI prompt enhancement with user-specific instructions
- Client-side integration in AIService and WeblisiteContext

The system automatically applies your preferences to all code generation and error fixing without requiring manual configuration.
