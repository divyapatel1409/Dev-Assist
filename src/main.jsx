import React from "react";
import ReactDOM from "react-dom";
import BodyContainer from "./components/BodyContainer";
import "./styles.css";
import { ToastContainer, toast } from 'react-toastify';
import { AppProvider } from "./context/AuthContext";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <BodyContainer />
			<ToastContainer position="bottom-right" />
    </AppProvider>
  </React.StrictMode>
);
