import React from "react";

/* Right Top block component HTML */
const RequestPanel = ({ topHeight }) => (
    <div className="bg-white-100 p-4 border border-gray-300 common-style-block" style={{ height: `${topHeight}px`, overflow: "auto", borderBottom: "2px solid #ccc" }}>
        <h1>Request Panel</h1>
    </div>
);

export default RequestPanel;