import React, { useState } from "react";
import useResizablePanel from "../hooks/useResizablePanel";
import MultiReqTab from "./MultiReqTab"; // Make sure the import name matches the file name
import ResponsePanel from "./ResponsePanel";
import { BsThreeDots } from "react-icons/bs";

const RequestResponsePanelWrapper = ({ isSidebarVisible }) => {
  const [expandedPanel, setExpandedPanel] = useState(null);
  const { topHeight, bottomHeight, handleMouseDown } = useResizablePanel();
  const [responseData, setResponseData] = useState(null);

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

  const getTopPanelHeight = () => {
    if (expandedPanel === "response") return 0;
    if (expandedPanel === "request") return "100%";
    return `${topHeight}px`;
  };

  const getBottomPanelHeight = () => {
    if (expandedPanel === "request") return 0;
    if (expandedPanel === "response") return "100%";
    return `${bottomHeight}px`;
  };

  const cssClass = isSidebarVisible
    ? "flex flex-col flex-grow"
    : "flex flex-col flex-grow";

  // Function to handle minimize/maximize
  const handleMinimize = (panel) => {
    if (expandedPanel === panel) {
      setExpandedPanel(null);
    } else {
      setExpandedPanel(panel);
    }
  };

  return (
    <div className={cssClass}>
      {/* Right panel top block - Request Block */}
      <div
        className="overflow-auto rounded-none"
        style={{height:getTopPanelHeight()}}
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

      {/* Resizable Divider - Only show when not expanded */}
      {!expandedPanel && (
        <div
          className="relative border-gray-300 cursor-ns-resize border-b group hover:border-gray-400"
          style={{ height: "5px", background: "#f5f5f5" }}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-4 bg-gray-100 rounded group-hover:bg-gray-200">
            <BsThreeDots className="text-gray-400 group-hover:text-gray-600" />
          </div>
        </div>
      )}

      {/* Right panel bottom block - Response Block */}
      <div
        className="overflow-auto"
       style={{ height:getBottomPanelHeight()}}
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