import React, { useState } from "react";
import Sidebar from "./sidebar";
import RequestResponsePanelWrapper from "./RequestResponsePanelWrapper";
import { FiMenu } from "react-icons/fi";

const BodyContainer = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="flex h-screen text-black p-4">
      {/* Toggle Button */}
      <button onClick={toggleSidebar} className="absolute top-5 left-5 z-10">
        <FiMenu size={24} />
      </button>

      {/* Left Sidebar block */}
      {isSidebarVisible && <Sidebar />}

      {/* Main Content block*/}
      <RequestResponsePanelWrapper isSidebarVisible={isSidebarVisible} />
    </div>
  );
};

export default BodyContainer;
