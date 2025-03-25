import React, { useState } from "react";
import useResizablePanel from "../hooks/useResizablePanel";
import MultiReqTab from "./MultiReqTab"; // Make sure the import name matches the file name
import ResponsePanel from "./ResponsePanel";

const RequestResponsePanelWrapper = ({ isSidebarVisible }) => {
  const { topHeight, bottomHeight, handleMouseDown } = useResizablePanel();
  const [responseData, setResponseData] = useState(null);
  const [expandedPanel, setExpandedPanel] = useState(null);

  // State to manage the list of open requests
  const [requests, setRequests] = useState([]);
  // State to track the currently active tab
  const [activeTab, setActiveTab] = useState(null);

  // Function to create a new request
  const handleNewRequest = () => {
    const newRequest = {
      id: `request-${Date.now()}`, // Unique ID for the request
      url: "", // Default URL (can be empty initially)
      method: "GET", // Default HTTP method
      isExpanded: true, // Whether the request panel is expanded
    };
    setRequests((prevRequests) => [...prevRequests, newRequest]); // Add the new request to the list
    setActiveTab(newRequest.id); // Set the new request as the active tab
  };

  // Function to handle response from a request
  const handleResponse = (id, response) => {
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
        <MultiReqTab
          requests={requests}
          setRequests={setRequests}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onNewRequest={handleNewRequest} // Pass the function to MultiReqTab
          onResponseReceived={handleResponse}
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