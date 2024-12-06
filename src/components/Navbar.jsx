import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Leaf, 
  Bug, 
  MessageCircle, 
  FileText, 
  Menu, 
  X,
  TrendingUp
} from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/plant-analysis', icon: Leaf, label: 'Plant Analysis' },
    { path: '/pest-analysis', icon: Bug, label: 'Pest Analysis' },
    { path: '/price-prediction', icon: TrendingUp, label: 'Price Prediction' },
    { path: '/forum', icon: MessageCircle, label: 'Forum' },
    { path: '/news', icon: FileText, label: 'News' }
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <nav className="bg-green-900/95 backdrop-blur-sm sticky top-0 z-50 border-b border-green-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <Leaf className="w-6 h-6 text-green-400" />
            <span className="text-green-50 font-bold text-xl">FarmCare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors
                  ${isActivePath(link.path) 
                    ? 'bg-green-800 text-green-200' 
                    : 'text-green-100 hover:bg-green-800/50 hover:text-green-200'}`}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-green-100 hover:bg-green-800/50 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-green-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors
                    ${isActivePath(link.path)
                      ? 'bg-green-800 text-green-200'
                      : 'text-green-100 hover:bg-green-800/50 hover:text-green-200'}`}
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;