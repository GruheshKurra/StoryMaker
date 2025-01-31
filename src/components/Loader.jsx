import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const loadingMessages = [
  "Opening the ancient book of tales...",
  "Summoning creative spirits...",
  "Gathering magical ingredients...",
  "Mixing stardust with imagination...",
  "Consulting with wise storytellers...",
  "Brewing the perfect story potion...",
  "Casting the storytelling spell...",
  "Weaving threads of narrative...",
  "Awakening your characters...",
  "Painting magical landscapes...",
  "Growing enchanted forests...",
  "Building mystical kingdoms...",
  "Infusing scenes with wonder...",
  "Sprinkling fairy dust...",
  "Adding dramatic plot twists...",
  "Crafting magical moments...",
  "Polishing dragon scales...",
  "Tuning unicorn melodies...",
  "Capturing moonlight in bottles...",
  "Stirring in secret ingredients...",
  "Enchanting every word...",
  "Adding final touches of magic...",
  "Binding the story with starlight...",
  "Sealing the enchantment...",
  "Preparing to reveal your tale..."
];

export const Loader = () => {
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % loadingMessages.length);
    }, 3000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/95 z-50">
      <div className="bg-gray-800/95 backdrop-blur-sm rounded-3xl p-12 border border-gray-700 shadow-2xl flex flex-col items-center gap-6">
        <motion.div
          className="relative"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full" />
          <Sparkles className="w-16 h-16 text-blue-400 relative z-10" />
        </motion.div>
        
        <motion.div
          key={currentMessage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: 0,
              }}
            />
            <motion.div
              className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: 0.2,
              }}
            />
            <motion.div
              className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: 0.4,
              }}
            />
          </div>

          <span className="text-xl font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent min-w-[200px] text-center">
            {loadingMessages[currentMessage]}
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export const SimpleLoader = () => (
  <div className="flex items-center gap-2">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: i * 0.2,
        }}
      />
    ))}
  </div>
);