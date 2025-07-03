import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import SharedHeader from '../components/SharedHeader';
import SharedFooter from '../components/SharedFooter';

export default function Pricing() {
  const [isVisible, setIsVisible] = useState(false);
  const [freePrompt, setFreePrompt] = useState('');
  const [starterPrompt, setStarterPrompt] = useState('');
  const [proPrompt, setProPrompt] = useState('');
  const [enterprisePrompt, setEnterprisePrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, redirectToAuth } = useAuth();
  const isAuthenticated = !!user;
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handlePromptSubmit = async (e: React.FormEvent, promptText?: string) => {
    e.preventDefault();
    const finalPrompt = promptText || '';
    if (!finalPrompt.trim()) return;

    setIsLoading(true);

    try {
      localStorage.setItem('weblisite_initial_prompt', finalPrompt);
      
      if (isAuthenticated) {
        toast({
          title: "Redirecting to Builder",
          description: "Taking you to the app builder with your idea.",
        });
        setTimeout(() => setLocation('/builder'), 1500);
      } else {
        toast({
          title: "Almost there!",
          description: "Please sign in to start building your app.",
        });
        redirectToAuth();
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFreeSubmit = (e: React.FormEvent) => {
    handlePromptSubmit(e, freePrompt.trim());
  };

  const handleStarterSubmit = (e: React.FormEvent) => {
    handlePromptSubmit(e, starterPrompt.trim());
  };

  const handleProSubmit = (e: React.FormEvent) => {
    handlePromptSubmit(e, proPrompt.trim());
  };

  const handleEnterpriseSubmit = (e: React.FormEvent) => {
    handlePromptSubmit(e, enterprisePrompt.trim());
  };

  return (
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <SharedHeader />

      {/* Pricing Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Choose Your <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Unfair Advantage</span>
            </h1>
            <p className="text-xl text-slate-300 mb-4 max-w-3xl mx-auto">
              While others struggle with code, you'll be <strong className="text-white">dominating your market</strong>.
            </p>
            <div className="inline-block bg-gradient-to-r from-yellow-500/20 to-red-500/20 border border-yellow-500/50 rounded-full px-6 py-2">
              <span className="text-yellow-300 font-semibold">🔥 Limited Time: Get started before your competition discovers this</span>
            </div>
          </div>

          <div className={`grid md:grid-cols-4 gap-6 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Free Plan */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col h-full">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">Free</h3>
                <div className="text-3xl font-bold mb-2">
                  $0<span className="text-lg text-green-400 font-normal ml-1">/forever</span>
                </div>
                <p className="text-slate-400 text-sm">Try before you fly</p>
                <div className="mt-3">
                  <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs border border-green-500/30">
                    Perfect for testing
                  </span>
                </div>
              </div>
              <div className="flex-grow">
                <ul className="space-y-3 mb-6 text-sm">
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    <span><strong className="text-white">5 prompts</strong> per day</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    AI-Powered Code Generation
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    Live Preview
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    Basic Templates
                  </li>
                  <li className="flex items-center">
                    <span className="text-orange-400 mr-3">⚠️</span>
                    <span className="text-orange-300 text-xs">Upgrade prompt after 5 daily uses</span>
                  </li>
                </ul>
              </div>
              <div className="bg-slate-700/50 border border-white/10 rounded-xl p-4 mt-auto">
                <Textarea
                  placeholder="Describe your app idea..."
                  value={freePrompt}
                  onChange={(e) => setFreePrompt(e.target.value)}
                  className="w-full mb-3 bg-slate-600/50 border-slate-500 text-white placeholder-slate-400 resize-none text-sm"
                  rows={1}
                />
                <Button
                  onClick={handleFreeSubmit}
                  disabled={isLoading || !freePrompt.trim()}
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-sm py-2"
                >
                  Start Free
                </Button>
              </div>
            </div>

            {/* Starter Plan */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col h-full">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">Starter</h3>
                <div className="text-3xl font-bold mb-2">
                  $29<span className="text-lg text-slate-400">/month</span>
                </div>
                <p className="text-slate-400 text-sm">Perfect for solo builders</p>
                <div className="mt-3">
                  <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs border border-blue-500/30">
                    Most popular for individuals
                  </span>
                </div>
              </div>
              <div className="flex-grow">
                <ul className="space-y-3 mb-6 text-sm">
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    <span><strong className="text-white">150 prompts</strong> per month</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    Advanced AI Features
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    Unlimited Projects
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    One-Click Deployment
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    Email Support
                  </li>
                </ul>
              </div>
              <div className="bg-slate-700/50 border border-blue-500/30 rounded-xl p-4 mt-auto">
                <Textarea
                  placeholder="Describe your startup idea..."
                  value={starterPrompt}
                  onChange={(e) => setStarterPrompt(e.target.value)}
                  className="w-full mb-3 bg-slate-600/50 border-slate-500 text-white placeholder-slate-400 resize-none text-sm"
                  rows={1}
                />
                <Button
                  onClick={handleStarterSubmit}
                  disabled={isLoading || !starterPrompt.trim()}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-sm py-2"
                >
                  Start Starter
                </Button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="relative bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-2 border-purple-500 rounded-2xl p-6 flex flex-col h-full">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </div>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">Pro</h3>
                <div className="text-3xl font-bold mb-2">
                  $49<span className="text-lg text-slate-400">/month</span>
                </div>
                <p className="text-slate-400 text-sm">For growing businesses</p>
                <div className="mt-3 space-y-1">
                  <div className="text-xs text-slate-300">
                    <span className="line-through text-red-400">$0.33/prompt elsewhere</span> → <span className="text-green-400 font-semibold">$0.16/prompt</span>
                  </div>
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs border border-purple-500/30">
                    💰 Save 50% per prompt
                  </span>
                </div>
              </div>
              <div className="flex-grow">
                <ul className="space-y-3 mb-6 text-sm">
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    <span><strong className="text-white">300 prompts</strong> per month</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    Everything in Starter
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    Real-time Collaboration
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    Custom Domains
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    Priority Support
                  </li>
                </ul>
              </div>
              <div className="bg-slate-700/50 border border-purple-500/30 rounded-xl p-4 mt-auto">
                <Textarea
                  placeholder="Describe your pro project..."
                  value={proPrompt}
                  onChange={(e) => setProPrompt(e.target.value)}
                  className="w-full mb-3 bg-slate-600/50 border-slate-500 text-white placeholder-slate-400 resize-none text-sm"
                  rows={1}
                />
                <Button
                  onClick={handleProSubmit}
                  disabled={isLoading || !proPrompt.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-sm py-2"
                >
                  Start Pro
                </Button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col h-full">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                <div className="text-3xl font-bold mb-2">
                  $79<span className="text-lg text-slate-400">/month</span>
                </div>
                <p className="text-slate-400 text-sm">For power users & teams</p>
                <div className="mt-3">
                  <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full text-xs border border-yellow-500/30">
                    🏆 Best value per prompt
                  </span>
                </div>
              </div>
              <div className="flex-grow">
                <ul className="space-y-3 mb-6 text-sm">
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    <span><strong className="text-white">500 prompts</strong> per month</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    Everything in Pro
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    Advanced Analytics
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    White-label Options
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    Dedicated Support
                  </li>
                </ul>
              </div>
              <div className="bg-slate-700/50 border border-yellow-500/30 rounded-xl p-4 mt-auto">
                <Textarea
                  placeholder="Describe your enterprise needs..."
                  value={enterprisePrompt}
                  onChange={(e) => setEnterprisePrompt(e.target.value)}
                  className="w-full mb-3 bg-slate-600/50 border-slate-500 text-white placeholder-slate-400 resize-none text-sm"
                  rows={1}
                />
                <Button
                  onClick={handleEnterpriseSubmit}
                  disabled={isLoading || !enterprisePrompt.trim()}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-sm py-2"
                >
                  Start Enterprise
                </Button>
              </div>
            </div>
          </div>

          {/* Value Proposition */}
          <div className={`text-center mt-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/50 rounded-xl p-4 mb-8 max-w-3xl mx-auto">
              <p className="text-red-200 font-semibold text-lg">
                ⚠️ WARNING: Every day you wait, your competition gets closer to market domination.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                🎯 Why Choose Weblisite Over Expensive Developers?
              </h3>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400 mb-2">Traditional Development</div>
                  <div className="text-slate-400 text-sm space-y-1">
                    <div>💸 $60,000+ average cost</div>
                    <div>⏰ 3-6 months timeline</div>
                    <div>😰 Communication nightmares</div>
                    <div>🐛 Endless bug fixes</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-2">VS</div>
                  <div className="text-4xl">⚡</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-2">Weblisite</div>
                  <div className="text-slate-300 text-sm space-y-1">
                    <div>💰 Starting at FREE</div>
                    <div>🚀 Live in 10 minutes</div>
                    <div>💬 Natural language control</div>
                    <div>✨ Enterprise-grade results</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
} 