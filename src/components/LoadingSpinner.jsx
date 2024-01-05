import React from "react";
import HashLoader from "react-spinners/HashLoader";

function LoadingSpinner({ loading }) {
  return (
    <div className="loading-spinner">
      <HashLoader color="#4d4f4f" loading={loading} size={50} />
    </div>
  );
}

export default LoadingSpinner;
