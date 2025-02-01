import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { 
  Book, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  RefreshCw, 
  Wand2,
  BookOpen,
  Stars,
  Moon,
  Sun,
  Wind,
  Cloud,
  Palette
} from 'lucide-react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Loader } from './Loader';

const API_KEY = 'AIzaSyD7Gv1Nefuo5TipsBrHYvjwuIaKkh2WbtY';
const UNSPLASH_ACCESS_KEY = 's4RqP4K0kv3qWVGS46YdXuBqKccITcb5xRMmtW2gkys';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const FloatingParticle = ({ delay = 0 }) => (
  <motion.div
    className="absolute w-1 h-1 bg-white rounded-full"
    animate={{
      y: [-20, -40, -20],
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
    }}
    transition={{
      duration: 2,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

const MagicSparkles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <FloatingParticle key={i} delay={i * 0.1} />
    ))}
  </div>
);

const BackgroundEffects = () => (
  <>
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-blue-900/20 to-gray-900" />
    <div className="fixed inset-0 bg-[url('/stars.png')] opacity-50 animate-twinkle" />
    <div className="fixed inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 animate-gradient" />
  </>
);

const ThemeSelector = ({ theme, setTheme }) => {
  const themes = [
    { id: 'fantasy', icon: Stars, label: 'Fantasy' },
    { id: 'mystery', icon: Moon, label: 'Mystery' },
    { id: 'adventure', icon: Sun, label: 'Adventure' },
    { id: 'fairytale', icon: Wind, label: 'Fairytale' },
  ];

  return (
    <div className="flex gap-2 mb-4">
      {themes.map(({ id, icon: Icon, label }) => (
        <motion.button
          key={id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(id)}
          className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            theme === id 
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' 
              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-gray-700'
          }`}
        >
          <Icon className="w-4 h-4" />
          <span className="text-sm">{label}</span>
        </motion.button>
      ))}
    </div>
  );
};

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
  const [theme, setTheme] = useState('fantasy');
  const speechSynthesisRef = useRef(null);
  const controls = useAnimation();

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
              parts: [{ text: `Create a ${theme} story about: ${prompt}. Divide it into exactly 5 paragraphs. Make it magical with vivid descriptions.` }]
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
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      speechSynthesisRef.current = null;
      setIsPlaying(false);
    };

    speechSynthesisRef.current = utterance;
    speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handlePageChange = async (newDirection) => {
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
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundEffects />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <AnimatePresence mode="wait">
          {!story ? (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50 shadow-xl">
                <div className="flex flex-col items-center space-y-8">
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
                    <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full" />
                    <div className="relative z-10 bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full">
                      <Wand2 className="w-12 h-12 text-white" />
                    </div>
                    <MagicSparkles />
                  </motion.div>

                  <div className="space-y-4 text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                      Enchanted Tales
                    </h1>
                    <p className="text-lg text-gray-300">
                      Whisper your wishes, and watch as magic unfolds...
                    </p>
                  </div>

                  <ThemeSelector theme={theme} setTheme={setTheme} />

                  <form onSubmit={handleSubmit} className="w-full space-y-6">
                    <div className="relative group">
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Once upon a time..."
                        className="w-full p-6 bg-gray-900/90 rounded-lg border border-gray-700/50 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-gray-100 placeholder-gray-500 text-lg transition-all duration-300"
                        rows={4}
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 py-4 rounded-xl text-white text-lg font-medium shadow-xl transition-colors flex items-center justify-center gap-3"
                    >
                      {loading ? (
                        <>
                          <Loader />
                          <span>Weaving Your Tale...</span>
                        </>
                      ) : (
                        <>
                          <span>Begin the Magic</span>
                          <Sparkles className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                  </form>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="story"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto"
            >
              <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-xl overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {prompt}
                    </h2>
                    <div className="flex items-center gap-4">
                      <span className="text-lg text-gray-400">
                        {currentPage + 1} of {pages.length}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => speak(pages[currentPage])}
                        className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-full transition-colors"
                      >
                        {isPlaying ? (
                          <VolumeX className="w-5 h-5" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </motion.button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pageImages[currentPage] && (
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300" />
                        <div className="relative rounded-xl overflow-hidden aspect-video">
                          <img
                            src={pageImages[currentPage].url}
                            alt="Story Illustration"
                            className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <div className="flex flex-wrap gap-2">
                              {pageImages[currentPage].tags.map((tag, i) => (
                                <span 
                                  key={i} 
                                  className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                      <p className="text-lg text-gray-200 leading-relaxed font-serif">
                        {pages[currentPage]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-700/50">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(-1)}
                      disabled={currentPage === 0}
                      className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-full"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setStory('');
                        setPrompt('');
                        setPages([]);
                        setPageImages([]);
                        setCurrentPage(0);
                        if (speechSynthesisRef.current) {
                          speechSynthesis.cancel();
                          speechSynthesisRef.current = null;
                          setIsPlaying(false);
                        }
                      }}
                      className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-gray-300 rounded-lg flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>New Story</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === pages.length - 1}
                      className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-full"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && <Loader />}
      </div>
    </div>
  );
};