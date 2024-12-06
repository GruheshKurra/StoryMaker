import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Bug, 
  MessageCircle, 
  FileText, 
  ChevronRight, 
  TrendingUp 
} from 'lucide-react';

const FeatureCard = ({ Icon, title, description, link }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.02 }}
    className="bg-green-900/40 backdrop-blur-sm p-6 rounded-xl ring-1 ring-green-800/50 hover:bg-green-800/40 transition-all duration-300"
  >
    <div className="bg-green-800/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-green-400" />
    </div>
    <h3 className="text-xl font-semibold text-green-300 mb-2">{title}</h3>
    <p className="text-green-100/90 mb-4">{description}</p>
    <Link 
      to={link} 
      className="inline-flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors group"
    >
      <span>Learn More</span>
      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
    </Link>
  </motion.div>
);

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative pt-20 pb-32 px-4"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 inline-flex items-center bg-green-900/50 rounded-full px-4 py-2 ring-1 ring-green-700/50"
          >
            <Leaf className="w-5 h-5 text-green-400" />
            <span className="text-green-200 ml-2">AI-Powered Farm Management</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-green-100 mb-6"
          >
            Smart Farming Solutions with <br />
            <span className="text-green-400">Advanced AI Technology</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-green-200 mb-8 max-w-2xl mx-auto"
          >
            Leverage AI technology for plant analysis, pest detection, price predictions, and connect with other farmers.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link 
              to="/plant-analysis"
              className="bg-green-500 text-green-950 px-6 py-3 rounded-lg font-semibold hover:bg-green-400 transition-colors shadow-lg hover:shadow-xl"
            >
              Analyze Plant
            </Link>
            <Link 
              to="/price-prediction"
              className="bg-green-900 text-green-100 px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors ring-1 ring-green-700 shadow-lg hover:shadow-xl"
            >
              Check Prices
            </Link>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-green-950/50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              Icon={Leaf}
              title="Plant Analysis"
              description="Upload plant photos for instant disease detection and get detailed health analysis using advanced AI."
              link="/plant-analysis"
            />
            <FeatureCard 
              Icon={Bug}
              title="Pest Analysis"
              description="Identify harmful pests and get comprehensive treatment recommendations for effective control."
              link="/pest-analysis"
            />
            <FeatureCard 
              Icon={TrendingUp}
              title="Price Prediction"
              description="Get AI-powered price predictions for vegetables to make informed market decisions."
              link="/price-prediction"
            />
            <FeatureCard 
              Icon={MessageCircle}
              title="Farmers' Forum"
              description="Connect with experienced farmers, share knowledge, and get advice for your farming queries."
              link="/forum"
            />
            <FeatureCard 
              Icon={FileText}
              title="Agricultural News"
              description="Stay updated with the latest farming news, trends, and best practices in agriculture."
              link="/news"
            />
          </div>
        </div>

        {/* Additional Decorative Element */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-800/50 to-transparent" />
        </div>
      </section>
    </div>
  );
};

export default Home;