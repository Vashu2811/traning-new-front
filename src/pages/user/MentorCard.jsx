import React, { useState } from "react";
import { AiFillWechat } from "react-icons/ai";

const MentorCard = ({ mentor, onMessageClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 230;
  const intro = mentor.intro || "";
  const shouldTruncate = intro.length > maxLength;

  const getInitials = (name) => {
    return name
      ?.match(/(^\w\w?|\b\w)?/g) 
      ?.join("")
      ?.match(/(^\w|\w$)?/g)
      ?.join("")
      ?.toUpperCase() || "";
  };

  const renderIntro = () => {
    if (!shouldTruncate) return intro;

    if (isExpanded) {
      return (
        <>
          {intro}
          {/* <button
            onClick={() => setIsExpanded(false)}
            className="text-[#5b52e7] hover:underline ml-2"
          >
            Show less
          </button> */}
        </>
      );
    }

    return <>{intro.slice(0, maxLength)}...</>;
  };

  return (
    <div className="rounded-lg overflow-hidden border border-[#3a3e42]  hover:border-[#5b52e7]">
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#5b52e7] text-white text-lg font-semibold">
            {getInitials(mentor.name)}
          </div>

          <div className="flex-grow">
            <h2 className="text-white text-lg font-semibold">
              {mentor.name}
            </h2>
            <p className="text-gray-400 text-xs">
              {mentor.user_details.role || ""}
            </p>
            <button
              onClick={() => onMessageClick(mentor)}
              className="mt-2 bg-[#5b52e7] text-white px-4 py-2 rounded-md hover:bg-[#5247e2] transition-colors inline-flex items-center justify-center gap-2"
            >
              <AiFillWechat className="text-lg" />
              <span>Start Conversations</span>
            </button>
          </div>
        </div>
        <p className="text-gray-300 text-sm mt-4 border-t border-[#3a3e42] pt-2">
          {renderIntro()}
        </p>
      </div>
    </div>
  );
};

export default MentorCard;
