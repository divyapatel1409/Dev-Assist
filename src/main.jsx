import React from "react";
import ReactDOM from "react-dom/client";
import BodyContainer from "./components/BodyContainer";
import "./styles.css";
import { ToastContainer, toast } from 'react-toastify';
import { AppProvider } from "./context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import { EnvironmentProvider } from './context/EnvironmentContext'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <EnvironmentProvider>
        <BodyContainer />
        <ToastContainer position="bottom-right" />
      </EnvironmentProvider>
    </AppProvider>
  </React.StrictMode>
);
