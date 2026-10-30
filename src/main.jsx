import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import "./index.css";
import "./styles/global.css";
import "./styles/variables.css";
import "./styles/responsive.css";

import { AuthProvider } from "./context/AuthContext";
import { SettingsProvider } from "./context/SettingsContext";

// Import the ToastContainer component and its CSS
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")).render(
  <SettingsProvider>
    <React.StrictMode>
      <AuthProvider>
        <BrowserRouter>
          <App />

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"
          />
        </BrowserRouter>
      </AuthProvider>
    </React.StrictMode>
  </SettingsProvider>,
);
