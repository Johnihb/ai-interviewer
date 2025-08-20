import React, { useState } from 'react';
import { ChevronDown, ChevronRight, AlertCircle, CheckCircle, XCircle, BookOpen, Target, TrendingUp } from 'lucide-react';
import { useGeminiStore } from '../stores/geminiStore';

export default function DataDisplayUI({ data }) {
  const [expandedSections, setExpandedSections] = useState(new Set([0, 1]));

  const {feedback} = useGeminiStore();

  // Parse the data structure - handle multiple formats
  const parseData = () => {
    // Use feedback from store first, then fallback to data prop
    const sourceData = feedback || data;
    
    if (!sourceData) {
      return { score: 0, sections: [] };
    }

    try {
      let parsedData;
      
      // If data is a string, try to parse it
      if (typeof sourceData === 'string') {
        parsedData = JSON.parse(sourceData);
      } 
      // If data is already an object
      else if (typeof sourceData === 'object') {
        parsedData = sourceData;
      }
      else {
        throw new Error('Invalid data format');
      }

      // Handle JSON object format with marks, mistakes, suggestions
      if (parsedData && typeof parsedData === 'object' && !Array.isArray(parsedData)) {
        const sections = [];
        
        // Add mistakes section if it exists
        if (parsedData.mistakes && Array.isArray(parsedData.mistakes) && parsedData.mistakes.length > 0) {
          sections.push(parsedData.mistakes);
        }
        
        // Add suggestions section if it exists
        if (parsedData.suggestions && Array.isArray(parsedData.suggestions) && parsedData.suggestions.length > 0) {
          sections.push(parsedData.suggestions);
        }

        return {
          score: typeof parsedData.marks === 'number' ? parsedData.marks : 0,
          sections: sections
        };
      }
      
      // Legacy array format handling (fallback)
      if (Array.isArray(parsedData)) {
        const [score, ...remainingData] = parsedData;
        const sections = [];
        
        if (remainingData.length > 0) {
          if (remainingData.length >= 2) {
            const [errorMessage, suggestion] = remainingData;
            
            if (errorMessage && typeof errorMessage === 'string') {
              sections.push([errorMessage]);
            }
            
            if (suggestion && typeof suggestion === 'string') {
              sections.push([suggestion]);
            }
          } else {
            remainingData.forEach(item => {
              if (item && typeof item === 'string') {
                sections.push([item]);
              }
            });
          }
        }

        return {
          score: typeof score === 'number' ? score : 0,
          sections: sections
        };
      }

      throw new Error('Unsupported data format');
    } catch (error) {
      console.error('Error parsing data:', error);
      return { score: 0, sections: [] };
    }
  };

  const { score, sections } = parseData();

  const toggleSection = (index) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const getSectionConfig = (index, sectionLength) => {
    const configs = [
      {
        icon: <XCircle className="w-5 h-5 text-red-400" />,
        title: "Mistakes & Issues",
        color: "border-red-500/30 bg-red-950/20",
        description: "Problems identified in your response"
      },
      {
        icon: <AlertCircle className="w-5 h-5 text-amber-400" />,
        title: "Suggestions for Improvement",
        color: "border-amber-500/30 bg-amber-950/20",
        description: "Recommendations to help you improve"
      },
      {
        icon: <BookOpen className="w-5 h-5 text-blue-400" />,
        title: "Learning Content",
        color: "border-blue-500/30 bg-blue-950/20",
        description: "Additional learning material"
      },
      {
        icon: <CheckCircle className="w-5 h-5 text-green-400" />,
        title: "Additional Notes",
        color: "border-green-500/30 bg-green-950/20",
        description: "Extra information"
      }
    ];
    
    return configs[index] || {
      icon: <BookOpen className="w-5 h-5 text-gray-400" />,
      title: `Section ${index + 1}`,
      color: "border-gray-500/30 bg-gray-950/20",
      description: "Additional content"
    };
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "from-green-500 to-emerald-500";
    if (score >= 6) return "from-yellow-500 to-amber-500";
    if (score >= 4) return "from-orange-500 to-red-500";
    return "from-red-500 to-red-600";
  };

  const getScoreStatus = (score) => {
    if (score >= 8) return { text: "Excellent", color: "text-green-400" };
    if (score >= 6) return { text: "Good", color: "text-yellow-400" };
    if (score >= 4) return { text: "Fair", color: "text-orange-400" };
    return { text: "Needs Improvement", color: "text-red-400" };
  };

  const renderItem = (item, itemIndex) => {
    return (
      <div
        key={itemIndex}
        className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200"
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-xs font-medium text-white">
            {itemIndex + 1}
          </div>
          <p className="text-gray-200 leading-relaxed text-sm flex-1">{item}</p>
        </div>
      </div>
    );
  };

  const renderSection = (section, sectionIndex) => {
    if (!Array.isArray(section) || section.length === 0) return null;

    const isExpanded = expandedSections.has(sectionIndex);
    const config = getSectionConfig(sectionIndex, section.length);

    return (
      <div
        key={sectionIndex}
        className={`border rounded-xl overflow-hidden transition-all duration-300 ${config.color}`}
      >
        <button
          onClick={() => toggleSection(sectionIndex)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            {config.icon}
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-100">
                {config.title}
              </h3>
              <p className="text-xs text-gray-400">{config.description}</p>
            </div>
            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
              {section.length} items
            </span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {isExpanded && (
          <div className="p-4 pt-0">
            <div className="space-y-3">
              {section.map((item, itemIndex) => 
                renderItem(item, itemIndex)
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const scorePercentage = Math.max((score / 10) * 100, 0);
  const scoreStatus = getScoreStatus(score);
  const totalItems = sections.reduce((sum, section) => sum + (Array.isArray(section) ? section.length : 0), 0);

  // Check if we have actual feedback data
  const hasFeedback = sections.length > 0 && sections.some(section => section.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 mt-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full">
              <Target className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-2">
            Assessment Results
          </h1>
          <p className="text-gray-400">
            Comprehensive analysis of your performance and learning progress
          </p>
        </div>

        {/* Score Card */}
        <div className="mb-6 p-6 bg-gray-900/50 border border-gray-700/50 rounded-xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Overall Score
                </h2>
                <p className="text-gray-400 text-sm">
                  Your performance evaluation
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <div className="text-3xl font-bold text-white">
                  {score}
                </div>
                <div className="text-gray-400">
                  <span className="text-lg">/</span> 10
                </div>
              </div>
              <div className={`text-sm font-medium ${scoreStatus.color}`}>
                {scoreStatus.text}
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
              <div
                className={`bg-gradient-to-r ${getScoreColor(score)} h-3 rounded-full transition-all duration-1000 ease-out relative`}
                style={{ width: `${scorePercentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>{scorePercentage.toFixed(0)}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Data Sections */}
        {hasFeedback ? (
          <div className="space-y-4">
            {sections.map((section, index) => renderSection(section, index))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-900/30 border border-gray-700/30 rounded-xl">
            <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No Feedback Available</h3>
            <p className="text-gray-500">No detailed feedback or suggestions provided for this assessment.</p>
          </div>
        )}

        {/* Summary Statistics */}
        <div className="mt-8 p-6 bg-gray-900/30 border border-gray-700/30 rounded-xl backdrop-blur-sm">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-5 h-5 text-cyan-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">Assessment Summary</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-950/20 border border-blue-500/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {sections.length}
              </div>
              <div className="text-sm text-gray-400">Feedback Sections</div>
            </div>
            
            <div className="text-center p-4 bg-green-950/20 border border-green-500/20 rounded-lg">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {totalItems}
              </div>
              <div className="text-sm text-gray-400">Total Items</div>
            </div>
            
            <div className="text-center p-4 bg-purple-950/20 border border-purple-500/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {scorePercentage.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-400">Achievement</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 p-4 bg-gray-900/20 border border-gray-700/20 rounded-lg">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Mistakes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span>Suggestions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Learning</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}