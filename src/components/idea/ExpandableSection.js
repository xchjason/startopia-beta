import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ExpandableSection = ({ title, content, isExpanded, onToggle }) => (
  <div className="mb-4">
    <button
      className="w-full flex justify-between items-center p-4 bg-gray-800 hover:bg-gray-700 transition-colors duration-200 rounded-lg"
      onClick={onToggle}
    >
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      {isExpanded ? (
        <ChevronUp size={24} className="text-white" />
      ) : (
        <ChevronDown size={24} className="text-white" />
      )}
    </button>
    {isExpanded && <div className="mt-2 p-4 bg-gray-900 rounded-lg">{content}</div>}
  </div>
);

export default ExpandableSection;