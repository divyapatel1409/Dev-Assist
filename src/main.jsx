import React from "react";
import ReactDOM from "react-dom";
import BodyContainer from "./components/BodyContainer";
import "./styles.css";
import { AppProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <BodyContainer />
    </AppProvider>
  </React.StrictMode>
);
