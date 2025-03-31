import React, { useState } from "react";
import useResizablePanel from "../hooks/useResizablePanel";
import MultiReqTab from "./MultiReqTab";
import ResponsePanel from "./ResponsePanel";
import { BsThreeDots } from "react-icons/bs";

const RequestResponsePanelWrapper = ({ 
  isSidebarVisible,
  requests,
  setRequests,
  activeRequestId,
  setActiveRequestId,
  onNewRequest
}) => {
  const [expandedPanel, setExpandedPanel] = useState(null);
  const { topHeight, bottomHeight, handleMouseDown } = useResizablePanel();
  const [responseData, setResponseData] = useState(null);

  const handleResponse = (id, response) => {
    setResponseData(response);
  };

  const handleCloseRequest = (id) => {
    const newRequests = requests.filter(request => request.id !== id);
    setRequests(newRequests);
    
    if (activeRequestId === id) {
      setActiveRequestId(newRequests.length > 0 ? newRequests[0].id : null);
    }
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

  const handleMinimize = (panel) => {
    if (expandedPanel === panel) {
      setExpandedPanel(null);
    } else {
      setExpandedPanel(panel);
    }
  };

  return (
    <div className={cssClass}>
      <div
        className="overflow-auto rounded-none"
        style={{height:getTopPanelHeight()}}
      >
        <MultiReqTab
          requests={requests}
          setRequests={setRequests}
          activeTab={activeRequestId}
          setActiveTab={setActiveRequestId}
          onNewRequest={onNewRequest}
          onCloseRequest={handleCloseRequest}
          onResponseReceived={handleResponse}
        />
      </div>

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