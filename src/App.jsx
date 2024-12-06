import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PlantAnalysis from './components/PlantAnalysis';
import PestAnalysis from './pages/PestAnalysis';
import News from './pages/News';
import Forum from './pages/Forum';
import VegetablePricePrediction from './pages/VegetablePricePrediction';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-900 via-green-950 to-green-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/plant-analysis" element={<PlantAnalysis />} />
            <Route path="/pest-analysis" element={<PestAnalysis />} />
            <Route path="/news" element={<News />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/price-prediction" element={<VegetablePricePrediction />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;