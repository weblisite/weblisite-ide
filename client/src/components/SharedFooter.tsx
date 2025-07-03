import React from 'react';
import { Link } from 'wouter';

export default function SharedFooter() {
  return (
    <footer className="relative z-10 px-6 py-12 bg-slate-900/50 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/">
              <div className="flex items-center space-x-2 mb-4 cursor-pointer">
                <div className="w-8 h-8 flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-lg">W</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Weblisite
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm">
              The future of AI-powered development is here.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Product</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/features" className="hover:text-white transition-colors cursor-pointer">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors cursor-pointer">Pricing</Link></li>
              <li><Link href="/builder" className="hover:text-white transition-colors cursor-pointer">Try Free</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-white transition-colors cursor-pointer">About</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors cursor-pointer">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors cursor-pointer">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/help" className="hover:text-white transition-colors cursor-pointer">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors cursor-pointer">Contact</Link></li>
              <li><Link href="/status" className="hover:text-white transition-colors cursor-pointer">Status</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-slate-400 mb-4 md:mb-0">
            © 2024 Weblisite. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm text-slate-400">
            <Link href="/privacy" className="hover:text-white transition-colors cursor-pointer">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors cursor-pointer">Terms</Link>
            <Link href="/security" className="hover:text-white transition-colors cursor-pointer">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 