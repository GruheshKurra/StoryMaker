import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export const StoryBackground = ({ storyType = 'fantasy' }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const backgrounds = {
    fantasy: (
      <>
        <div className="fixed inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-gray-900" />
        <div className="stars" />
        <div className="twinkling" />
      </>
    ),
    mystery: (
      <>
        <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900" />
        <div className="fog" />
      </>
    ),
    default: (
      <>
        <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900" />
        <div className="stars" />
      </>
    )
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-0"
    >
      {backgrounds[storyType] || backgrounds.default}
    </motion.div>
  );
};