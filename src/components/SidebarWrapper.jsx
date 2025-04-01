import React from "react";
import Sidebar from "./sidebar";

const SidebarWrapper = ({ 
  activeTab, 
  onNewRequest, 
  isSidebarVisible,
  requests,
  onRequestClick
}) => {
  return (
    <div className="h-full">
      <Sidebar 
        onNewRequest={onNewRequest} 
        isSidebarVisible={isSidebarVisible} 
        requests={requests}
        onRequestClick={onRequestClick}
      />
    </div>
  );
};

export default SidebarWrapper;