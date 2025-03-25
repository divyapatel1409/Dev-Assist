import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Reusable ToggleButton Component
const ToggleButton = ({ option, selectedOption, handleOptionSelect }) => (
  <motion.button
    className={`flex-1 py-1 sm:py-2 flex items-center justify-center text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out ${
      selectedOption === option
        ? "bg-blue-600 text-white shadow-md"
        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
    }`}
    onClick={() => handleOptionSelect(option)}
    whileHover={{ y: -1 }}
    whileTap={{ scale: 0.95 }}
  >
    <span>{option}</span>
  </motion.button>
);

// Reusable ListItem Component
const ListItem = ({ item, selectedOption, getMethodColor }) => (
  <motion.div
    className="p-2 sm:p-3 md:p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 ease-in-out mb-2 sm:mb-3 cursor-pointer"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -10 }}
    whileHover={{ scale: 1.01, translateX: 3 }}
  >
    <div className="flex items-center justify-between">
      <h3 className="font-semibold text-gray-800 text-xs sm:text-sm md:text-base truncate">
        {item.name}
      </h3>
      {selectedOption === "History" && (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full border flex items-center justify-center ${getMethodColor(
            item.method
          )}`}
        >
          {item.method}
        </span>
      )}
    </div>
    {selectedOption === "History" && (
      <p className="text-xs md:text-sm text-gray-600 mt-1 md:mt-2 break-all">{item.url}</p>
    )}
    {selectedOption === "Collection" && (
      <p className="text-xs md:text-sm text-gray-600 mt-1 md:mt-2">{item.description}</p>
    )}
    {selectedOption === "Variable" && (
      <p className="text-xs md:text-sm text-gray-600 mt-1 md:mt-2">Value: {item.value}</p>
    )}
  </motion.div>
);

const Sidebar = ({ onNewRequest, isSidebarVisible }) => {
  const [filterText, setFilterText] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile or tablet
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Mock data for History, Collection, and Variable
  const mockData = {
    History: [
      { id: 1, name: "Request 1", method: "GET", url: "https://api.example.com/data" },
      { id: 2, name: "Request 2", method: "POST", url: "https://api.example.com/create" },
      { id: 3, name: "Request 3", method: "PUT", url: "https://api.example.com/update" },
      { id: 4, name: "Request 4", method: "DELETE", url: "https://api.example.com/delete" },
    ],
    Collection: [
      { id: 1, name: "Collection 1", description: "A set of API requests" },
      { id: 2, name: "Collection 2", description: "Another set of API requests" },
    ],
    Variable: [
      { id: 1, name: "Variable 1", value: "123" },
      { id: 2, name: "Variable 2", value: "456" },
    ],
  };

  const handleClear = () => {
    setFilterText("");
  };

  const handleOptionSelect = (option) => {
    if (selectedOption === option) {
      setSelectedOption("");
    } else {
      setSelectedOption(option);
    }
    setFilterText("");
  };

  // Filter data based on the selected option and filter text
  const filteredData = selectedOption
    ? mockData[selectedOption].filter((item) =>
        item.name.toLowerCase().includes(filterText.toLowerCase())
      )
    : [];

  // Function to get the color for HTTP methods
  const getMethodColor = (method) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "bg-green-100 text-green-800 border-green-200";
      case "POST":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PUT":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "DELETE":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const sidebarVariants = {
    open: {
      width: isMobile ? "85%" : "320px",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      width: "0px",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <AnimatePresence>
      {isSidebarVisible && (
        <motion.div
          className="h-full bg-white shadow-lg border-r border-gray-200 flex flex-col overflow-hidden"
          initial="closed"
          animate="open"
          exit="closed"
          variants={sidebarVariants}
        >
          <div className="flex flex-col h-full overflow-hidden px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6">
            {/* Logo with divider line */}
            <motion.div 
              className="flex flex-col items-center mb-4 md:mb-6"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <img
                src="images/DevAssist-Logo.png"
                alt="Dev Assist Logo"
                className="w-28 h-14 md:w-40 md:h-20 object-contain"
              />
              <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-full mt-3 md:mt-4" />
            </motion.div>

            {/* New Request Button */}
            <motion.button 
              onClick={onNewRequest}
              className="w-full py-2 md:py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 transition-all duration-300 ease-in-out mb-4 md:mb-5 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-center">New Request</span>
            </motion.button>

            {/* Toggle Switch Buttons */}
            <motion.div 
              className="flex justify-between gap-1 sm:gap-2 md:gap-3 border-b border-gray-300 pb-3 md:pb-4 mb-3 md:mb-5"
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {["History", "Collection", "Variable"].map((option) => (
                <ToggleButton
                  key={option}
                  option={option}
                  selectedOption={selectedOption}
                  handleOptionSelect={handleOptionSelect}
                />
              ))}
            </motion.div>

            {/* Enhanced Search Field */}
            <motion.div 
              className="flex items-center gap-1 sm:gap-2 md:gap-3 mb-3 md:mb-5"
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder={
                    selectedOption ? `Filter ${selectedOption}` : "Select an option to filter"
                  }
                  className="w-full pl-8 pr-2 sm:pr-3 md:pr-4 py-2 md:py-3 text-xs sm:text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  disabled={!selectedOption}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <motion.button
                className="h-full px-2 sm:px-3 md:px-4 py-2 md:py-3 bg-red-600 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all duration-300 ease-in-out flex items-center justify-center"
                onClick={handleClear}
                disabled={!selectedOption || filterText === ""}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ opacity: !selectedOption || filterText === "" ? 0.7 : 1 }}
              >
                <span>Clear</span>
              </motion.button>
            </motion.div>

            {/* Filter results statistics */}
            {selectedOption && (
              <motion.div
                className="text-xs text-gray-500 mb-2 px-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {filterText ? 
                  `Found ${filteredData.length} of ${mockData[selectedOption].length} ${selectedOption.toLowerCase()}` : 
                  `${mockData[selectedOption].length} ${selectedOption.toLowerCase()} available`
                }
              </motion.div>
            )}

            {/* Scrollable List of Cards */}
            <motion.div 
              className="overflow-y-auto flex-1 pr-1 sm:pr-2 md:pr-3 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50"
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <AnimatePresence>
                {selectedOption ? (
                  filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <ListItem
                        key={item.id}
                        item={item}
                        selectedOption={selectedOption}
                        getMethodColor={getMethodColor}
                      />
                    ))
                  ) : (
                    <motion.div 
                      className="flex flex-col items-center justify-center py-8 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-500 text-xs sm:text-sm md:text-base">
                        No {selectedOption} {filterText ? "matches your filter" : "available"}
                      </p>
                      {filterText && (
                        <button 
                          className="mt-3 text-blue-500 text-xs hover:underline"
                          onClick={handleClear}
                        >
                          Clear filter
                        </button>
                      )}
                    </motion.div>
                  )
                ) : (
                  <motion.div 
                    className="flex flex-col items-center justify-center py-8 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 text-xs sm:text-sm md:text-base">
                      Please select an option above
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;