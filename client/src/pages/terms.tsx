import React from 'react';
import SharedHeader from '../components/SharedHeader';
import SharedFooter from '../components/SharedFooter';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <SharedHeader />

      <div className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Terms of Service</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Terms and conditions for using Weblisite
            </p>
            <p className="text-slate-400 mt-4">
              Last updated: December 25, 2024
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">Acceptance of Terms</h2>
              <p className="text-slate-300 leading-relaxed">
                By accessing and using Weblisite, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">Use License</h2>
              <p className="text-slate-300 mb-4">
                Permission is granted to temporarily use Weblisite for personal and commercial purposes. This includes:
              </p>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Creating applications using our AI platform</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Deploying and commercializing your created applications</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Using generated code in your projects</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">User Responsibilities</h2>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start space-x-3">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>You are responsible for maintaining the confidentiality of your account</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>You must not use the service for illegal or unauthorized purposes</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>You must not attempt to harm or disrupt our service</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>You must comply with usage limits of your chosen plan</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">Service Availability</h2>
              <p className="text-slate-300 leading-relaxed">
                We strive to provide a reliable service but cannot guarantee 100% uptime. We reserve the right to 
                modify, suspend, or discontinue the service at any time. We will provide reasonable notice for 
                any planned maintenance or significant changes.
              </p>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">Billing and Refunds</h2>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Subscription fees are billed monthly and non-refundable except as required by law</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>You may cancel your subscription at any time</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Unused prompts do not roll over to the next billing period</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
              <p className="text-slate-300 leading-relaxed">
                Weblisite shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses, 
                resulting from your use of the service.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Questions About These Terms?</h2>
              <p className="text-slate-300 mb-6">
                If you have any questions about these Terms of Service, please contact us.
              </p>
              
              <a 
                href="mailto:antony@weblisite.com?subject=Terms%20of%20Service%20Question" 
                className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
              >
                📧 Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>

      <SharedFooter />
    </div>
  );
} 