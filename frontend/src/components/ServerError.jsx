import React, { useState, useEffect } from 'react';
import { RefreshCw, Server, Wifi, AlertTriangle, Clock, ArrowLeft } from 'lucide-react';

export default function ServerErrorPage() {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [dots, setDots] = useState('');

  // Animated dots for loading effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    // Simulate retry attempt
    setTimeout(() => {
      setIsRetrying(false);
    }, 2000);
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 mt-18">
      <div className="max-w-2xl w-full text-center">
        
        {/* Main Error Illustration */}
        <div className="mb-8 relative">
          {/* Server Icon with Animation */}
          <div className="relative mx-auto w-32 h-32 mb-6">
            <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-red-500/10 rounded-full animate-pulse delay-75"></div>
            <div className="absolute inset-4 bg-gray-900 rounded-full border-2 border-red-500/30 flex items-center justify-center">
              <Server className="w-12 h-12 text-red-400" />
            </div>
            {/* Disconnected WiFi signals */}
            <div className="absolute -top-2 -right-2">
              <div className="relative">
                <Wifi className="w-8 h-8 text-gray-600" />
                <div className="absolute inset-0 bg-red-500 w-0.5 h-10 rotate-45 translate-x-4 translate-y-0"></div>
              </div>
            </div>
          </div>

          {/* Floating Error Symbols */}
          <div className="absolute top-0 left-1/4 animate-bounce delay-100">
            <AlertTriangle className="w-6 h-6 text-yellow-400 opacity-60" />
          </div>
          <div className="absolute top-12 right-1/4 animate-bounce delay-300">
            <AlertTriangle className="w-4 h-4 text-red-400 opacity-40" />
          </div>
          <div className="absolute bottom-8 left-1/3 animate-bounce delay-500">
            <Clock className="w-5 h-5 text-orange-400 opacity-50" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Server Busy
          </h1>
          <div className="text-xl text-gray-300 mb-2">
            Our servers are experiencing high traffic
          </div>
          <div className="text-gray-400">
            Please try again in a few moments{dots}
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900/50 border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="text-sm font-medium text-yellow-400 mb-1">High Traffic</div>
            <div className="text-xs text-gray-400">Server overload detected</div>
          </div>
          
          <div className="bg-gray-900/50 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-center justify-center mb-2">
              <Server className="w-6 h-6 text-red-400" />
            </div>
            <div className="text-sm font-medium text-red-400 mb-1">Service Unavailable</div>
            <div className="text-xs text-gray-400">Temporary interruption</div>
          </div>
          
          <div className="bg-gray-900/50 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-center justify-center mb-2">
              <RefreshCw className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-sm font-medium text-blue-400 mb-1">Auto Retry</div>
            <div className="text-xs text-gray-400">Attempting reconnection</div>
          </div>
        </div>

        {/* Error Code */}
        <div className="mb-8 p-4 bg-gray-900/30 border border-gray-700/50 rounded-lg">
          <div className="text-gray-500 text-sm mb-1">Error Details</div>
          <div className="font-mono text-red-400 text-lg">
            HTTP 503 - Service Temporarily Unavailable
          </div>
          {retryCount > 0 && (
            <div className="text-xs text-gray-400 mt-2">
              Retry attempts: {retryCount}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
          >
            <RefreshCw className={`w-5 h-5 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>{isRetrying ? 'Retrying...' : 'Try Again'}</span>
          </button>
          
          <button
            onClick={handleGoBack}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Loading Progress Bar */}
        {isRetrying && (
          <div className="mt-6">
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse"></div>
            </div>
            <div className="text-sm text-gray-400 mt-2">
              Connecting to server...
            </div>
          </div>
        )}

        {/* Footer Message */}
        <div className="mt-12 p-4 bg-gray-900/20 border border-gray-700/30 rounded-lg">
          <div className="text-sm text-gray-400 mb-2">
            💡 <strong className="text-gray-300">Tip:</strong> This usually resolves within 1-2 minutes
          </div>
          <div className="text-xs text-gray-500">
            If the problem persists, please contact our support team
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-20"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-yellow-500 rounded-full animate-ping opacity-30 delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping opacity-25 delay-2000"></div>
        </div>
      </div>
    </div>
  );
}