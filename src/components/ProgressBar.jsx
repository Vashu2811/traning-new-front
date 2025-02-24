import React from "react";

const ProgressBar = ({ percentage }) => {
  return (
    <div className="flex items-center gap-x-3 whitespace-nowrap">
      <div
        className="flex w-full h-2 bg-indigo-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className={`flex flex-col justify-center rounded-full overflow-hidden ${
            percentage === 100 ? "bg-green-600" : "bg-indigo-600"
          } text-xs text-white text-center whitespace-nowrap transition duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="w-10 text-end">
        <span className="text-sm text-white">{percentage}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
