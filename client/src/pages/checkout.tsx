import { useStripe, Elements, PaymentElement, useElements, LinkAuthenticationElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useWeblisite } from '../context/WeblisiteContext';
import { useLocation } from 'wouter';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/deployment-success`,
          receipt_email: email,
        },
      });

      // This point will only be reached if there is an immediate error when
      // confirming the payment. Otherwise, your customer will be redirected to
      // your `return_url`. For some payment methods like iDEAL, your customer will
      // be redirected to an intermediate site first to authorize the payment, then
      // redirected to the `return_url`.
      if (error) {
        setErrorMessage(error.message || 'An unexpected error occurred during payment processing.');
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Payment error:', err);
      setErrorMessage('An unexpected error occurred during payment processing.');
      toast({
        title: "Error",
        description: "An unexpected error occurred during payment processing.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your.email@example.com"
            required
          />
        </div>
        
        <div className="pt-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">Payment Details</label>
          <div className="bg-gray-700 p-3 rounded-md">
            <PaymentElement />
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-900/30 border border-red-500 text-red-300 p-3 rounded-md text-sm">
          {errorMessage}
        </div>
      )}

      <button 
        className={`w-full ${isProcessing ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} p-3 rounded-md transition-colors flex items-center justify-center text-white font-medium`}
        disabled={isProcessing || !stripe || !elements}
      >
        {isProcessing ? (
          <>
            <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
            Processing Payment...
          </>
        ) : (
          'Pay $5.00 & Deploy'
        )}
      </button>

      <div className="text-xs text-gray-400 text-center">
        By clicking the button above, you agree to our <a href="#" className="text-blue-400 hover:text-blue-300">Terms</a> and <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>.
      </div>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  // Check if Stripe is configured
  if (!stripePublicKey) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
          <div className="w-16 h-16 bg-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Payment Not Configured</h2>
          <p className="text-gray-300 mb-6">
            Stripe payment is not configured for this development environment. 
            Set the <code className="bg-gray-700 px-1 rounded text-yellow-300">VITE_STRIPE_PUBLIC_KEY</code> environment variable to enable payments.
          </p>
          <button 
            onClick={() => setLocation('/')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
          >
            Return to Editor
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    setLoading(true);
    apiRequest("POST", "/api/create-payment-intent", { amount: 5.00 })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to create payment intent');
        }
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error creating payment intent:', error);
        setError('Could not initialize payment. Please try again later.');
        setLoading(false);
        toast({
          title: "Payment Error",
          description: "Could not initialize payment. Please try again later.",
          variant: "destructive",
        });
      });
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" aria-label="Loading"/>
        <p className="text-gray-300 mt-4">Initializing payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
          <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Payment Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => setLocation('/')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Return to Editor
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Deploy Your Project</h2>
          <button 
            onClick={() => setLocation('/')}
            className="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="bg-gray-700 p-4 rounded-md mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-medium text-white">Standard Deployment</h3>
              <p className="text-sm text-gray-300">Deploy your React app to production</p>
            </div>
            <div className="text-lg font-medium text-white">$5.00</div>
          </div>
          
          <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
            <li>Custom domain support</li>
            <li>Automatic HTTPS</li>
            <li>Continuous deployment</li>
            <li>24/7 monitoring</li>
          </ul>
        </div>
        
{stripePromise && (
          <Elements 
            stripe={stripePromise} 
            options={{ 
              clientSecret, 
              appearance: { 
                theme: 'night',
                variables: {
                  colorPrimary: '#3b82f6',
                  colorBackground: '#374151',
                  colorText: '#ffffff',
                  colorDanger: '#ef4444',
                  fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  spacingUnit: '4px',
                  borderRadius: '4px',
                },
              }
            }}
          >
            <CheckoutForm />
          </Elements>
        )}
        
        <div className="mt-5 border-t border-gray-700 pt-5 flex items-center justify-center text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-xs">Secure payment powered by Stripe</span>
        </div>
      </div>
    </div>
  );
}