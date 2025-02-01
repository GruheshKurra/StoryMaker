import { motion } from 'framer-motion';

export function AnimatedText({ text, emphasis = false }) {
  const words = text.split(' ');
  
  return (
    <motion.p className="leading-relaxed">
      {words.map((word, i) => (
        <motion.span
          key={i}
          className={`inline-block ${emphasis ? 'text-blue-400 font-bold' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: i * 0.1,
            ease: [0.48, 0.15, 0.25, 0.96]
          }}
        >
          {word}{' '}
        </motion.span>
      ))}
    </motion.p>
  );
}