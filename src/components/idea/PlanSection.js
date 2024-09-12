// components/idea/PlanBox.js
import React, { useState } from 'react';

const PlanBox = ({ aspect, details, color }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative w-1/4 px-2">
      <button
        className={`w-full h-16 rounded-lg font-semibold text-white flex items-center justify-center`}
        style={{ backgroundColor: color }}
        onClick={() => setExpanded(!expanded)}
      >
        {aspect}
      </button>
      {expanded && (
        <div className="absolute top-20 left-0 w-full p-4 bg-gray-800 rounded-lg">
          <p className="text-white">{details}</p>
        </div>
      )}
    </div>
  );
};

export default PlanBox;