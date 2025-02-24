import React from 'react';

const CenteredProgress = ({percentage}) => {
  const percentageRound = (percentage && Math.round(percentage)) || 0
  return (
    <div className="text-white rounded-lg p-4 flex items-center">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
          <svg
            className="w-16 h-16 transform -rotate-90"
            viewBox="0 0 36 36"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="text-indigo-200"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className={percentageRound === 100 ? "text-green-500":"text-indigo-600"}
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${percentageRound}, 100`} /* Adjust for progress */
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
            {percentageRound}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenteredProgress;
