import { StoryGenerator } from './components/StoryGenerator';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toaster } from 'sonner';

export const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-blue-900/20 to-gray-900">
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(31, 41, 55, 0.8)',
            color: '#fff',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(75, 85, 99, 0.4)',
          },
          className: 'rounded-xl shadow-xl',
        }}
      />
      <Navbar />
      <main className="flex-grow pt-20 pb-12">
        <StoryGenerator />
      </main>
      <Footer />
    </div>
  );
};

export default App;