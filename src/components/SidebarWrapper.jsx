import React from "react";
import Sidebar from "./Sidebar";

const SidebarWrapper = ({ activeTab, onNewRequest, isSidebarVisible }) => {
  // Only render the Sidebar component for API_HELPER tab
  return (
    <div className="h-full">
      <Sidebar onNewRequest={onNewRequest} isSidebarVisible={isSidebarVisible} />
    </div>
  );
};

export default SidebarWrapper;