import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RequestPanel from "./RequestPanel";
import { FiPlus } from "react-icons/fi";

const MultiReqTab = ({ 
  requests, 
  setRequests, 
  activeTab, 
  setActiveTab, 
  onNewRequest,
  onCloseRequest,
  onResponseReceived 
}) => {
  useEffect(() => {
    if (requests.length === 0) {
      onNewRequest();
    }
  }, []);

  const toggleTabExpansion = (id) => {
    setRequests(requests.map(request => 
      request.id === id 
        ? { ...request, isExpanded: !request.isExpanded } 
        : request
    ));
  };

  const getTabName = (request) => {
    if (!request.url) return `Request ${request.id.split('-')[1] || ""}`;
    
    let domain = "";
    try {
      const url = new URL(request.url);
      domain = url.hostname;
    } catch (e) {
      const match = request.url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/i);
      domain = match ? match[1] : "";
    }
    
    let path = "";
    try {
      const url = new URL(request.url);
      path = url.pathname;
      const segments = path.split('/').filter(segment => segment);
      if (segments.length > 0) {
        path = segments[segments.length - 1];
      }
    } catch (e) {
      const match = request.url.match(/[^\/]+$/);
      path = match ? match[0] : "";
    }
    
    if (domain && path) {
      return `${request.method} ${domain}/${path}`;
    } else if (domain) {
      return `${request.method} ${domain}`;
    } else if (path) {
      return `${request.method} /${path}`;
    } else {
      return `${request.method} ${request.url.slice(0, 15)}${request.url.length > 15 ? '...' : ''}`;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tabs Header */}
      <div className="flex items-center bg-gray-50 border-b border-gray-100 overflow-hidden">
        <AnimatePresence>
          {requests.length > 0 ? (
            <>
              <div className="flex flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
                {requests.map((request) => (
                  <motion.div
                    key={request.id}
                    className={`px-4 py-2.5 border-r border-gray-100 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                      activeTab === request.id ? "bg-white border-b-2 border-b-gray-900" : "hover:bg-gray-50"
                    }`}
                    style={{ minWidth: '120px', maxWidth: '200px' }}
                    onClick={() => setActiveTab(request.id)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className={`w-2 h-2 rounded-full ${activeTab === request.id ? "bg-gray-900" : "bg-gray-400"}`}
                      animate={activeTab === request.id ? { 
                        scale: [1, 1.2, 1], 
                        opacity: [1, 0.8, 1] 
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {getTabName(request)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseRequest(request.id);
                      }}
                      className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Mobile/Tablet Add Button - Right side */}
              <div className="md:hidden flex-shrink-0">
                <motion.button
                  className={`px-3 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center justify-center ${
                    requests.length >= 20 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={onNewRequest}
                  disabled={requests.length >= 20}
                  whileHover={requests.length < 20 ? { scale: 1.05 } : {}}
                  whileTap={requests.length < 20 ? { scale: 0.95 } : {}}
                  title={requests.length >= 20 ? "Maximum 20 tabs allowed" : "New Request"}
                >
                  <FiPlus size={16} />
                </motion.button>
              </div>
            </>
          ) : (
            <div className="px-4 py-2 text-gray-500">No open requests</div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow overflow-hidden bg-white">
        <AnimatePresence mode="wait">
          {requests.map((request) => (
            activeTab === request.id && (
              <motion.div
                key={request.id}
                className="h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <RequestPanel
                  id={request.id}
                  request={request}
                  isExpanded={request.isExpanded || false}
                  onToggle={() => toggleTabExpansion(request.id)}
                  topHeight={120}
                  onResponse={(response) => onResponseReceived(request.id, response)}
                />
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {requests.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full p-8 bg-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Request Tabs Open</h3>
            <p className="text-gray-500 text-center mb-4">Create a new request to get started with your API testing</p>
            
            <motion.button
              className={`py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors ${
                requests.length >= 20 ? "bg-gray-400 cursor-not-allowed" : "hover:bg-gray-800"
              }`}
              whileHover={requests.length < 20 ? { y: -1 } : {}}
              whileTap={requests.length < 20 ? { scale: 0.98 } : {}}
              onClick={onNewRequest}
              disabled={requests.length >= 20}
            >
              <FiPlus size={16} />
              <span>Create New Request</span>
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiReqTab;