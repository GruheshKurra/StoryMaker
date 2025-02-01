import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../context/AudioContext';
import { StoryBackground } from './StoryBackground';
import { AnimatedText } from './AnimatedText';
import { Volume2, VolumeX } from 'lucide-react';

export function EnhancedStory({ story, storyType = 'default' }) {
  const [currentPage, setCurrentPage] = useState(0);
  const { isEnabled, enableAudio, playSound } = useAudio();
  const pages = story.split('\n\n').filter(p => p.trim());

  const handlePageChange = (direction) => {
    const newPage = currentPage + direction;
    if (newPage >= 0 && newPage < pages.length) {
      playSound('page-turn');
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="relative min-h-screen">
      <StoryBackground type={storyType} />

      {!isEnabled && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={enableAudio}
          className="fixed top-4 right-4 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full text-white hover:bg-white/20 transition-all duration-300 z-50 flex items-center gap-2"
        >
          <Volume2 className="w-5 h-5" />
          Enable Audio
        </motion.button>
      )}

      <div className="relative z-10 min-h-screen px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -200 }}
            className="max-w-4xl mx-auto bg-gray-900/70 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10"
          >
            <AnimatedText
              text={pages[currentPage]}
              emphasis={pages[currentPage].includes('!')}
            />
          </motion.div>
        </AnimatePresence>

        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handlePageChange(-1)}
            disabled={currentPage === 0}
            className="p-4 bg-white/10 backdrop-blur-lg rounded-full hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handlePageChange(1)}
            disabled={currentPage === pages.length - 1}
            className="p-4 bg-white/10 backdrop-blur-lg rounded-full hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </motion.button>
        </div>
      </div>
    </div>
  );
}