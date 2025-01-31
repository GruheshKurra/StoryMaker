import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Book, ChevronRight, ChevronLeft, Volume2, VolumeX, Sparkles, RefreshCw, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader } from './Loader';

const API_KEY = 'AIzaSyD7Gv1Nefuo5TipsBrHYvjwuIaKkh2WbtY';
const UNSPLASH_ACCESS_KEY = 's4RqP4K0kv3qWVGS46YdXuBqKccITcb5xRMmtW2gkys';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const StoryGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [pageImages, setPageImages] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [direction, setDirection] = useState(0);
  const [promptTags, setPromptTags] = useState([]);
  const speechSynthesisRef = useRef(null);

  useEffect(() => {
    if (story) {
      const paragraphs = story.split('\n\n').filter(para => para.trim());
      setPages(paragraphs);
      setCurrentPage(0);
    }
  }, [story]);

  useEffect(() => {
    if (speechSynthesisRef.current && currentPage < pages.length) {
      speechSynthesis.cancel();
      speechSynthesisRef.current = null;
      setIsPlaying(false);
      if (isPlaying) {
        speak(pages[currentPage]);
      }
    }
  }, [currentPage]);

  const extractTagsFromPrompt = async (promptText) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              role: "user",
              parts: [{ text: `Extract exactly 3 descriptive keywords from this story prompt that would help generate relevant images. Only extract words that appear in the prompt and are visually descriptive. Return only the keywords separated by commas: "${promptText}"` }]
            }]
          })
        }
      );
      
      if (!response.ok) throw new Error('Failed to extract tags');
      const data = await response.json();
      const tags = data.candidates[0].content.parts[0].text
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      return tags.length ? tags : promptText.split(' ').slice(0, 3);
    } catch (error) {
      console.error('Error extracting tags:', error);
      return promptText.split(' ').slice(0, 3);
    }
  };

  const fetchImageForPage = async (tags) => {
    try {
      await delay(1000);
      const query = `${tags.join(' ')} digital art`;
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      if (!response.ok) throw new Error('Failed to fetch image');
      const data = await response.json();
      return {
        url: data.urls.regular,
        tags: tags
      };
    } catch (error) {
      console.error('Error fetching image:', error);
      return null;
    }
  };

  const generateImagesForStory = async (pages, tags) => {
    const images = [];
    
    for (let i = 0; i < pages.length; i++) {
      const image = await fetchImageForPage(tags);
      images.push(image);
    }
    
    return images.filter(Boolean);
  };

  const generateStory = async () => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              role: "user",
              parts: [{ text: `Create a magical story about: ${prompt}. Divide it into exactly 5 paragraphs. Make it fantasy-themed with vivid descriptions.` }]
            }],
            generationConfig: {
              temperature: 0.9,
              topK: 40,
              topP: 1,
              maxOutputTokens: 1024
            }
          })
        }
      );

      if (!response.ok) throw new Error('Failed to generate story');
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error generating story:', error);
      throw error;
    }
  };

  const speak = (text) => {
    if (speechSynthesisRef.current) {
      speechSynthesis.cancel();
      speechSynthesisRef.current = null;
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      speechSynthesisRef.current = null;
      setIsPlaying(false);
    };

    speechSynthesisRef.current = utterance;
    speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handlePageChange = (newDirection) => {
    if (speechSynthesisRef.current) {
      speechSynthesis.cancel();
      speechSynthesisRef.current = null;
      setIsPlaying(false);
    }
    setDirection(newDirection);
    setCurrentPage(prev => {
      if (newDirection === 1 && prev < pages.length - 1) return prev + 1;
      if (newDirection === -1 && prev > 0) return prev - 1;
      return prev;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a story prompt');
      return;
    }

    setLoading(true);
    try {
      const tags = await extractTagsFromPrompt(prompt);
      setPromptTags(tags);
      
      const newStory = await generateStory();
      if (newStory) {
        const paragraphs = newStory.split('\n\n').filter(para => para.trim());
        const storyImages = await generateImagesForStory(paragraphs, tags);
        setPageImages(storyImages);
        setStory(newStory);
        toast.success('✨ Your magical story is ready!');
      }
    } catch (error) {
      toast.error('Failed to generate story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <AnimatePresence mode="wait">
        {!story ? (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 md:p-16 shadow-2xl border border-gray-700"
          >
            <div className="flex flex-col items-center justify-center space-y-8 md:space-y-10">
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
                <Wand2 className="w-20 h-20 md:w-32 md:h-32 text-blue-400 relative z-10" />
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent text-center">
                Enchanted Tales
              </h1>

              <div className="text-xl md:text-2xl text-gray-400 text-center max-w-2xl">
                Whisper your wishes, and watch as AI weaves a magical tale just for you...
              </div>

              <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6 md:space-y-8">
                <div className="relative group">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Once upon a time..."
                    className="w-full p-6 md:p-8 bg-gray-900/50 border-2 border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 text-gray-100 placeholder-gray-500 text-lg md:text-xl transition-all duration-300 hover:border-blue-500/50"
                    rows={4}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-6 md:py-8 px-8 md:px-10 rounded-2xl text-xl md:text-2xl font-medium shadow-xl transition-all duration-300 hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4"
                >
                  {loading ? (
                    <>
                      <Loader />
                      <span>Weaving Your Tale...</span>
                    </>
                  ) : (
                    <>
                      Begin the Magic
                      <Sparkles className="w-6 h-6 md:w-8 md:h-8" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="story"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 md:p-16 shadow-2xl border border-gray-700"
          >
            <div className="min-h-[600px] md:min-h-[800px] flex flex-col">
              <div className="flex justify-between items-center mb-8 md:mb-12">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {prompt}
                </h2>
                <div className="text-lg md:text-xl text-gray-400 font-medium">
                  Page {currentPage + 1} of {pages.length}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 md:gap-16 flex-grow">
                <motion.div 
                  className="w-full md:w-1/2"
                  initial={{ opacity: 0, x: direction >= 0 ? 100 : -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction >= 0 ? -100 : 100 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="md:sticky md:top-8">
                    {pageImages[currentPage] && (
                      <motion.div 
                        className="rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-700 relative group"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.img 
                          key={pageImages[currentPage].url}
                          src={pageImages[currentPage].url} 
                          alt={`Story Illustration ${currentPage + 1}`} 
                          className="w-full h-[300px] md:h-[600px] object-cover transition-transform duration-300 group-hover:scale-105"
                          initial={{ scale: 1.1 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5 }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                          <div className="flex flex-wrap gap-2">
                            {pageImages[currentPage].tags.map((tag, i) => (
                              <span key={i} className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                <motion.div 
                  className="w-full md:w-1/2"
                  initial={{ opacity: 0, x: direction >= 0 ? 100 : -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction >= 0 ? -100 : 100 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-gray-800/30 p-6 md:p-10 rounded-3xl border border-gray-700 shadow-xl">
                    <div className="text-xl md:text-2xl text-gray-200 leading-relaxed font-serif">
                    {pages[currentPage]}
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="flex items-center justify-between mt-8 md:mt-16 pt-8 border-t border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(-1)}
                  disabled={currentPage === 0}
                  className="text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed p-2 md:p-3 hover:bg-gray-800/50 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => speak(pages[currentPage])}
                  className="p-4 md:p-6 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-full transition-colors flex items-center gap-3"
                >
                  {isPlaying ? (
                    <>
                      <VolumeX className="w-8 h-8 md:w-10 md:h-10" />
                      <span className="hidden md:inline text-lg">Stop Reading</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-8 h-8 md:w-10 md:h-10" />
                      <span className="hidden md:inline text-lg">Read Aloud</span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === pages.length - 1}
                  className="text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed p-2 md:p-3 hover:bg-gray-800/50 rounded-full transition-colors"
                >
                  <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setStory('');
                  setPrompt('');
                  setPages([]);
                  setPageImages([]);
                  setPromptTags([]);
                  setCurrentPage(0);
                  if (speechSynthesisRef.current) {
                    speechSynthesis.cancel();
                    speechSynthesisRef.current = null;
                    setIsPlaying(false);
                  }
                }}
                className="mt-8 md:mt-12 text-gray-400 hover:text-white transition-colors text-lg md:text-xl flex items-center gap-3 group"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", paused: true }}
                  className="group-hover:animate-spin"
                >
                  <RefreshCw className="w-5 h-5 md:w-6 md:h-6" />
                </motion.div>
                Create Another Story
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && <Loader />}
    </div>
  );
};