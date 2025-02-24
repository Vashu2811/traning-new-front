import React from "react";

const button = ({ bgColor, color, size, text, borderRadius, ...rest }) => {
  return (
    <div>
      <button
        type="button"
        style={{ backgroundColor: bgColor, color, borderRadius }}
        className={`text-${size} p-3 hover:drop-shadow-xl`}
        {...rest}
      >
        {text}
      </button>
    </div>
  );
};

export default button;
