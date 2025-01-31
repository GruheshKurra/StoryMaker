import { Book, Github, Twitter } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900/80 backdrop-blur-lg border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <Book className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Enchanted Tales
            </span>
          </div>
          
          <p className="text-gray-400 text-center max-w-xl">
            Weave magical stories with the power of AI. Create enchanting tales filled with wonder and bring them to life with beautiful illustrations.
          </p>
          
          <div className="flex items-center gap-6">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-6 h-6" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Twitter className="w-6 h-6" />
            </a>
          </div>
          
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Enchanted Tales. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};