import React from "react";

const TestsSection = ({ testParam, setTestParam, testValue, setTestValue }) => {
    return (
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Tests</h2>
        <div className="space-y-2">
          <div className="flex flex-col">
            <label htmlFor="testParam" className="text-gray-700 text-sm">
              Test Parameter
            </label>
            <input
              type="text"
              id="testParam"
              placeholder="Enter Test Parameter"
              value={testParam}
              onChange={(e) => setTestParam(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg w-64 bg-gray-100"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="testValue" className="text-gray-700 text-sm">
              Test Value
            </label>
            <input
              type="text"
              id="testValue"
              placeholder="Enter Test Value"
              value={testValue}
              onChange={(e) => setTestValue(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg w-64 bg-gray-100"
            />
          </div>
        </div>
      </div>
    );
  };
  
  export default TestsSection;
  