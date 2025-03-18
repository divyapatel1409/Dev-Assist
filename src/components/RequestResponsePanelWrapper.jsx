import React, { useState } from "react";
import useResizablePanel from "../hooks/useResizablePanel";
import RequestPanel from "./RequestPanel";
import ResponsePanel from "./ResponsePanel";

/* Left Bottom block component HTML */
const RequestResponsePanelWrapper = ({ isSidebarVisible }) => {
  const { topHeight,bottomHeight, handleMouseDown } = useResizablePanel();
  const [responseData , setResponseData] = useState(null)
  const [expandedPanel, setExpandedPanel] = useState(null);


  const handleResponse = (response) => {
    setResponseData(response);
  };

  const cssClass = isSidebarVisible
    ? "flex flex-col flex-grow"
    : "flex flex-col flex-grow";

    // Function to handle minimize/maximize
  const handleMinimize = (panel) => {
    if (expandedPanel === panel) {
      // If already expanded, restore to 50-50
      setExpandedPanel(null);
    } else {
      // Expand the clicked panel
      setExpandedPanel(panel);
    }
  };
    
  return (
    <div className={cssClass}>
      {/* Right panel top block - Request Block */}
      <div
        className={`transition-all duration-300 ${
          expandedPanel === "response" ? "h-0" : expandedPanel === "request" ? "h-full" : `${topHeight}px`
        }`}
      >
        <RequestPanel
          topHeight={topHeight}
          onResponse={handleResponse}
          isExpanded={expandedPanel === "request"}
          onToggle={() => handleMinimize("request")}
        />
      </div>

      {/* Resizable Divider */}
      <div
        className="border-gray-300"
        style={{ height: "1px", cursor: "ns-resize", background: "#d1d5dc" }}
        onMouseDown={handleMouseDown}
      ></div>

      {/* Right panel bottom block - Response Block */}
      <div
        className={`transition-all duration-300 ${
          expandedPanel === "request" ? "h-0" : expandedPanel === "response" ? "h-full" : `${bottomHeight}px`
        }`}
      >
        <ResponsePanel
          response={responseData}
          bottomHeight={bottomHeight}
          isExpanded={expandedPanel === "response"}
          onToggle={() => handleMinimize("response")}
        />
      </div>
    </div>
  );
};

export default RequestResponsePanelWrapper;
