import React from "react";
import { FaSpinner } from "react-icons/fa";
import "./Loader.css";

const Loader = ({ fullPage = false }) => {
  return (
    <div
      className={fullPage ? "loader-container full-page" : "loader-container"}
    >
      <FaSpinner className="spinner-icon" />
      <p>Loading data...</p>
    </div>
  );
};

export default Loader;
