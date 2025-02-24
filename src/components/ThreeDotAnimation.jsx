import React from "react";
// Make sure to create this CSS file

const ThreeDotAnimation = () => {
  return (
    <div className="three-dot-container">
      <svg
        width="100"
        height="20"
        viewBox="0 0 120 30"
        xmlns="http://www.w3.org/2000/svg"
        fill="#5B52E7"
      >
        <circle cx="15" cy="15" r="10">
          <animate
            attributeName="r"
            from="10"
            to="10"
            begin="0s"
            dur="0.8s"
            values="10;5;10"
            calcMode="linear"
            repeatCount="indefinite"
          />
          <animate
            attributeName="fill-opacity"
            from="1"
            to="1"
            begin="0s"
            dur="0.8s"
            values="1;.5;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="60" cy="15" r="10">
          <animate
            attributeName="r"
            from="10"
            to="10"
            begin="0.2s"
            dur="0.8s"
            values="10;5;10"
            calcMode="linear"
            repeatCount="indefinite"
          />
          <animate
            attributeName="fill-opacity"
            from="1"
            to="1"
            begin="0.2s"
            dur="0.8s"
            values="1;.5;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="105" cy="15" r="10">
          <animate
            attributeName="r"
            from="10"
            to="10"
            begin="0.4s"
            dur="0.8s"
            values="10;5;10"
            calcMode="linear"
            repeatCount="indefinite"
          />
          <animate
            attributeName="fill-opacity"
            from="1"
            to="1"
            begin="0.4s"
            dur="0.8s"
            values="1;.5;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
};

export default ThreeDotAnimation;
