import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Loader2, ExternalLink, User, Globe, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface NetlifyUser {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  site_count: number;
}

interface NetlifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNetlifyConnect?: (accessToken: string, user: NetlifyUser) => void;
}

const NetlifyModal: React.FC<NetlifyModalProps> = ({ 
  isOpen, 
  onClose, 
  onNetlifyConnect 
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [netlifyUser, setNetlifyUser] = useState<NetlifyUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if already connected when modal opens
  useEffect(() => {
    if (isOpen) {
      checkNetlifyConnection();
    }
  }, [isOpen]);

  // Listen for OAuth success/error messages from popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'NETLIFY_OAUTH_SUCCESS') {
        const { accessToken: token, user } = event.data;
        
        // Store the token and user info
        localStorage.setItem('netlify_access_token', token);
        localStorage.setItem('netlify_user', JSON.stringify(user));
        
        setAccessToken(token);
        setNetlifyUser(user);
        setIsConnected(true);
        setIsConnecting(false);
        
        toast({
          title: "Netlify Connected!",
          description: `Welcome, ${user.name}! You can now deploy to your Netlify account.`,
        });

        // Notify parent component
        if (onNetlifyConnect) {
          onNetlifyConnect(token, user);
        }
      } else if (event.data.type === 'NETLIFY_OAUTH_ERROR') {
        setIsConnecting(false);
        toast({
          title: "Netlify Connection Failed",
          description: event.data.error || "Failed to connect to Netlify.",
          variant: "destructive",
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [toast, onNetlifyConnect]);

  const checkNetlifyConnection = async () => {
    try {
      // Check for stored token
      const storedToken = localStorage.getItem('netlify_access_token');
      const storedUser = localStorage.getItem('netlify_user');
      
      if (storedToken && storedUser) {
        // Validate the stored token
        const response = await fetch('/api/netlify/oauth/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ accessToken: storedToken }),
        });

        if (response.ok) {
          const validation = await response.json();
          if (validation.valid) {
            setAccessToken(storedToken);
            setNetlifyUser(validation.user);
            setIsConnected(true);
            return;
          }
        }
      }
      
      // Clear invalid tokens
      localStorage.removeItem('netlify_access_token');
      localStorage.removeItem('netlify_user');
      setIsConnected(false);
      setNetlifyUser(null);
      setAccessToken(null);
    } catch (error) {
      console.error('Error checking Netlify connection:', error);
      setIsConnected(false);
      setNetlifyUser(null);
      setAccessToken(null);
    }
  };

  const connectToNetlify = async () => {
    try {
      setIsConnecting(true);
      
      // Get authorization URL from backend
      const response = await fetch('/api/netlify/oauth/authorize', {
        method: 'GET',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get authorization URL');
      }

      const { authUrl, state } = await response.json();
      
      // Store state for validation
      localStorage.setItem('netlify_oauth_state', state);
      
      // Open popup for OAuth flow
      const popup = window.open(
        authUrl,
        'netlify-oauth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );
      
      // Check if popup was blocked
      if (!popup) {
        throw new Error('Popup was blocked. Please allow popups for this site.');
      }
      
      toast({
        title: "Connecting to Netlify...",
        description: "Please complete the authorization in the popup window.",
      });

      // Monitor popup for closure without success
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          if (isConnecting) {
            setIsConnecting(false);
            toast({
              title: "Connection Cancelled",
              description: "The Netlify authorization was cancelled.",
              variant: "destructive",
            });
          }
        }
      }, 1000);
      
    } catch (error: any) {
      console.error('Error connecting to Netlify:', error);
      setIsConnecting(false);
      toast({
        title: "Netlify Connection Failed",
        description: error.message || "Failed to connect to Netlify.",
        variant: "destructive",
      });
    }
  };

  const disconnectFromNetlify = async () => {
    try {
      // Clear stored tokens and state
      localStorage.removeItem('netlify_access_token');
      localStorage.removeItem('netlify_user');
      localStorage.removeItem('netlify_oauth_state');
      
      setAccessToken(null);
      setNetlifyUser(null); 
      setIsConnected(false);
      
      toast({
        title: "Netlify Disconnected",
        description: "You have successfully disconnected from Netlify.",
      });
    } catch (error: any) {
      console.error('Error disconnecting from Netlify:', error);
      toast({
        title: "Disconnect Failed",
        description: error.message || "Failed to disconnect from Netlify.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.934 8.519a1.044 1.044 0 0 1 .303.23l2.349 2.352a1.044 1.044 0 0 1 .232.303c.055.113.085.239.085.369s-.03.256-.085.369a1.044 1.044 0 0 1-.232.303l-2.349 2.352a1.044 1.044 0 0 1-.303.23c-.113.055-.239.085-.369.085s-.256-.03-.369-.085a1.044 1.044 0 0 1-.303-.23L14.548 13.45a1.044 1.044 0 0 1-.23-.303c-.055-.113-.085-.239-.085-.369s.03-.256.085-.369c.055-.113.127-.213.23-.303l1.345-1.347a1.044 1.044 0 0 1 .303-.23c.113-.055.239-.085.369-.085s.256.03.369.085zm-9.85 0a1.044 1.044 0 0 1 .369-.085c.13 0 .256.03.369.085a1.044 1.044 0 0 1 .303.23l1.345 1.347c.103.09.175.19.23.303.055.113.085.239.085.369s-.03.256-.085.369a1.044 1.044 0 0 1-.23.303L7.084 13.45a1.044 1.044 0 0 1-.303.23c-.113.055-.239.085-.369.085s-.256-.03-.369-.085a1.044 1.044 0 0 1-.303-.23L3.391 11.098a1.044 1.044 0 0 1-.232-.303c-.055-.113-.085-.239-.085-.369s.03-.256.085-.369a1.044 1.044 0 0 1 .232-.303L5.74 8.749a1.044 1.044 0 0 1 .303-.23c.113-.055.239-.085.369-.085s.256.03.369.085z"/>
            </svg>
            Connect to Netlify
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!isConnected ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p className="mb-3">
                  Connect your Netlify account to deploy your websites directly from Weblisite.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Deploy to your own Netlify account</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Automatic GitHub integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Custom domains and SSL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Continuous deployment</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={connectToNetlify}
                disabled={isConnecting}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting to Netlify...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Connect Netlify Account
                  </>
                )}
              </Button>

              <div className="text-xs text-gray-500 text-center">
                By connecting, you authorize Weblisite to manage your Netlify sites on your behalf.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-green-800">
                    Connected to Netlify
                  </div>
                  <div className="text-xs text-green-600">
                    Ready to deploy your websites
                  </div>
                </div>
              </div>

              {netlifyUser && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {netlifyUser.avatar_url ? (
                      <img 
                        src={netlifyUser.avatar_url} 
                        alt={netlifyUser.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-sm">{netlifyUser.name}</div>
                      <div className="text-xs text-gray-500">{netlifyUser.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {netlifyUser.site_count} site{netlifyUser.site_count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={disconnectFromNetlify}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Disconnect
                </Button>
                <Button
                  onClick={onClose}
                  size="sm"
                  className="flex-1"
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NetlifyModal; 