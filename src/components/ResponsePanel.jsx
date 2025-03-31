import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSave, FiMenu, FiCode, FiFileText, 
  FiKey, FiEdit2, FiClock, 
  FiHardDrive, FiAlertCircle, FiCheckCircle 
} from "react-icons/fi";

const ResponsePanel = ({ response }) => {
  const [activeTab, setActiveTab] = useState("body");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Convert headers object to array for easier rendering
  const headersArray = response?.headers
    ? Object.entries(response.headers).map(([key, value]) => ({ key, value }))
    : [];

  const cookiesArray = response?.cookies
    ? Object.entries(response.cookies).map(([key, value]) => ({ key, value }))
    : [];

  const safeResponse = response || { 
    status: "", 
    time: "", 
    size: "", 
    headers: [], 
    cookies: [], 
    notes: "",
    data: {}
  };

  // Tab sections configuration matching request panel style
  const tabSections = [
    { id: "body", label: "Body", icon: <FiCode size={16} className="opacity-70" /> },
    { id: "headers", label: "Headers", icon: <FiFileText size={16} className="opacity-70" /> },
    { id: "cookies", label: "Cookies", icon: <FiKey size={16} className="opacity-70" /> },
    { id: "notes", label: "Notes", icon: <FiEdit2 size={16} className="opacity-70" /> },
  ];

  // Function to save response to file
  const saveResponseToFile = () => {
    const blob = new Blob([JSON.stringify(response, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "response.json";
    a.click();
    URL.revokeObjectURL(url);
    setIsMenuOpen(false);
  };

  // Status color based on response status
  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";
    const statusCode = parseInt(status);
    if (statusCode >= 200 && statusCode < 300) return "bg-green-100 text-green-800";
    if (statusCode >= 300 && statusCode < 400) return "bg-blue-100 text-blue-800";
    if (statusCode >= 400 && statusCode < 500) return "bg-amber-100 text-amber-800";
    if (statusCode >= 500) return "bg-rose-100 text-rose-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <motion.div
      className="bg-white/95 backdrop-blur-sm rounded-lg border border-gray-100 shadow-sm relative w-full flex flex-col h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-green-500"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <h1 className="text-sm font-medium text-gray-700">Response</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Status indicators */}
          <div className={`px-2 py-1 rounded-md text-xs ${getStatusColor(safeResponse.status)}`}>
            {safeResponse.status || "No Status"}
          </div>
          <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500">
            <FiClock size={12} />
            <span>{safeResponse.time || "0ms"}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500">
            <FiHardDrive size={12} />
            <span>{safeResponse.size || "0B"}</span>
          </div>
          
          {/* Menu Button */}
          <div className="relative">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiMenu size={16} />
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-lg shadow-md z-10 py-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <motion.button
                    onClick={saveResponseToFile}
                    className="w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    whileHover={{ backgroundColor: "#f9fafb" }}
                  >
                    <FiSave size={14} />
                    <span>Save Response</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Status Indicators */}
      <div className="sm:hidden flex items-center gap-2 px-4 py-2 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <FiClock size={12} />
          <span>{safeResponse.time || "0ms"}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <FiHardDrive size={12} />
          <span>{safeResponse.size || "0B"}</span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto p-4 pt-3">
        {/* Tabs - Matching request panel style */}
        <div className="flex gap-1.5 bg-gray-50 p-1 rounded-lg mb-4">
          {tabSections.map((section) => (
            <motion.button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={`flex-1 py-2 flex items-center justify-center gap-2 text-xs font-medium rounded-lg ${
                activeTab === section.id
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              {section.icon}
              <span>{section.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          className="bg-gray-50/90 backdrop-blur-sm rounded-lg border border-gray-100 p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AnimatePresence mode="wait">
            {/* Body Tab */}
            {activeTab === "body" && (
              <motion.div
                key="body"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                {response ? (
                  <pre className="bg-white p-3 rounded-lg border border-gray-200 text-xs overflow-auto max-h-[calc(100vh-300px)]">
                    {JSON.stringify(response.data || response.message || {}, null, 2)}
                  </pre>
                ) : (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No response data available. Send a request to see results.
                  </div>
                )}
              </motion.div>
            )}

            {/* Headers Tab */}
            {activeTab === "headers" && (
              <motion.div
                key="headers"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full overflow-auto max-h-[calc(100vh-300px)]"
              >
                {headersArray.length > 0 ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {headersArray.map((header, index) => (
                      <div key={index} className="flex border-b border-gray-200 last:border-b-0">
                        <div className="w-1/3 px-3 py-2 bg-gray-100 text-xs font-medium text-gray-700 border-r border-gray-200">
                          {header.key}
                        </div>
                        <div className="w-2/3 px-3 py-2 text-xs text-gray-600 break-all">
                          {header.value}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No headers available
                  </div>
                )}
              </motion.div>
            )}

            {/* Cookies Tab */}
            {activeTab === "cookies" && (
              <motion.div
                key="cookies"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full overflow-auto max-h-[calc(100vh-300px)]"
              >
                {cookiesArray.length > 0 ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {cookiesArray.map((cookie, index) => (
                      <div key={index} className="flex border-b border-gray-200 last:border-b-0">
                        <div className="w-1/3 px-3 py-2 bg-gray-100 text-xs font-medium text-gray-700 border-r border-gray-200">
                          {cookie.key}
                        </div>
                        <div className="w-2/3 px-3 py-2 text-xs text-gray-600 break-all">
                          {cookie.value}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No cookies available
                  </div>
                )}
              </motion.div>
            )}

            {/* Notes Tab */}
            {activeTab === "notes" && (
              <motion.div
                key="notes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <textarea
                  className="w-full p-3 border border-gray-200 rounded-lg bg-white text-xs h-[calc(100vh-300px)]"
                  placeholder="Add notes about the response..."
                  value={safeResponse.notes || ""}
                  readOnly
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResponsePanel;