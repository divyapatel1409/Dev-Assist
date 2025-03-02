import React, { useState, useEffect, useRef } from "react";

const ResponsePanel = ({response}) => {
  const [activeTab, setActiveTab] = useState("headers");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // Ref for the dropdown menu

  // Mock response data
  // const response = {
  //   status: "200 OK",
  //   time: "320 ms",
  //   size: "1.2 KB",
  //   headers: [
  //     { key: "Content-Type", value: "application/json" },
  //     { key: "Cache-Control", value: "no-cache" },
  //     { key: "Connection", value: "keep-alive" },
  //   ],
  //   cookies: [
  //     { name: "sessionId", value: "abc123", domain: "example.com", path: "/", expires: "2023-12-31" },
  //     { name: "theme", value: "dark", domain: "example.com", path: "/", expires: "2023-12-31" },
  //   ],
  //   testResults: [
  //     { name: "Status Code Test", status: "Pass", message: "Expected 200, got 200" },
  //     { name: "Response Time Test", status: "Fail", message: "Expected < 200ms, got 320ms" },
  //   ],
  //   notes: "This is a sample note about the response.",
  // };

  // Convert headers object to array for easier rendering
  const headersArray = response?.headers
    ? Object.entries(response.headers).map(([key, value]) => ({ key, value }))
    : [];

   

    const cookiesArray = response?.cookies
    ? Object.entries(response.cookies).map(([key, value]) => ({ key, value }))
    : [];

    const testResultArray = response?.testResults
    ? Object.entries(response.testResults).map(([key, value]) => ({ key, value }))
    : [];

  const safeResponse = response || { headers: [], cookies: [], testResults: [], notes: "" };

  // Function to save response to file
  const saveResponseToFile = () => {
    const blob = new Blob([JSON.stringify(response, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "safeResponse.json";
    a.click();
    URL.revokeObjectURL(url);
    setIsMenuOpen(false);
  };

  // Function to save tests to file
  const saveTestsToFile = () => {
    const blob = new Blob([JSON.stringify(safeResponse.testResults, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tests.json";
    a.click();
    URL.revokeObjectURL(url);
    setIsMenuOpen(false); // Close the menu after saving
  };

  // Handle clicks outside the dropdown menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false); // Close the menu if clicked outside
      }
    };

    // Add event listener when the menu is open
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    console.log("response :", JSON.stringify(response, null, 2));
    console.log("error debug: ", response)
    console.log("oye idhr dekh: ",response)
  }, [response]);

  return (
    <div className="bg-white-100 p-4 border border-gray-300 common-style-block" style={{ flexGrow: 1, overflow: "auto" }}>
      {/* Top Bar with Hamburger Menu on Top-Right */}
      <div className="flex justify-between items-center mb-4">
        {/* Response Status and Meta Information */}
        <div className="flex items-center space-x-4">
          <span className="text-lg font-semibold text-gray-800">Response</span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            {safeResponse.status}
          </span>
          <span className="text-sm text-gray-500">Time: {safeResponse.time}</span>
          <span className="text-sm text-gray-500">Size: {safeResponse.size}</span>
        </div>

        {/* Hamburger Menu on Top-Right */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button
                onClick={saveResponseToFile}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                Save Response to File
              </button>
              <button
                onClick={saveTestsToFile}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                Save Tests to File
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tab Buttons for Body, Headers, Cookies, Test Results, and Notes */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab("body")}
          className={`px-4 py-2 ${
            activeTab === "body" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          } rounded-lg`}
        >
          Body
        </button>
        <button
          onClick={() => setActiveTab("headers")}
          className={`px-4 py-2 ${
            activeTab === "headers" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          } rounded-lg`}
        >
          Headers
        </button>
        <button
          onClick={() => setActiveTab("cookies")}
          className={`px-4 py-2 ${
            activeTab === "cookies" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          } rounded-lg`}
        >
          Cookies
        </button>
        <button
          onClick={() => setActiveTab("testResults")}
          className={`px-4 py-2 ${
            activeTab === "testResults" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          } rounded-lg`}
        >
          Test Results
        </button>
        <button
          onClick={() => setActiveTab("notes")}
          className={`px-4 py-2 ${
            activeTab === "notes" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          } rounded-lg`}
        >
          Notes
        </button>
      </div>

      {/* Headers Section */}
      {activeTab === "headers" && (
        <div className="mb-4">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border border-gray-300">Key</th>
                <th className="px-4 py-2 border border-gray-300">Value</th>
              </tr>
            </thead>
            <tbody>
              {headersArray.map((header, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border border-gray-300">{header.key}</td>
                  <td className="px-4 py-2 border border-gray-300">{header.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cookies Section */}
      {activeTab === "cookies" && (
        <div className="mb-4">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border border-gray-300">Name</th>
                <th className="px-4 py-2 border border-gray-300">Value</th>
                <th className="px-4 py-2 border border-gray-300">Domain</th>
                <th className="px-4 py-2 border border-gray-300">Path</th>
                <th className="px-4 py-2 border border-gray-300">Expires</th>
              </tr>
            </thead>
            <tbody>
              {cookiesArray.map((cookie, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border border-gray-300">{cookie.name}</td>
                  <td className="px-4 py-2 border border-gray-300">{cookie.value}</td>
                  <td className="px-4 py-2 border border-gray-300">{cookie.domain}</td>
                  <td className="px-4 py-2 border border-gray-300">{cookie.path}</td>
                  <td className="px-4 py-2 border border-gray-300">{cookie.expires}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Test Results Section */}
      {activeTab === "testResults" && (
        <div className="mb-4">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border border-gray-300">Test Name</th>
                <th className="px-4 py-2 border border-gray-300">Status</th>
                <th className="px-4 py-2 border border-gray-300">Message</th>
              </tr>
            </thead>
            <tbody>
              {testResultArray.map((test, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border border-gray-300">{test.name}</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        test.status === "Pass" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {test.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">{test.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Notes Section */}
      {activeTab === "notes" && (
        <div className="mb-4">
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg bg-gray-100"
            rows="4"
            placeholder="Add notes about the response..."
            value={safeResponse.notes}
            readOnly
          />
        </div>
      )}
      {/* Response Body Section */}
      {activeTab === "body" && (
        <div className="mb-4">
          <pre className="bg-gray-100 p-4 rounded-lg border border-gray-300 overflow-auto">
            {JSON.stringify(response?.data || response.message, null, 2)}
          </pre>
        </div>
      )}
    </div>
    
  );
};

export default ResponsePanel;