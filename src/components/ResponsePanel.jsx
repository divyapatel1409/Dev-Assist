import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ResponsePanel = ({ response, bottomHeight, isExpanded, onToggle }) => {
  const [activeTab, setActiveTab] = useState("headers");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const tabsContainerRef = useRef(null);
  const [showAllTabs, setShowAllTabs] = useState(true);

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

  // Tab sections configuration
  const tabSections = [
    { id: "body", label: "Body", icon: "M4 6h16M4 12h16M4 18h7" },
    { id: "headers", label: "Headers", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { id: "cookies", label: "Cookies", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" },
    { id: "testResults", label: "Tests", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
    { id: "notes", label: "Notes", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
  ];

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
    setIsMenuOpen(false);
  };

  // Handle clicks outside the dropdown menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Check container width to determine tab display mode
  useEffect(() => {
    const handleResize = () => {
      if (tabsContainerRef.current) {
        const containerWidth = tabsContainerRef.current.offsetWidth;
        setShowAllTabs(containerWidth > 500);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle tab navigation with arrows in slider mode
  const scrollTabsLeft = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: -100, behavior: 'smooth' });
    }
  };

  const scrollTabsRight = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: 100, behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      className="bg-white shadow-md rounded-lg border border-gray-200 relative w-full"
      style={{ height: isExpanded ? "100%" : `${bottomHeight}px`, overflow: "auto" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-green-500"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <h1 className="text-lg font-semibold text-gray-800">Response</h1>
          <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hidden sm:block">
            {safeResponse.status || "200 OK"}
          </div>
          <span className="text-sm text-gray-500 hidden sm:block">Time: {safeResponse.time || "0ms"}</span>
          <span className="text-sm text-gray-500 hidden sm:block">Size: {safeResponse.size || "0B"}</span>
        </div>
        <div className="flex items-center space-x-2">
        
          {/* Menu Button */}
          <div className="relative" ref={menuRef}>
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>  

            {/* Dropdown Menu with Animation */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.button
                    onClick={saveResponseToFile}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                  >
                    Save Response to File
                  </motion.button>
                  <motion.button
                    onClick={saveTestsToFile}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                  >
                    Save Tests to File
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-2 sm:p-4">
        {/* Mobile Status Display */}
        <div className="flex flex-wrap gap-2 mb-4 sm:hidden">
          <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            {safeResponse.status || "200 OK"}
          </div>
          <span className="text-sm text-gray-500">Time: {safeResponse.time || "0ms"}</span>
          <span className="text-sm text-gray-500">Size: {safeResponse.size || "0B"}</span>
        </div>

        {/* Tab Buttons - Responsive with Slider for Mobile */}
        <div className="relative mb-4">
          {!showAllTabs && (
            <>
              <button 
                onClick={scrollTabsLeft}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={scrollTabsRight}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          
          <div 
            ref={tabsContainerRef}
            className={`
              flex gap-2 
              ${!showAllTabs ? 'overflow-x-auto px-6 pb-2 scrollbar-hide' : 'flex-wrap'}
            `}
            style={!showAllTabs ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}
          >
            {tabSections.map((section) => (
              <motion.button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`
                  px-2 sm:px-3 py-1 sm:py-2 rounded-lg flex items-center gap-1 whitespace-nowrap
                  ${activeTab === section.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  } transition-all duration-200
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={section.icon} />
                </svg>
                <span className="text-xs sm:text-sm">{section.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content Sections with Animation */}
        <motion.div
          className="bg-gray-50 rounded-lg border border-gray-200 p-2 sm:p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {/* Headers Section */}
            {activeTab === "headers" && (
              <motion.div
                key="headers"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full overflow-x-auto"
              >
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border border-gray-300 text-left">Key</th>
                      <th className="px-4 py-2 border border-gray-300 text-left">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {headersArray.length > 0 ? (
                      headersArray.map((header, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 border border-gray-300">{header.key}</td>
                          <td className="px-4 py-2 border border-gray-300">{header.value}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="px-4 py-2 border border-gray-300 text-center text-gray-500">No headers available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </motion.div>
            )}

            {/* Cookies Section */}
            {activeTab === "cookies" && (
              <motion.div
                key="cookies"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full overflow-x-auto"
              >
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border border-gray-300 text-left">Name</th>
                      <th className="px-4 py-2 border border-gray-300 text-left">Value</th>
                      <th className="px-4 py-2 border border-gray-300 text-left">Domain</th>
                      <th className="px-4 py-2 border border-gray-300 text-left">Path</th>
                      <th className="px-4 py-2 border border-gray-300 text-left">Expires</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cookiesArray.length > 0 ? (
                      cookiesArray.map((cookie, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 border border-gray-300">{cookie.name}</td>
                          <td className="px-4 py-2 border border-gray-300">{cookie.value}</td>
                          <td className="px-4 py-2 border border-gray-300">{cookie.domain}</td>
                          <td className="px-4 py-2 border border-gray-300">{cookie.path}</td>
                          <td className="px-4 py-2 border border-gray-300">{cookie.expires}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-4 py-2 border border-gray-300 text-center text-gray-500">No cookies available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </motion.div>
            )}

            {/* Test Results Section */}
            {activeTab === "testResults" && (
              <motion.div
                key="testResults"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full overflow-x-auto"
              >
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border border-gray-300 text-left">Test Name</th>
                      <th className="px-4 py-2 border border-gray-300 text-left">Status</th>
                      <th className="px-4 py-2 border border-gray-300 text-left">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testResultArray.length > 0 ? (
                      testResultArray.map((test, index) => (
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
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="px-4 py-2 border border-gray-300 text-center text-gray-500">No test results available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </motion.div>
            )}

            {/* Notes Section */}
            {activeTab === "notes" && (
              <motion.div
                key="notes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <textarea
                  className="w-full p-4 border border-gray-300 rounded-lg bg-gray-100"
                  rows="4"
                  placeholder="Add notes about the response..."
                  value={safeResponse.notes || ""}
                  readOnly
                />
              </motion.div>
            )}

            {/* Response Body Section */}
            {activeTab === "body" && (
              <motion.div
                key="body"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <pre className="bg-gray-100 p-4 rounded-lg border border-gray-300 overflow-auto min-h-32 max-h-96">
                  {JSON.stringify(response?.data || response??.message || {}, null, 2)}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResponsePanel;