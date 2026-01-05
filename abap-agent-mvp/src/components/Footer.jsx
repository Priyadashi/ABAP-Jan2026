import React from 'react';
import { Code2, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Code2 className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold">ABAP AI Assistant</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Generate production-ready ABAP code with AI-powered assistance.
                Following SAP best practices and clean code principles.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#templates-section" className="text-gray-400 hover:text-white transition-colors">
                    Templates
                  </a>
                </li>
                <li>
                  <a href="#chat-section" className="text-gray-400 hover:text-white transition-colors">
                    AI Assistant
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>

            {/* RICEF Types */}
            <div>
              <h3 className="text-lg font-bold mb-4">RICEF Types</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-gray-400">Reports</li>
                <li className="text-gray-400">Interfaces</li>
                <li className="text-gray-400">Conversions</li>
                <li className="text-gray-400">Enhancements</li>
                <li className="text-gray-400">Forms</li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Copyright */}
              <p className="text-sm text-gray-400 text-center md:text-left">
                © {currentYear} ABAP AI Assistant. All rights reserved.
              </p>

              {/* Made with love */}
              <p className="flex items-center gap-2 text-sm text-gray-400">
                Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> for SAP Developers
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
