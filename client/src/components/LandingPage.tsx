import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";


export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [freePrompt, setFreePrompt] = useState("");
  const [starterPrompt, setStarterPrompt] = useState("");
  const [proPrompt, setProPrompt] = useState("");
  const [enterprisePrompt, setEnterprisePrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { user, loading: authLoading } = useAuth();
  const isAuthenticated = !!user;
  const { toast } = useToast();

  useEffect(() => {
    // Ensure body allows scrolling
    document.body.style.overflow = 'auto';
    document.documentElement.style.scrollBehavior = 'smooth';
    
    setIsVisible(true);
    
    return () => {
      // Cleanup
      document.body.style.overflow = '';
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  const handlePromptSubmit = async (e: React.FormEvent, promptText?: string) => {
    e.preventDefault();
    
    const currentPrompt = promptText || prompt.trim();
    
    if (!currentPrompt) {
      toast({
        title: "Prompt Required",
        description: "Please enter what you'd like to build first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Save the prompt to localStorage for later use in the builder
    localStorage.setItem('weblisite_initial_prompt', currentPrompt);

    if (isAuthenticated) {
      // User is already authenticated, redirect directly to builder
      toast({
        title: "Redirecting to Builder",
        description: "Taking you to the builder with your prompt...",
      });
      setTimeout(() => setLocation('/builder'), 1000);
    } else {
      // User needs to authenticate first
      setLocation('/auth');
    }
    
    setIsLoading(false);
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

  // Handle successful authentication
  useEffect(() => {
    if (isAuthenticated && !authLoading && localStorage.getItem('weblisite_initial_prompt')) {
      // User just authenticated and we have a saved prompt, redirect to builder
      toast({
        title: "Welcome! Redirecting...",
        description: "Taking you to the builder to start creating.",
      });
      setTimeout(() => setLocation('/builder'), 1500);
    }
  }, [isAuthenticated, authLoading, setLocation]);

  const features = [
    {
      icon: "🧠",
                  title: "Claude 4 Sonnet AI Brain",
      description: "The world's most advanced AI model writes enterprise-grade code instantly. While others struggle with syntax, you're shipping products.",
      benefit: "10x faster than hiring developers",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: "⚡",
      title: "Live Preview Magic",
      description: "Watch your app build itself in real-time. No refreshing, no waiting, no configuration hell. Pure creation at light speed.",
      benefit: "Zero waiting, maximum flow",
      color: "from-green-500 to-blue-500"
    },
    {
      icon: "🚀",
      title: "Instant Global Deployment",
      description: "One click and your app is live worldwide. While competitors fight with servers, you're already scaling.",
      benefit: "Launch in 30 seconds",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "💎",
      title: "Enterprise-Grade Quality",
      description: "Every app built with production-ready standards. Security, performance, scalability - built in by default.",
      benefit: "Fortune 500 quality, startup speed",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: "🎨",
      title: "Designer-Quality UI",
      description: "Beautiful, responsive interfaces that make your users fall in love. No design skills needed.",
      benefit: "Look like you hired a design agency",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: "🔄",
      title: "Natural Language Editing",
      description: "Change anything with plain English. 'Make it blue', 'add a contact form', 'integrate payments' - it just works.",
      benefit: "No code, no limits",
      color: "from-green-500 to-teal-500"
    }
  ];

  const stats = [
    { number: "<10s", label: "Average Build Time" },
    { number: "99.9%", label: "Platform Uptime" },
    { number: "24/7", label: "AI Assistant Available" },
    { number: "0ms", label: "Cold Start Delay" }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white" style={{ scrollBehavior: 'smooth' }}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4 bg-slate-900/50 backdrop-blur-xl border-b border-white/10 sticky top-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <span className="text-blue-400 font-bold text-lg">W</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Weblisite
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-slate-300 hover:text-white transition-colors cursor-pointer">Features</Link>
            <Link href="/pricing" className="text-slate-300 hover:text-white transition-colors cursor-pointer">Pricing</Link>
            {isAuthenticated ? (
              <Link href="/builder">
                <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25">
                  Go to Builder →
                </button>
              </Link>
            ) : (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setLocation('/auth')}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-8 pb-32">
        <div className="max-w-7xl mx-auto text-center">
          {/* Announcement Banner */}
          <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 rounded-full mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></span>
            <span className="text-sm text-blue-200">🎉 Now with Claude 4 Sonnet - The world's most advanced AI</span>
          </div>

          {/* Main Headline */}
          <h1 className={`text-5xl md:text-7xl font-bold mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Stop Coding.
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              Start Creating.
            </span>
          </h1>

          {/* Subheadline */}
          <p className={`text-xl md:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Transform any idea into a <strong className="text-white">production-ready web application</strong> in under 10 minutes. No coding required, no setup needed, no limits on your creativity.
          </p>

          {/* Value Proposition */}
          <div className={`mb-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-lg text-blue-200 mb-4">
              <span className="font-semibold text-yellow-400">WARNING:</span> This platform is so powerful, you might never write code again.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full border border-green-500/30">✓ No Programming Knowledge Required</span>
              <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30">✓ Instant Deployment</span>
              <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">✓ Enterprise-Grade Quality</span>
            </div>
          </div>

          {/* Prompt Input Form */}
          <div className={`max-w-4xl mx-auto mb-16 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Describe Your Dream App - We'll Build It Live
              </h2>
              <p className="text-slate-400 mb-6">
                Watch in amazement as our AI transforms your words into a fully functional web application in real-time. No limits, no compromises.
              </p>
                             <form onSubmit={handlePromptSubmit} className="space-y-6">
                 <div className="relative">
                   <Textarea
                     placeholder="Click to type your web app idea... e.g., 'A task management app with team collaboration' or 'An e-commerce store with payment processing'"
                     value={prompt}
                     onChange={(e) => setPrompt(e.target.value)}
                     className="w-full px-6 py-6 text-lg bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none"
                     rows={4}
                     disabled={isLoading}
                   />
                   <div className="absolute right-4 top-4 text-slate-400">
                     <i className="ri-magic-line text-xl"></i>
                   </div>
                 </div>
                <Button
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  className="w-full py-6 text-xl font-semibold bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-2 border-green-400/50"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></span>
                      Preparing Your Builder...
                    </>
                  ) : (
                    <span className="flex items-center justify-center">
                      🚀 Build My App Now - 100% FREE
                      <span className="ml-3 text-base font-normal bg-yellow-400 text-black px-2 py-1 rounded-full">
                        No Credit Card
                      </span>
                    </span>
                  )}
                </Button>
              </form>
              <p className="text-center text-sm text-slate-400 mt-4">
                ⚡ Your app will be live in under 10 minutes • 🔒 Start building immediately after authentication
              </p>
              <div className="flex justify-center items-center gap-4 mt-4 text-xs text-slate-500">
                <span>✓ No Coding Required</span>
                <span>•</span>
                <span>✓ Instant Deployment</span>
                <span>•</span>
                <span>✓ Professional Results</span>
              </div>
            </div>
          </div>

          {/* Social Proof Stats */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-400 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative z-10 px-6 py-20 bg-gradient-to-r from-red-900/20 to-orange-900/20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Still Wasting <span className="text-red-400">Weeks</span> Building Simple Apps?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-4xl mx-auto">
            While you're stuck in <strong>development hell</strong>, your competitors are already live with their products.
          </p>
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-12 max-w-3xl mx-auto">
            <p className="text-red-200 font-semibold">
              ⏰ Every day you delay is another day your competition gets ahead. Stop building. Start dominating.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-red-500/30 rounded-xl p-6">
              <div className="text-red-400 text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-semibold mb-3 text-red-300">Weeks of Wasted Time</h3>
              <p className="text-slate-400">Setup hell, dependency nightmares, endless configuration files. <strong className="text-red-300">Your competition launched 3 weeks ago.</strong></p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-red-500/30 rounded-xl p-6">
              <div className="text-red-400 text-4xl mb-4">🔥</div>
              <h3 className="text-xl font-semibold mb-3 text-red-300">Burnout & Frustration</h3>
              <p className="text-slate-400">Debugging for days, rewriting the same code, fighting with tools. <strong className="text-red-300">Your passion is dying.</strong></p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-red-500/30 rounded-xl p-6">
              <div className="text-red-400 text-4xl mb-4">💸</div>
              <h3 className="text-xl font-semibold mb-3 text-red-300">Bleeding Money</h3>
              <p className="text-slate-400">Multiple subscriptions, hosting fees, developer salaries. <strong className="text-red-300">Your runway is shrinking fast.</strong></p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-2xl p-8">
            <h3 className="text-3xl font-bold mb-4 text-green-300">🚀 Weblisite Ends the Suffering</h3>
            <p className="text-xl text-slate-200 mb-6">
              <strong>10 minutes from idea to live app.</strong> While others struggle with setup, you're already celebrating your launch.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                <div className="font-semibold text-green-300">⚡ 10 Second Builds</div>
                <div className="text-slate-300">Not 10 minutes. Not 10 hours. 10 seconds.</div>
              </div>
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
                <div className="font-semibold text-blue-300">🎯 Zero Setup</div>
                <div className="text-slate-300">Click, describe, deploy. That's it.</div>
              </div>
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-3">
                <div className="font-semibold text-purple-300">💎 Enterprise Quality</div>
                <div className="text-slate-300">Production-ready from day one.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Weblisite Will <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Transform</span> Your Business
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-6">
              Every feature designed to give you an <strong className="text-white">unfair advantage</strong> over your competition.
            </p>
            <div className="inline-block bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-full px-6 py-2">
              <span className="text-yellow-300 font-semibold">⚠️ Your competitors don't know this exists yet</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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

          <div className="text-center mt-16">
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                🎯 Stop Reading. Start Building.
              </h3>
              <p className="text-lg text-slate-300 mb-6">
                Every second you wait is money left on the table. Your app could be live in 10 minutes.
              </p>
              <div className="space-y-4">
                <Textarea
                  placeholder="Describe your million-dollar app idea... The more specific, the more incredible your results will be.

Examples that work amazing:
• A meal planning app with grocery list integration, nutritional tracking, and recipe suggestions
• A project management tool with time tracking, team chat, and client billing
• An event booking platform with calendar sync, payment processing, and automated reminders"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 resize-none"
                  rows={4}
                  onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && handlePromptSubmit(e as any)}
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

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Unfair Advantage</span>
            </h2>
            <p className="text-xl text-slate-300 mb-4">
              While others struggle with code, you'll be <strong className="text-white">dominating your market</strong>.
            </p>
            <div className="inline-block bg-gradient-to-r from-yellow-500/20 to-red-500/20 border border-yellow-500/50 rounded-full px-6 py-2">
              <span className="text-yellow-300 font-semibold">🔥 Limited Time: Get started before your competition discovers this</span>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
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
                  onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && handleFreeSubmit(e as any)}
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
                  onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && handleStarterSubmit(e as any)}
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
                  onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && handleProSubmit(e as any)}
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
                  onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && handleEnterpriseSubmit(e as any)}
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

          {/* Pricing CTA */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/50 rounded-xl p-4 mb-8 max-w-3xl mx-auto">
              <p className="text-red-200 font-semibold text-lg">
                ⚠️ WARNING: Every day you wait, your competition gets closer to market domination.
              </p>
            </div>
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
                🎯 Last Chance: Build Your Empire App Now
              </h3>
              <p className="text-lg text-slate-300 mb-6">
                Stop letting opportunities slip away. Your next breakthrough app is just one description away.
              </p>
              <div className="space-y-4">
                <Textarea
                  placeholder="Describe the app that will change your life... 

Examples of million-dollar apps built in minutes:
• A subscription management tool that saves businesses $50k/year
• An AI-powered content scheduler that 10x social media engagement  
• A smart inventory system that prevents $100k+ in waste
• A client portal that automates 80% of customer service

What's YOUR million-dollar idea?"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 resize-none"
                  rows={4}
                  onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && handlePromptSubmit(e as any)}
                />
                <Button
                  onClick={handlePromptSubmit}
                  disabled={isLoading || !prompt.trim()}
                  className="w-full py-6 text-xl font-bold bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-red-500/50 border-2 border-red-400/50"
                >
                  {isLoading ? (
                    <>🔥 Creating Your Empire App...</>
                  ) : (
                    <>💰 BUILD MY MILLION-DOLLAR APP NOW</>
                  )}
                </Button>
                <div className="flex justify-center items-center gap-6 text-sm text-slate-400">
                  <span>✓ 100% Free Forever Plan</span>
                  <span>•</span>
                  <span>✓ No Credit Card Required</span>
                  <span>•</span>
                  <span>✓ Live in 10 Minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 px-6 py-20 bg-gradient-to-r from-slate-900/50 to-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-300">
              Everything you need to know about Weblisite
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "How is this different from other development tools?",
                a: "Weblisite is the first AI-native development platform. While others add AI as a feature, we built everything from the ground up with AI at the core. This means faster development, smarter assistance, and zero configuration."
              },
              {
                q: "Do I need any development experience?",
                a: "While development experience helps, our AI assistant is designed to guide anyone through complex tasks. The platform is built to accommodate everyone from complete beginners to senior engineers."
              },
              {
                q: "How secure is my code and data?",
                a: "We use enterprise-grade security with encryption at rest and in transit. Your code is private and secure. We're SOC 2 compliant and follow industry best practices."
              },
              {
                q: "Can I deploy to my own infrastructure?",
                a: "Yes! We support deployment to all major cloud providers including AWS, Netlify, Vercel, Railway, and more. You maintain full control of your deployments."
              },
              {
                q: "What if I'm not satisfied?",
                a: "We offer a 30-day money-back guarantee. If you're not completely satisfied, we'll refund your subscription, no questions asked."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3 text-white">{faq.q}</h3>
                <p className="text-slate-300 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Development?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Experience the future of AI-powered development. Start building incredible applications today - no setup required, no credit card needed.
            </p>
            
            <div className="max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Tell us what you want to build
              </h3>
              <form onSubmit={handlePromptSubmit} className="space-y-4">
                <Textarea
                  placeholder="e.g., A social media dashboard with real-time analytics, user management, post scheduling, engagement tracking, and mobile app integration..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full px-6 py-4 text-lg bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 rounded-xl resize-none"
                  rows={3}
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  className="w-full py-4 text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/50"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></span>
                      Getting Ready...
                    </>
                  ) : (
                    <>
                      🚀 Start Building Now
                    </>
                  )}
                </Button>
              </form>
            </div>

            <div className="flex items-center justify-center space-x-6 text-sm text-slate-400">
              <div className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Free plan: 5 prompts daily
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                No credit card required
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Upgrade anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 bg-slate-900/50 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-lg">W</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Weblisite
                </span>
              </div>
              <p className="text-slate-400 text-sm">
                The future of AI-powered development is here.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/builder" className="hover:text-white transition-colors">Try Free</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/status" className="hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-slate-400 mb-4 md:mb-0">
              © 2024 Weblisite. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-slate-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/security" className="hover:text-white transition-colors">Security</Link>
            </div>
          </div>
        </div>
      </footer>


    </div>
  );
} 