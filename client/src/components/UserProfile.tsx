import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/SupabaseService';
import { SupabaseService } from '../lib/SupabaseService';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile = ({ isOpen, onClose }: UserProfileProps) => {
  const { user, userProfile, signOut, updateProfile } = useAuth();
  const { toast } = useToast();
  
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info
    full_name: '',
    username: '',
    bio: '',
    
    // Professional Info
    job_title: '',
    company: '',
    location: '',
    timezone: '',
    years_experience: 0,
    availability_status: '',
    
    // Social Links
    website: '',
    github_username: '',
    twitter_username: '',
    linkedin_username: '',
    
    // Technical Preferences
    preferred_languages: '',
    interests: '',
    
    // Account Preferences
    theme_preference: 'system' as 'light' | 'dark' | 'system',
    notification_preferences: ''
  });

  const programmingLanguages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
    'PHP', 'Ruby', 'Swift', 'Kotlin', 'React', 'Vue.js', 'Angular', 'Node.js'
  ];

  const timeZones = [
    'UTC-12', 'UTC-11', 'UTC-10', 'UTC-9', 'UTC-8', 'UTC-7', 'UTC-6', 'UTC-5',
    'UTC-4', 'UTC-3', 'UTC-2', 'UTC-1', 'UTC+0', 'UTC+1', 'UTC+2', 'UTC+3',
    'UTC+4', 'UTC+5', 'UTC+6', 'UTC+7', 'UTC+8', 'UTC+9', 'UTC+10', 'UTC+11', 'UTC+12'
  ];

  useEffect(() => {
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name || '',
        username: userProfile.username || '',
        bio: userProfile.bio || '',
        job_title: userProfile.job_title || '',
        company: userProfile.company || '',
        location: userProfile.location || '',
        timezone: userProfile.timezone || '',
        years_experience: userProfile.years_experience || 0,
        availability_status: userProfile.availability_status || '',
        website: userProfile.website || '',
        github_username: userProfile.github_username || '',
        twitter_username: userProfile.twitter_username || '',
        linkedin_username: userProfile.linkedin_username || '',
        preferred_languages: userProfile.preferred_languages || '',
        interests: userProfile.interests || '',
        theme_preference: userProfile.theme_preference || 'system',
        notification_preferences: userProfile.notification_preferences || ''
      });
    }
  }, [userProfile]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLanguageToggle = (language: string) => {
    const currentLanguages = formData.preferred_languages 
      ? JSON.parse(formData.preferred_languages) 
      : [];
    
    const updatedLanguages = currentLanguages.includes(language)
      ? currentLanguages.filter((l: string) => l !== language)
      : [...currentLanguages, language];
    
    setFormData(prev => ({
      ...prev,
      preferred_languages: JSON.stringify(updatedLanguages)
    }));
  };

  const getSelectedLanguages = () => {
    try {
      return formData.preferred_languages ? JSON.parse(formData.preferred_languages) : [];
    } catch {
      return [];
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Prepare the data with proper types
      const availabilityStatus = formData.availability_status;
      const validAvailabilityStatus = availabilityStatus === 'available' || availabilityStatus === 'busy' || availabilityStatus === 'not_looking' 
        ? availabilityStatus as 'available' | 'busy' | 'not_looking'
        : null;
      
      const profileData = {
        ...formData,
        availability_status: validAvailabilityStatus
      };
      
      await updateProfile(profileData);

      // Update code generation preferences based on profile changes
      try {
        const supabaseService = new SupabaseService();
        await supabaseService.updateCodeGenerationPreferences(user.id, profileData);
      } catch (prefError) {
        console.error('Error updating preferences:', prefError);
        // Don't fail the entire save if preferences update fails
      }

      toast({
        title: "Profile Updated",
        description: "Your profile and preferences have been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Sign Out Failed",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border-white/10 shadow-2xl">
        <CardHeader className="border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-white">User Profile</CardTitle>
              <CardDescription className="text-slate-400">
                Manage your account settings and preferences
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              <i className="ri-close-line text-lg"></i>
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="profile">Profile Info</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-sm font-medium text-slate-300">
                      Full Name
                    </Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      className="bg-slate-800/50 border-white/10 text-white placeholder-slate-400"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium text-slate-300">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="bg-slate-800/50 border-white/10 text-white placeholder-slate-400"
                      placeholder="Choose a username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-medium text-slate-300">
                    Bio
                  </Label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-md text-white placeholder-slate-400 min-h-[80px] resize-none"
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Professional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="job_title" className="text-sm font-medium text-slate-300">
                      Job Title
                    </Label>
                    <Input
                      id="job_title"
                      value={formData.job_title}
                      onChange={(e) => handleInputChange('job_title', e.target.value)}
                      className="bg-slate-800/50 border-white/10 text-white placeholder-slate-400"
                      placeholder="e.g. Full Stack Developer"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium text-slate-300">
                      Company
                    </Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="bg-slate-800/50 border-white/10 text-white placeholder-slate-400"
                      placeholder="Your company name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium text-slate-300">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="bg-slate-800/50 border-white/10 text-white placeholder-slate-400"
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-sm font-medium text-slate-300">
                      Timezone
                    </Label>
                    <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                      <SelectTrigger className="bg-slate-800/50 border-white/10 text-white">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/10">
                        {timeZones.map((tz) => (
                          <SelectItem key={tz} value={tz} className="text-white hover:bg-slate-700">
                            {tz}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="years_experience" className="text-sm font-medium text-slate-300">
                      Years of Experience
                    </Label>
                    <Input
                      id="years_experience"
                      type="number"
                      value={formData.years_experience}
                      onChange={(e) => handleInputChange('years_experience', parseInt(e.target.value) || 0)}
                      className="bg-slate-800/50 border-white/10 text-white placeholder-slate-400"
                      placeholder="0"
                      min="0"
                      max="50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability_status" className="text-sm font-medium text-slate-300">
                      Availability Status
                    </Label>
                    <Select value={formData.availability_status} onValueChange={(value) => handleInputChange('availability_status', value)}>
                      <SelectTrigger className="bg-slate-800/50 border-white/10 text-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/10">
                        <SelectItem value="available" className="text-white hover:bg-slate-700">
                          <span className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Available for work
                          </span>
                        </SelectItem>
                        <SelectItem value="busy" className="text-white hover:bg-slate-700">
                          <span className="flex items-center">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                            Busy but open to offers
                          </span>
                        </SelectItem>
                        <SelectItem value="not_looking" className="text-white hover:bg-slate-700">
                          <span className="flex items-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                            Not looking
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Social & Contact Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm font-medium text-slate-300">
                      Website / Portfolio
                    </Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="bg-slate-800/50 border-white/10 text-white placeholder-slate-400"
                      placeholder="https://yourwebsite.com"
                      type="url"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="github_username" className="text-sm font-medium text-slate-300">
                      GitHub Username
                    </Label>
                    <Input
                      id="github_username"
                      value={formData.github_username}
                      onChange={(e) => handleInputChange('github_username', e.target.value)}
                      className="bg-slate-800/50 border-white/10 text-white placeholder-slate-400"
                      placeholder="your-github-username"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="twitter_username" className="text-sm font-medium text-slate-300">
                      Twitter / X Username
                    </Label>
                    <Input
                      id="twitter_username"
                      value={formData.twitter_username}
                      onChange={(e) => handleInputChange('twitter_username', e.target.value)}
                      className="bg-slate-800/50 border-white/10 text-white placeholder-slate-400"
                      placeholder="your-twitter-handle"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin_username" className="text-sm font-medium text-slate-300">
                      LinkedIn Username
                    </Label>
                    <Input
                      id="linkedin_username"
                      value={formData.linkedin_username}
                      onChange={(e) => handleInputChange('linkedin_username', e.target.value)}
                      className="bg-slate-800/50 border-white/10 text-white placeholder-slate-400"
                      placeholder="your-linkedin-username"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6"
                >
                  {isSaving ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="ri-save-line mr-2"></i>
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-6">
              {/* Technical Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Technical Preferences</h3>
                
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-300">
                    Preferred Programming Languages
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {programmingLanguages.map((language) => (
                      <button
                        key={language}
                        type="button"
                        onClick={() => handleLanguageToggle(language)}
                        className={`px-3 py-2 text-xs font-medium rounded-md border transition-all ${
                          getSelectedLanguages().includes(language)
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            : 'bg-slate-800/50 text-slate-300 border-white/10 hover:border-blue-500/30'
                        }`}
                      >
                        {language}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests" className="text-sm font-medium text-slate-300">
                    Interests & Specialties
                  </Label>
                  <textarea
                    id="interests"
                    value={formData.interests}
                    onChange={(e) => handleInputChange('interests', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-md text-white placeholder-slate-400 min-h-[60px] resize-none"
                    placeholder="e.g. Web Development, Machine Learning, Mobile Apps..."
                    rows={2}
                  />
                </div>
              </div>

              {/* Theme Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Appearance</h3>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300">
                    Theme Preference
                  </Label>
                  <Select value={formData.theme_preference} onValueChange={(value) => handleInputChange('theme_preference', value)}>
                    <SelectTrigger className="bg-slate-800/50 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/10">
                      <SelectItem value="light" className="text-white hover:bg-slate-700">Light</SelectItem>
                      <SelectItem value="dark" className="text-white hover:bg-slate-700">Dark</SelectItem>
                      <SelectItem value="system" className="text-white hover:bg-slate-700">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6"
                >
                  {isSaving ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="ri-save-line mr-2"></i>
                      Save Preferences
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="account" className="space-y-6">
              <div className="space-y-4">
                <div className="bg-slate-800/30 p-4 rounded-lg border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">Account Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Email:</span>
                      <span className="text-white font-medium">{user?.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Plan:</span>
                      <Badge className={
                        userProfile?.plan === 'pro' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                        userProfile?.plan === 'team' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                        'bg-slate-500/20 text-slate-300 border-slate-500/30'
                      }>
                        {userProfile?.plan?.toUpperCase() || 'FREE'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Member Since:</span>
                      <span className="text-white font-medium">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-red-950/20 p-4 rounded-lg border border-red-500/20">
                  <h3 className="text-lg font-semibold text-red-300 mb-3">Danger Zone</h3>
                  <p className="text-slate-400 text-sm mb-3">
                    Once you sign out, you'll need to authenticate again to access your account.
                  </p>
                  <Button
                    onClick={handleSignOut}
                    variant="destructive"
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    <i className="ri-logout-box-line mr-2"></i>
                    Sign Out
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile; 