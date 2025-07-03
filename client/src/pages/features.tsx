import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';  
import SharedHeader from '../components/SharedHeader';
import SharedFooter from '../components/SharedFooter';

export default function Features() {
  const [isVisible, setIsVisible] = useState(false);
  const [prompt, setPrompt] = useState('');
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
    const finalPrompt = promptText || prompt;
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

  const features = [
    {
      icon: "🧠",
      title: "Claude 4 Sonnet AI Brain",
      description: "The world's most advanced AI model writes enterprise-grade code instantly. While others struggle with syntax, you're shipping products.",
      benefit: "10x faster than hiring developers"
    },
    {
      icon: "⚡",
      title: "Live Preview Magic",
      description: "Watch your app build itself in real-time. No refreshing, no waiting, no configuration hell. Pure creation at light speed.",
      benefit: "Zero waiting, maximum flow"
    },
    {
      icon: "🚀",
      title: "Instant Global Deployment",
      description: "One click and your app is live worldwide. While competitors fight with servers, you're already scaling.",
      benefit: "Launch in 30 seconds"
    },
    {
      icon: "💎",
      title: "Enterprise-Grade Quality",
      description: "Every app built with production-ready standards. Security, performance, scalability - built in by default.",
      benefit: "Fortune 500 quality, startup speed"
    },
    {
      icon: "🎨",
      title: "Designer-Quality UI",
      description: "Beautiful, responsive interfaces that make your users fall in love. No design skills needed.",
      benefit: "Look like you hired a design agency"
    },
    {
      icon: "🔄",
      title: "Natural Language Editing",
      description: "Change anything with plain English. 'Make it blue', 'add a contact form', 'integrate payments' - it just works.",
      benefit: "No code, no limits"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <SharedHeader />

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Why Weblisite Will <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Transform</span> Your Business
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-6">
              Every feature designed to give you an <strong className="text-white">unfair advantage</strong> over your competition.
            </p>
            <div className="inline-block bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-full px-6 py-2">
              <span className="text-yellow-300 font-semibold">⚠️ Your competitors don't know this exists yet</span>
            </div>
          </div>

          <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {features.map((feature, index) => (
              <div key={index} className="group bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/30 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl hover:shadow-white/10">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-400 mb-4 leading-relaxed">{feature.description}</p>
                <div className="inline-block px-3 py-1 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-full text-sm font-semibold text-green-300">
                  ✨ {feature.benefit}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className={`text-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                🎯 Ready to Experience These Features?
              </h3>
              <p className="text-lg text-slate-300 mb-6">
                See these powerful features in action. Describe your app idea and watch our AI build it live.
              </p>
              <div className="space-y-4">
                <Textarea
                  placeholder="Describe your web app idea... e.g., 'A task management app with team collaboration' or 'An e-commerce store with payment processing'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 resize-none"
                  rows={4}
                />
                <Button
                  onClick={handlePromptSubmit}
                  disabled={isLoading || !prompt.trim()}
                  className="w-full py-4 text-xl font-semibold bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/50 border-2 border-green-400/50"
                >
                  {isLoading ? (
                    <>Preparing Your App Builder...</>
                  ) : (
                    <>💎 Build My App Now - FREE FOREVER</>
                  )}
                </Button>
                <div className="text-sm text-slate-400">
                  ⚡ Live in 10 minutes • 🔒 No credit card required • ✨ Enterprise-grade results
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