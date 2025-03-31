import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiSearch, FiX, FiClock, FiFolder, FiCode, FiHeart } from "react-icons/fi";

// PayPalDonation Component
const PayPalDonation = ({ isVisible, onClose }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="bg-gray-50/90 backdrop-blur-sm rounded-lg p-4 border border-gray-200 mx-4 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <FiHeart className="text-rose-500" size={16} />
              <h4 className="text-sm font-medium text-gray-700">Support Development</h4>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX size={18} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-3">Help us improve this tool with your contribution</p>
          <div className="w-full h-10 bg-white rounded flex items-center justify-center text-xs text-gray-400 border border-gray-200">
            [PayPal Button Integration]
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ToggleButton Component
const ToggleButton = ({ option, selectedOption, handleOptionSelect }) => {
  const icons = {
    History: <FiClock size={16} className="opacity-70" />,
    Collection: <FiFolder size={16} className="opacity-70" />,
    Variable: <FiCode size={16} className="opacity-70" />
  };

  return (
    <motion.button
      className={`flex-1 py-2.5 flex items-center justify-center gap-2 text-xs font-medium rounded-lg transition-all duration-200 ${
        selectedOption === option
          ? "bg-gray-100 text-gray-900"
          : "text-gray-500 hover:bg-gray-50"
      }`}
      onClick={() => handleOptionSelect(option)}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      {icons[option]}
      <span>{option}</span>
    </motion.button>
  );
};

// ListItem Component
const ListItem = ({ item, selectedOption, getMethodColor }) => (
  <motion.div
    className="p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-150 mb-2 cursor-pointer group"
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -10 }}
    whileHover={{ translateX: 1 }}
  >
    <div className="flex items-center justify-between">
      <h3 className="font-medium text-gray-800 text-sm truncate">
        {item.name}
      </h3>
      {selectedOption === "History" && (
        <span
          className={`px-2 py-1 text-[10px] font-medium rounded ${getMethodColor(item.method)}`}
        >
          {item.method}
        </span>
      )}
    </div>
    <p className="text-xs text-gray-500 mt-1 truncate">
      {selectedOption === "History" && item.url}
      {selectedOption === "Collection" && item.description}
      {selectedOption === "Variable" && `Value: ${item.value}`}
    </p>
  </motion.div>
);

