import React, { useState } from "react";
import useResizablePanel from "../hooks/useResizablePanel";
import RequestPanel from "./RequestPanel";
import ResponsePanel from "./ResponsePanel";

/* Left Bottom block component HTML */
const RequestResponsePanelWrapper = ({ isSidebarVisible }) => {
  const { topHeight, handleMouseDown } = useResizablePanel();
  const cssClass = isSidebarVisible
    ? "flex flex-col flex-grow"
    : "flex flex-col flex-grow pl-10";
    
  return (
    <div className={cssClass}>
      {/* Right panel top block - Request Block */}
      <RequestPanel topHeight={topHeight} />

      {/* Resizable Divider */}
      <div
        className="border-gray-300"
        style={{ height: "1px", cursor: "ns-resize", background: "#d1d5dc" }}
        onMouseDown={handleMouseDown}
      ></div>

      {/* Right panel bottom block - Response Block */}
      <ResponsePanel />
    </div>
  );
};

export default RequestResponsePanelWrapper;
