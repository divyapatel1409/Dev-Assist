import React from "react";
import Sidebar from "./Sidebar";

const SidebarWrapper = ({ activeTab, onNewRequest, isSidebarVisible, requests }) => {
  return (
    <div className="h-full">
      <Sidebar 
        onNewRequest={onNewRequest} 
        isSidebarVisible={isSidebarVisible} 
        requests={requests}
      />
    </div>
  );
};

export default SidebarWrapper;