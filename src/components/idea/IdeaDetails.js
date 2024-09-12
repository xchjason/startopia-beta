import React from 'react';
import DescriptionIcon from '@mui/icons-material/Description';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';

const IdeaDetails = ({ idea }) => {
  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg h-fit">
      <h1 className="text-4xl font-extrabold mb-6 text-white">{idea.title}</h1>
      <div className="space-y-8">
        {/* Description Section */}
        <div className="flex items-start space-x-4">
          <DescriptionIcon className="text-blue-400" fontSize="large" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-100">Description</h2>
            <p className="mt-2 text-lg text-gray-300">{idea.description}</p>
          </div>
        </div>
        {/* Problem Section */}
        <div className="flex items-start space-x-4">
          <ErrorOutlineIcon className="text-red-400" fontSize="large" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-100">Problem</h2>
            <p className="mt-2 text-lg text-gray-300">{idea.problem}</p>
          </div>
        </div>
        {/* Solution Section */}
        <div className="flex items-start space-x-4">
          <LightbulbOutlinedIcon className="text-yellow-400" fontSize="large" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-100">Solution</h2>
            <p className="mt-2 text-lg text-gray-300">{idea.solution}</p>
          </div>
        </div>
        {/* Category Section */}
        <div className="flex items-start space-x-4">
          <LocalOfferOutlinedIcon className="text-green-400" fontSize="large" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-100">Category</h2>
            <div className="mt-2">
              <span className="inline-block bg-green-600 text-white text-sm font-medium px-3 py-1 rounded-full">
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