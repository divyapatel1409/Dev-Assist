import React, { useState } from "react";
import Sidebar from "./sidebar";
import RequestResponsePanelWrapper from "./RequestResponsePanelWrapper";

const BodyContainer = () => {
  
  return (
    <div className="flex h-screen text-black p-4">
      {/* Left Sidebar block */}
      <Sidebar />
      
      {/* Main Content block*/}
      <RequestResponsePanelWrapper />
      
    </div>
  );
};

export default BodyContainer;
