import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useWeblisite } from '../context/WeblisiteContext';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';

export default function DeploymentSuccess() {
  const [loading, setLoading] = useState(true);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const [adminUrl, setAdminUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(10);
  const { toast } = useToast();
  const { setDeployedUrl: setContextDeployedUrl } = useWeblisite();
  const [_, setLocation] = useLocation();

  useEffect(() => {
    // Extract the payment_intent and payment_intent_client_secret from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntent = urlParams.get('payment_intent');
    const paymentStatus = urlParams.get('redirect_status');
    
    if (!paymentIntent) {
      setError("Payment information not found");
      toast({
        title: "Error",
        description: "Payment information not found",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (paymentStatus !== 'succeeded') {
      setError(`Payment was not successful. Status: ${paymentStatus || 'unknown'}`);
      toast({
        title: "Payment Error",
        description: "Your payment was not completed successfully",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Verify the payment and deploy the project
    apiRequest("POST", "/api/deploy", { paymentIntentId: paymentIntent })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to deploy project');
        }
        return res.json();
      })
      .then((data) => {
        setDeployedUrl(data.deployUrl);
        setAdminUrl(data.adminUrl);
        setContextDeployedUrl(data.deployUrl);
        toast({
          title: "Deployment Successful",
          description: "Your project has been deployed!",
        });
      })
      .catch((error) => {
        console.error('Error deploying project:', error);
        setError("Could not deploy your project. Please try again later.");
        toast({
          title: "Deployment Error",
          description: "Could not deploy your project. Please try again later.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [toast, setContextDeployedUrl]);

  // Redirect back to the IDE after countdown seconds
  useEffect(() => {
    if (deployedUrl && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (deployedUrl && redirectCountdown === 0) {
      setLocation('/');
    }
  }, [deployedUrl, redirectCountdown, setLocation]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        {loading ? (
          <>
            <div className="mb-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 animate-spin">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="stroke-blue-500 opacity-25" cx="50" cy="50" r="46" strokeWidth="8" fill="none" />
                    <circle className="stroke-blue-500" cx="50" cy="50" r="46" strokeWidth="8" fill="none" 
                      strokeDasharray="290" strokeDashoffset="290" strokeLinecap="round">
                      <animate attributeName="stroke-dashoffset" dur="1.5s" repeatCount="indefinite" from="290" to="0" />
                    </circle>
                  </svg>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Deploying Your Project</h2>
            <p className="text-gray-300 mb-2">Please wait while we deploy your project...</p>
            <p className="text-gray-400 text-sm">This usually takes less than a minute.</p>
          </>
        ) : deployedUrl ? (
          <>
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Deployment Successful!</h2>
            <p className="text-gray-300 mb-4">Your project has been deployed successfully.</p>
            
            <div className="bg-gray-700 p-4 rounded-md mb-6 space-y-4">
              <div>
                <p className="text-sm text-gray-300 mb-2">Your project is live at:</p>
                <div className="flex items-center">
                  <a href={deployedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm font-mono truncate flex-1">
                    {deployedUrl}
                  </a>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(deployedUrl || '');
                      toast({
                        title: "Copied!",
                        description: "Live URL copied to clipboard",
                      });
                    }}
                    className="ml-2 text-gray-400 hover:text-white p-1"
                    title="Copy to clipboard"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {adminUrl && (
                <div>
                  <p className="text-sm text-gray-300 mb-2">Admin dashboard (for site management):</p>
                  <div className="flex items-center">
                    <a href={adminUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm font-mono truncate flex-1">
                      {adminUrl}
                    </a>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(adminUrl || '');
                        toast({
                          title: "Copied!",
                          description: "Admin URL copied to clipboard",
                        });
                      }}
                      className="ml-2 text-gray-400 hover:text-white p-1"
                      title="Copy to clipboard"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <a 
                href={deployedUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
                Visit Live Site
              </a>
              
              {adminUrl && (
                <a 
                  href={adminUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded flex items-center justify-center shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  Manage Site
                </a>
              )}
            </div>
            
            <button 
              onClick={() => setLocation('/')} 
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to Editor
            </button>
            
            <div className="mt-6 pt-4 border-t border-gray-700">
              <p className="text-gray-400 text-sm">
                Redirecting back to editor in <span className="text-white font-medium">{redirectCountdown}</span> seconds...
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Deployment Failed</h2>
            <p className="text-gray-300 mb-6">{error || "There was an error deploying your project."}</p>
            
            <div className="space-y-3">
              <button 
                onClick={() => window.location.reload()} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Try Again
              </button>
              
              <button 
                onClick={() => setLocation('/')} 
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to Editor
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}