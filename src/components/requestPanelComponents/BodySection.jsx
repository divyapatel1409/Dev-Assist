import React from "react";

const BodySection = ({ body, setBody }) => {
    return (
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Body</h2>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Enter request body (e.g., JSON)" className="w-full px-4 py-2 border rounded-lg bg-gray-100" rows={6} />
      </div>
    );
  };
  
  export default BodySection;
  
