import React, { useState, useEffect } from 'react';
import { Search, Home, ArrowLeft, MapPin, Compass, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function NotFoundPage() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [glitchText, setGlitchText] = useState('404');
  const [showEye, setShowEye] = useState(true);

  // Glitch effect for 404 text
  useEffect(() => {
    const glitchChars = ['4', '0', '4', '█', '▓', '▒', '░'];
    const interval = setInterval(() => {
      const randomText = Array.from({length: 3}, () => 
        glitchChars[Math.floor(Math.random() * glitchChars.length)]
      ).join('');
      setGlitchText(randomText);
      
      setTimeout(() => setGlitchText('404'), 100);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Eye blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowEye(false);
      setTimeout(() => setShowEye(true), 150);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simulate search
    setTimeout(() => {
      setIsSearching(false);
      // You can add actual search logic here
      alert(`Searching for: ${searchQuery}`);
    }, 1500);
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const quickLinks = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Dashboard', icon: Compass, path: '/dashboard' },
    { name: 'Profile', icon: MapPin, path: '/profile' },
    { name: 'Settings', icon: AlertCircle, path: '/settings' }
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20"></div>
        <div className="grid grid-cols-8 md:grid-cols-12 gap-4 h-full">
          {Array.from({length: 96}).map((_, i) => (
            <div 
              key={i} 
              className="border border-gray-700/30 animate-pulse"
              style={{animationDelay: `${i * 0.1}s`}}
            ></div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl w-full text-center relative z-10">
        
        {/* Giant 404 with Glitch Effect */}
        <div className="mb-8 relative">
          <div className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 mb-4 font-mono tracking-wider">
            {glitchText}
          </div>
          
          {/* Floating Eye */}
          <div className="absolute top-8 right-1/2 transform translate-x-12">
            <div className="relative">
              {showEye ? (
                <Eye className="w-8 h-8 text-red-400 animate-bounce" />
              ) : (
                <EyeOff className="w-8 h-8 text-red-400" />
              )}
              <div className="absolute -inset-2 bg-red-500/20 rounded-full animate-ping"></div>
            </div>
          </div>

          {/* Glitch Lines */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-0 w-full h-0.5 bg-red-500/50 animate-pulse"></div>
            <div className="absolute top-3/4 left-0 w-full h-0.5 bg-blue-500/50 animate-pulse delay-500"></div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            The page you're looking for has vanished into the digital void
          </p>
          <p className="text-gray-400">
            It might have been moved, deleted, or you entered the wrong URL
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                placeholder="Search for what you need..."
                className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
              <button
                onClick={handleSearch}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              {isSearching && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Quick Navigation</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => window.location.href = link.path}
                className="flex flex-col items-center space-y-2 bg-gray-900/50 border border-gray-700/50 rounded-xl p-4 hover:border-blue-500/50 hover:bg-gray-800/50 transition-all duration-200 transform hover:scale-105"
              >
                <link.icon className="w-6 h-6 text-blue-400" />
                <span className="text-sm text-gray-300 font-medium">{link.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button
            onClick={handleGoHome}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </button>
          
          <button
            onClick={handleGoBack}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Fun Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900/30 border border-red-500/30 rounded-xl p-4">
            <div className="text-2xl font-bold text-red-400 mb-1">404</div>
            <div className="text-sm text-gray-400">Error Code</div>
          </div>
          
          <div className="bg-gray-900/30 border border-yellow-500/30 rounded-xl p-4">
            <div className="text-2xl font-bold text-yellow-400 mb-1">∞</div>
            <div className="text-sm text-gray-400">Pages in the Void</div>
          </div>
          
          <div className="bg-gray-900/30 border border-green-500/30 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-400 mb-1">0%</div>
            <div className="text-sm text-gray-400">Chance of Recovery</div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="p-4 bg-gray-900/20 border border-gray-700/30 rounded-lg">
          <div className="text-sm text-gray-400 mb-2">
            🤖 <strong className="text-gray-300">Did you know?</strong> This page doesn't exist, but your creativity does!
          </div>
          <div className="text-xs text-gray-500">
            If you believe this is an error, please contact our support team
          </div>
        </div>

        {/* Floating Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-500 rounded-full animate-ping opacity-20"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-red-500 rounded-full animate-ping opacity-30 delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping opacity-25 delay-2000"></div>
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-yellow-500 rounded-full animate-ping opacity-20 delay-3000"></div>
        </div>
      </div>
    </div>
  );
}