const Sidebar = ({ onNewRequest, isSidebarVisible, requests = [] }) => {
  const [filterText, setFilterText] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showDonation, setShowDonation] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const mockData = {
    History: [
      { id: 1, name: "Get User Data", method: "GET", url: "/api/v1/users/123" },
      { id: 2, name: "Create Post", method: "POST", url: "/api/v1/posts" },
      { id: 3, name: "Update Profile", method: "PUT", url: "/api/v1/profile" },
    ],
    Collection: [
      { id: 1, name: "User Endpoints", description: "Authentication and user management" },
      { id: 2, name: "Content API", description: "Posts, comments and media handling" },
    ],
    Variable: [
      { id: 1, name: "API_BASE_URL", value: "https://api.example.com/v1" },
      { id: 2, name: "AUTH_TOKEN", value: "Bearer eyJhbGciOiJ..." },
    ],
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(selectedOption === option ? "" : option);
    setFilterText("");
  };

  const filteredData = selectedOption
    ? mockData[selectedOption].filter(item =>
        item.name.toLowerCase().includes(filterText.toLowerCase())
      )
    : [];

  const getMethodColor = (method) => {
    const colors = {
      GET: "bg-green-50 text-green-700",
      POST: "bg-blue-50 text-blue-700",
      PUT: "bg-amber-50 text-amber-700",
      DELETE: "bg-rose-50 text-rose-700"
    };
    return colors[method.toUpperCase()] || "bg-gray-50 text-gray-700";
  };

  const sidebarVariants = {
    open: { width: isMobile ? "280px" : "300px", transition: { type: "spring", damping: 25 } },
    closed: { width: "0px", transition: { type: "spring", damping: 25 } }
  };

  return (
    <>
      <AnimatePresence>
        {isSidebarVisible && (
          <motion.div
            className="h-full bg-white/95 backdrop-blur-sm border-r border-gray-100 flex flex-col overflow-hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
          >
            <div className="flex flex-col h-full overflow-hidden">
              {/* Header */}
              <div className="p-5 pb-4 border-b border-gray-100">
                <div className="flex justify-center mb-5">
                  <img
                    src="/images/DevAssist-Logo.png"
                    alt="Logo"
                    className="h-10 w-auto opacity-90"
                  />
                </div>

                <motion.button 
                  onClick={() => requests.length < 20 && onNewRequest()}
                  className={`w-full py-2.5 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    requests.length >= 20 ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-800"
                  }`}
                  whileHover={requests.length < 20 ? { y: -1 } : {}}
                  whileTap={requests.length < 20 ? { scale: 0.98 } : {}}
                  disabled={requests.length >= 20}
                >
                  <FiPlus size={16} />
                  <span>New Request</span>
                </motion.button>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col overflow-hidden p-4 pt-3">
                {/* Toggle Buttons */}
                <div className="flex gap-1.5 mb-4 bg-gray-50 p-1 rounded-lg">
                  {["History", "Collection", "Variable"].map((option) => (
                    <ToggleButton
                      key={option}
                      option={option}
                      selectedOption={selectedOption}
                      handleOptionSelect={handleOptionSelect}
                    />
                  ))}
                </div>

                {/* Search */}
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" size={14} />
                  </div>
                  <input
                    type="text"
                    placeholder={selectedOption ? `Filter ${selectedOption}` : "Select category"}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    disabled={!selectedOption}
                  />
                  {filterText && (
                    <button
                      onClick={() => setFilterText("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <FiX className="text-gray-400 hover:text-gray-600" size={14} />
                    </button>
                  )}
                </div>

                {/* Results */}
                <div className="text-xs text-gray-400 mb-2 flex justify-between px-1">
                  <span>
                    {selectedOption 
                      ? filterText 
                        ? `${filteredData.length} items`
                        : `${mockData[selectedOption].length} ${selectedOption.toLowerCase()}`
                      : ""
                    }
                  </span>
                  {selectedOption && (
                    <span className="text-gray-400">{selectedOption}</span>
                  )}
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
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
                          <div className="bg-gray-100 p-3 rounded-full mb-3">
                            <FiSearch className="text-gray-400" size={18} />
                          </div>
                          <p className="text-gray-500 text-sm">
                            {filterText ? "No results found" : "No items available"}
                          </p>
                        </motion.div>
                      )
                    ) : (
                      <motion.div 
                        className="flex flex-col items-center justify-center py-8 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="bg-gray-100 p-3 rounded-full mb-3">
                          <FiFolder className="text-gray-400" size={18} />
                        </div>
                        <p className="text-gray-500 text-sm">Select a category</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Donation Panel */}
              <PayPalDonation 
                isVisible={showDonation} 
                onClose={() => setShowDonation(false)} 
              />

              {/* Donation Toggle */}
              <div className="p-4 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setShowDonation(!showDonation)}
                  className={`w-full py-2 text-xs flex items-center justify-center gap-2 rounded-lg transition-colors ${
                    showDonation 
                      ? "text-rose-500 bg-rose-50 hover:bg-rose-100" 
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <FiHeart size={14} />
                  <span>Support Development</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Donation Button */}
      {!isSidebarVisible && (
        <motion.button
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-lg z-10"
          onClick={() => setShowDonation(!showDonation)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <FiHeart size={18} />
        </motion.button>
      )}

      {/* Floating Donation Panel */}
      <AnimatePresence>
        {!isSidebarVisible && showDonation && (
          <motion.div
            className="fixed bottom-20 right-6 w-72 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <PayPalDonation 
              isVisible={true} 
              onClose={() => setShowDonation(false)} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;