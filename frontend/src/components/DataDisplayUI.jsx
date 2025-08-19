import React, { useState } from 'react';
import { ChevronDown, ChevronRight, AlertCircle, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

export default function DataDisplayUI({data}) {
  // Sample data - replace with your actual data
  

  const [expandedSections, setExpandedSections] = useState(new Set([1, 2, 3]));

  const toggleSection = (index) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const getSectionIcon = (index) => {
    switch (index) {
      case 1:
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 2:
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 3:
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default:
        return <MessageSquare className="w-5 h-5 text-blue-400" />;
    }
  };

  const getSectionTitle = (index) => {
    switch (index) {
      case 1:
        return "Issues & Errors";
      case 2:
        return "Correct Responses";
      case 3:
        return "Recommendations";
      default:
        return `Section ${index}`;
    }
  };

  const getSectionColor = (index) => {
    switch (index) {
      case 1:
        return "border-red-500/30 bg-red-950/20";
      case 2:
        return "border-green-500/30 bg-green-950/20";
      case 3:
        return "border-yellow-500/30 bg-yellow-950/20";
      default:
        return "border-blue-500/30 bg-blue-950/20";
    }
  };

  const renderItem = (item, itemIndex, sectionIndex) => {
    return (
      <div
        key={itemIndex}
        className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200"
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium text-gray-300">
            {itemIndex + 1}
          </div>
          <p className="text-gray-200 leading-relaxed text-sm">{item}</p>
        </div>
      </div>
    );
  };

  const renderSection = (section, sectionIndex) => {
    if (!Array.isArray(section)) return null;

    const isExpanded = expandedSections.has(sectionIndex);

    return (
      <div
        key={sectionIndex}
        className={`border rounded-xl overflow-hidden transition-all duration-300 ${getSectionColor(sectionIndex)}`}
      >
        <button
          onClick={() => toggleSection(sectionIndex)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            {getSectionIcon(sectionIndex)}
            <h3 className="text-lg font-semibold text-gray-100">
              {getSectionTitle(sectionIndex)}
            </h3>
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
                renderItem(item, itemIndex, sectionIndex)
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Data Analysis Dashboard
          </h1>
          <p className="text-gray-400">
            Interactive data visualization and insights
          </p>
        </div>

        {/* Score/Status Card */}
        <div className="mb-6 p-6 bg-gray-900/50 border border-gray-700/50 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">
                Overall Score
              </h2>
              <p className="text-gray-400 text-sm">
                Current performance metric
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">
                {data[0]}
              </div>
              <div className="text-sm text-gray-400">
                out of 100
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-red-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(data[0], 0)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Data Sections */}
        <div className="space-y-4">
          {data.slice(1).map((section, index) => 
            renderSection(section, index + 1)
          )}
        </div>

        {/* Summary Footer */}
        <div className="mt-8 p-4 bg-gray-900/30 border border-gray-700/30 rounded-lg">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Issues</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Success</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Recommendations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}