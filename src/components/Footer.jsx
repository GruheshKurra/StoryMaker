import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Github, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-green-900/90 border-t border-green-800">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-green-900" />
            </div>
            <span className="text-lg font-semibold text-green-300">FarmCare</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link to="/" className="text-green-400 hover:text-green-300 transition-colors">
              Home
            </Link>
            <Link to="/plant-analysis" className="text-green-400 hover:text-green-300 transition-colors">
              Analysis
            </Link>
            <Link to="/news" className="text-green-400 hover:text-green-300 transition-colors">
              News
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 text-center text-sm text-green-400">
          © {new Date().getFullYear()} FarmCare. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;