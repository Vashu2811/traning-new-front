import React from "react";
import { useSelector } from "react-redux";
import "../styles/loading.scss";

const Loading = (props) => {
  const isLoading = useSelector((state) => state.loading.isLoading);
  return (
    isLoading && (
      <div className="loader-overlay">
        <div className="loader"></div>
      </div>
    )
  );
};

export default Loading;
