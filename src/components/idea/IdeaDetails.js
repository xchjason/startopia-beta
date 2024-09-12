import React from 'react';
import DescriptionIcon from '@mui/icons-material/Description';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';

const IdeaDetails = ({ idea }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-fit">
      <h1 className="text-3xl font-bold mb-4 text-white">{idea.title}</h1>
      <div className="space-y-6">
        {/* Description Section */}
        <div className="flex items-start space-x-3">
          <DescriptionIcon className="text-blue-400" fontSize="small" />
          <div>
            <h2 className="text-xl font-semibold text-gray-100">Description</h2>
            <p className="mt-1 text-base text-gray-300">{idea.description}</p>
          </div>
        </div>
        {/* Problem Section */}
        <div className="flex items-start space-x-3">
          <ErrorOutlineIcon className="text-red-400" fontSize="small" />
          <div>
            <h2 className="text-xl font-semibold text-gray-100">Problem</h2>
            <p className="mt-1 text-base text-gray-300">{idea.problem}</p>
          </div>
        </div>
        {/* Solution Section */}
        <div className="flex items-start space-x-3">
          <LightbulbOutlinedIcon className="text-yellow-400" fontSize="small" />
          <div>
            <h2 className="text-xl font-semibold text-gray-100">Solution</h2>
            <p className="mt-1 text-base text-gray-300">{idea.solution}</p>
          </div>
        </div>
        {/* Category Section */}
        <div className="flex items-start space-x-3">
          <LocalOfferOutlinedIcon className="text-green-400" fontSize="small" />
          <div>
            <h2 className="text-xl font-semibold text-gray-100">Category</h2>
            <div className="mt-1">
              <span className="inline-block bg-green-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                {idea.category}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetails;