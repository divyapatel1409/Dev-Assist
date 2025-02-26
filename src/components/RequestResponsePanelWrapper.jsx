import React, { useState } from "react";
import useResizablePanel from "../hooks/useResizablePanel";
import RequestPanel from "./RequestPanel";
import ResponsePanel from "./ResponsePanel";

/* Left Bottom block component HTML */
const RequestResponsePanelWrapper = () => {

    const { topHeight, handleMouseDown } = useResizablePanel();

    return (
        <div className="flex flex-col flex-grow">

            {/* Right panel top block - Request Block */}
            <RequestPanel topHeight={topHeight} />

            {/* Resizable Divider */}
            <div className="border-gray-300"
            style={{ height: "1px", cursor: "ns-resize", background: "#d1d5dc"}}
            onMouseDown={handleMouseDown}
            ></div>

            {/* Right panel bottom block - Response Block */}
            <ResponsePanel />
        </div>
    );
};

export default RequestResponsePanelWrapper;