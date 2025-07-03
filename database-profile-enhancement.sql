-- Database Schema Enhancement for User Profiles
-- This file adds comprehensive user preference fields to support personalized code generation

-- Add new columns to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS job_title TEXT,
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC',
ADD COLUMN IF NOT EXISTS years_experience INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'unavailable')),
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS github_username TEXT,
ADD COLUMN IF NOT EXISTS twitter_username TEXT,
ADD COLUMN IF NOT EXISTS linkedin_username TEXT,
ADD COLUMN IF NOT EXISTS preferred_languages JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS interests TEXT,
ADD COLUMN IF NOT EXISTS theme_preference TEXT DEFAULT 'system' CHECK (theme_preference IN ('light', 'dark', 'system')),
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"email": true, "push": true, "sms": false, "marketing": false}'::jsonb;

-- Create indexes for better performance on commonly queried preference fields
CREATE INDEX IF NOT EXISTS idx_user_profiles_preferred_languages ON user_profiles USING GIN (preferred_languages);
CREATE INDEX IF NOT EXISTS idx_user_profiles_availability_status ON user_profiles(availability_status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_theme_preference ON user_profiles(theme_preference);
CREATE INDEX IF NOT EXISTS idx_user_profiles_github_username ON user_profiles(github_username);

-- Create user_preferences table for more complex preference tracking
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    preference_type TEXT NOT NULL CHECK (preference_type IN ('code_generation', 'ui_styling', 'framework_defaults', 'deployment')),
    preference_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, preference_type)
);

-- Enable RLS on user_preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_preferences
CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create own preferences" ON user_preferences FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own preferences" ON user_preferences FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own preferences" ON user_preferences FOR DELETE USING (user_id = auth.uid());

-- Create index for user_preferences
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_type ON user_preferences(user_id, preference_type);

-- Add trigger for updated_at on user_preferences
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a function to get user preferences for code generation
CREATE OR REPLACE FUNCTION get_user_code_generation_preferences(user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    user_prefs JSONB;
    code_prefs JSONB;
BEGIN
    -- Get basic user profile preferences
    SELECT jsonb_build_object(
        'preferred_languages', COALESCE(preferred_languages, '[]'::jsonb),
        'experience_level', CASE 
            WHEN years_experience IS NULL OR years_experience = 0 THEN 'beginner'
            WHEN years_experience <= 2 THEN 'beginner'
            WHEN years_experience <= 5 THEN 'intermediate'
            ELSE 'advanced'
        END,
        'interests', interests,
        'theme_preference', theme_preference
    ) INTO user_prefs
    FROM user_profiles 
    WHERE id = user_uuid;
    
    -- Get detailed code generation preferences
    SELECT preference_data INTO code_prefs
    FROM user_preferences 
    WHERE user_id = user_uuid AND preference_type = 'code_generation';
    
    -- Merge preferences with defaults
    RETURN jsonb_build_object(
        'profile', COALESCE(user_prefs, '{}'::jsonb),
        'code_generation', COALESCE(code_prefs, jsonb_build_object(
            'default_framework', 'react',
            'preferred_styling', 'tailwind',
            'code_style', 'modern',
            'comment_verbosity', 'medium',
            'include_types', true,
            'include_error_handling', true
        ))
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to update user preferences
CREATE OR REPLACE FUNCTION upsert_user_preference(
    user_uuid UUID,
    pref_type TEXT,
    pref_data JSONB
) RETURNS VOID AS $$
BEGIN
    INSERT INTO user_preferences (user_id, preference_type, preference_data)
    VALUES (user_uuid, pref_type, pref_data)
    ON CONFLICT (user_id, preference_type)
    DO UPDATE SET 
        preference_data = EXCLUDED.preference_data,
        updated_at = TIMEZONE('utc'::text, NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default code generation preferences for existing users
INSERT INTO user_preferences (user_id, preference_type, preference_data)
SELECT 
    id,
    'code_generation',
    jsonb_build_object(
        'default_framework', CASE 
            WHEN preferred_languages @> '["JavaScript"]' OR preferred_languages @> '["TypeScript"]' THEN 'react'
            WHEN preferred_languages @> '["Python"]' THEN 'flask'
            WHEN preferred_languages @> '["PHP"]' THEN 'laravel'
            WHEN preferred_languages @> '["Java"]' THEN 'spring'
            ELSE 'react'
        END,
        'preferred_styling', 'tailwind',
        'code_style', 'modern',
        'comment_verbosity', 'medium',
        'include_types', CASE WHEN preferred_languages @> '["TypeScript"]' THEN true ELSE false END,
        'include_error_handling', true
    )
FROM user_profiles
WHERE id NOT IN (
    SELECT user_id FROM user_preferences WHERE preference_type = 'code_generation'
);

-- Create view for easy access to user preferences
CREATE OR REPLACE VIEW user_profile_with_preferences AS
SELECT 
    up.*,
    COALESCE(pg.preference_data, '{}'::jsonb) as code_generation_preferences,
    COALESCE(ui.preference_data, '{}'::jsonb) as ui_preferences,
    COALESCE(fw.preference_data, '{}'::jsonb) as framework_preferences
FROM user_profiles up
LEFT JOIN user_preferences pg ON up.id = pg.user_id AND pg.preference_type = 'code_generation'
LEFT JOIN user_preferences ui ON up.id = ui.user_id AND ui.preference_type = 'ui_styling'
LEFT JOIN user_preferences fw ON up.id = fw.user_id AND fw.preference_type = 'framework_defaults';

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON user_preferences TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_code_generation_preferences(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION upsert_user_preference(UUID, TEXT, JSONB) TO authenticated; 