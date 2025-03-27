import React, { useReducer, useState, useRef,useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { requestReducer, initialState } from "./requestPanelComponents/requestReducer";
import ParamsSection from "./requestPanelComponents/ParamsSection";
import AuthorizationSection from "./requestPanelComponents/AuthSection";
import HeadersSection from "./requestPanelComponents/HeadersSection";
import BodySection from "./requestPanelComponents/BodySection";
import { getCollections, createCollection } from "../services/collectionService.js";
import { getEnvironments } from "../services/envService.js";
import { replaceEnvVariables, processObjectWithEnvVars } from '../utils/environmentUtils.js';
import { createEnvironment } from "../services/envService.js";

const RequestPanel = ({ id, isExpanded, onToggle, topHeight, onResponse }) => {
  const [state, dispatch] = useReducer(requestReducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllTabs, setShowAllTabs] = useState(true);
  const tabsContainerRef = useRef(null);

  React.useEffect(() => {
    const handleResize = () => {
      // Check container width to determine if we should show slider view
      if (tabsContainerRef.current) {
        const containerWidth = tabsContainerRef.current.offsetWidth;
        setShowAllTabs(containerWidth > 500); // Threshold for switching to slider view
      }
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to determine color based on HTTP method
  const getMethodColor = (method) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "bg-green-600 hover:bg-green-700";
      case "POST":
        return "bg-blue-600 hover:bg-blue-700";
      case "PUT":
        return "bg-yellow-600 hover:bg-yellow-700";
      case "DELETE":
        return "bg-red-600 hover:bg-red-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  // Tab sections configuration
  const tabSections = [
    { id: "params", label: "Params", icon: "M4 6h16M4 12h16m-7 6h7" },
    { id: "authorization", label: "Auth", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
    { id: "headers", label: "Headers", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { id: "body", label: "Body", icon: "M4 6h16M4 12h16M4 18h7" },
  ];
  const [collections, setCollections] = useState([]);
  const [environments, setEnvironments] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedEnvironment, setSelectedEnvironment] = useState("");
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [showNewEnvironment, setShowNewEnvironment] = useState(false);
  const [newEnvironmentName, setNewEnvironmentName] = useState("");
  const [environmentVariables, setEnvironmentVariables] = useState([
    { key: "", value: "" }
  ]);


  // Fetch collections and environments on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const collectionsResponse = await getCollections();
        if (collectionsResponse.success) {
          setCollections(collectionsResponse.data);
        }
        
        const environmentsResponse = await getEnvironments();
        if (environmentsResponse.success) {
          setEnvironments(environmentsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
  }, []);

   // Function to handle creating a new collection
   const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) {
      alert("Please enter a collection name");
      return;
    }
    
    try {
      console.log("newCollectionName",typeof newCollectionName)
      const response = await createCollection({ name: newCollectionName });
      if (response.success) {
        setCollections([...collections, response.data]);
        setSelectedCollection(response.data._id);
        setNewCollectionName("");
        setShowNewCollection(false);
      }
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  };

   // Function to replace environment variables in string
   const replaceEnvVariables = (str, variables) => {
    if (!str || !variables) return str;
    
    let result = str;
    variables.forEach(variable => {
      // Replace {{variableName}} with its value
      const pattern = new RegExp(`{{${variable.key}}}`, 'g');
      result = result.replace(pattern, variable.value);
    });
    
    return result;
  };

  // Function to handle creating a new environment
  const handleCreateEnvironment = async () => {
    if (!newEnvironmentName.trim()) {
      alert("Please enter an environment name");
      return;
    }

    // Filter out empty variables
    const filteredVariables = environmentVariables.filter(
      variable => variable.key.trim() !== ""
    );
    
    try {
      const response = await createEnvironment({
        name: newEnvironmentName,
        variables: filteredVariables
      });
      
      if (response.success) {
        setEnvironments([...environments, response.data]);
        setSelectedEnvironment(response.data._id);
        setNewEnvironmentName("");
        setEnvironmentVariables([{ key: "", value: "" }]);
        setShowNewEnvironment(false);
      }
    } catch (error) {
      console.error("Error creating environment:", error);
    }
  };

  // Add a new variable row
  const addEnvironmentVariable = () => {
    setEnvironmentVariables([...environmentVariables, { key: "", value: "" }]);
  };
  
  // Update variable at specific index
  const updateEnvironmentVariable = (index, field, value) => {
    const newVariables = [...environmentVariables];
    newVariables[index][field] = value;
    setEnvironmentVariables(newVariables);
  };
  
  // Remove variable at specific index
  const removeEnvironmentVariable = (index) => {
    if (environmentVariables.length > 1) {
      const newVariables = [...environmentVariables];
      newVariables.splice(index, 1);
      setEnvironmentVariables(newVariables);
    }
  };


  const handleSendRequest = async () => {
    if (!state.url) {
      // Improved error feedback
      dispatch({ 
        type: "SET_ERROR", 
        payload: "Please enter a URL before sending the request"
      });
      setTimeout(() => dispatch({ type: "CLEAR_ERROR" }), 3000);
      return;
    }
    
    setIsLoading(true);
    try {
      // Get environment variables if an environment is selected
      let envVariables = [];
      if (selectedEnvironment) {
        const env = environments.find(env => env._id === selectedEnvironment);
        if (env) {
          envVariables = env.variables;
        }
      }
      
      const filteredHeaders = state.headers
        .filter((header) => header.checked && header.key)
        .reduce((acc, { key, value }) => {
          // Replace environment variables in header values
          const processedValue = replaceEnvVariables(value, envVariables);
          return { ...acc, [key]: processedValue };
        }, {});

      const queryParams = state.params.reduce((acc, { key, value }) => {
        if (key.trim() !== "") {
          // Replace environment variables in param values
          const processedValue = replaceEnvVariables(value, envVariables);
          acc[key] = processedValue;
        }
        return acc;
      }, {});

      if (state.authType === "BasicAuth") {
        filteredHeaders["Authorization"] = `Basic ${btoa(`${state.username}:${state.password}`)}`;
      } else if (state.authType === "BearerToken") {
        filteredHeaders["Authorization"] = `Bearer ${state.password}`;
      }

      // Replace environment variables in URL
      const processedUrl = replaceEnvVariables(state.url, envVariables);
      
      // Replace environment variables in the body if it's a POST/PUT request
      let processedBody = state.body;
      if (state.method !== "GET" && state.body) {
        processedBody = replaceEnvVariables(state.body, envVariables);
      }

      const config = {
        method: state.method,
        url: processedUrl,
        params: queryParams,
        headers: filteredHeaders,
        data: state.method !== "GET" ? processedBody : undefined,
      };
      console.log("Request headers:", filteredHeaders);
      const response = await axios(config);
      onResponse(response);
     // Save request to collection if one is selected
     if (selectedCollection && response) {
      try {
        await axios.post('http://localhost:5000/api/request', {
          method: state.method,
          url: state.url,
          headers: filteredHeaders,
          body: state.body,
          params: queryParams,
          collectionId: selectedCollection
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      } catch (error) {
        console.error("Error saving request to collection:", error);
      }
    }
      dispatch({ type: "SET_SUCCESS", payload: "Request sent successfully" });
      setTimeout(() => dispatch({ type: "CLEAR_SUCCESS" }), 3000);
  } catch (error) {
    onResponse(error);
      dispatch({ 
        type: "SET_ERROR", 
        payload: error.message || "An error occurred while sending the request"
      });
      setTimeout(() => dispatch({ type: "CLEAR_ERROR" }), 3000);
    } finally {
      setIsLoading(false);
    }
  };

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
      style={{ height: isExpanded ? "100%" : `${topHeight}px`, overflow: "auto" }} // Conditional height based on isExpanded
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-blue-500"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <h1 className="text-lg font-semibold text-gray-800">Request #{id}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={onToggle}
            className="px-2 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200 flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isExpanded ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                <span className="hidden sm:inline">Restore</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="hidden sm:inline">Minimize</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Always show the full UI, regardless of isExpanded */}
      <div className="p-2 sm:p-4">
        {/* Notification messages */}
        <AnimatePresence>
          {state.error && (
            <motion.div
              className="bg-red-100 border border-red-300 text-red-700 px-2 sm:px-4 py-2 rounded-lg mb-4 flex items-center justify-between"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm sm:text-base">{state.error}</span>
              </div>
              <button onClick={() => dispatch({ type: "CLEAR_ERROR" })}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          )}
          {state.success && (
            <motion.div
              className="bg-green-100 border border-green-300 text-green-700 px-2 sm:px-4 py-2 rounded-lg mb-4 flex items-center justify-between"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm sm:text-base">{state.success}</span>
              </div>
              <button onClick={() => dispatch({ type: "CLEAR_SUCCESS" })}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        
        {/* HTTP Method, URL, and Send Button - Responsive Layout */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mb-4">
          <motion.select
            value={state.method}
            onChange={(e) => dispatch({ type: "SET_METHOD", payload: e.target.value })}
            className={`px-3 py-2 border border-gray-300 rounded-lg w-full sm:w-28 font-medium ${state.method ? getMethodColor(state.method).replace('bg-', 'text-').replace('hover:', '') : 'text-gray-700'}`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </motion.select>

          <div className="relative flex-1">
            <motion.input
              type="text"
              placeholder="Enter request URL"
              value={state.url}
              onChange={(e) => dispatch({ type: "SET_URL", payload: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            />
            {state.url && (
              <button
                onClick={() => dispatch({ type: "SET_URL", payload: "" })}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <motion.button
            onClick={handleSendRequest}
            disabled={isLoading}
            className={`px-5 py-2 ${getMethodColor(state.method)} text-white font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out flex items-center justify-center gap-2`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span className="text-sm sm:text-base">Sending...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
                <span className="text-sm sm:text-base">Send</span>
              </>
            )}
          </motion.button>
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
                onClick={() => dispatch({ type: "SET_ACTIVE_SECTION", payload: section.id })}
                className={`
                  px-2 sm:px-3 py-1 sm:py-2 rounded-lg flex items-center gap-1 whitespace-nowrap
                  ${state.activeSection === section.id
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

        {/* Content Sections */}
        <motion.div
          className="bg-gray-50 rounded-lg border border-gray-200 p-2 sm:p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {state.activeSection === "params" && (
              <motion.div
                key="params"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full overflow-x-auto"
              >
                <ParamsSection params={state.params} setParams={(data) => dispatch({ type: "SET_PARAMS", payload: data })} />
              </motion.div>
            )}
            {state.activeSection === "authorization" && (
              <motion.div
                key="auth"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full overflow-x-auto"
              >
                <AuthorizationSection
                  authType={state.authType}
                  setAuthType={(data) => dispatch({ type: "SET_AUTH_TYPE", payload: data })}
                  username={state.username}
                  password={state.password}
                  setUsername={(data) => dispatch({ type: "SET_USERNAME", payload: data })}
                  setPassword={(data) => dispatch({ type: "SET_PASSWORD", payload: data })}
                />
              </motion.div>
            )}
            {state.activeSection === "headers" && (
              <motion.div
                key="headers"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full overflow-x-auto"
              >
                <HeadersSection headers={state.headers} setHeaders={(data) => dispatch({ type: "SET_HEADERS", payload: data })} />
              </motion.div>
            )}
            {state.activeSection === "body" && (
              <motion.div
                key="body"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full overflow-x-auto"
              >
                <BodySection body={state.body} setBody={(data) => dispatch({ type: "SET_BODY", payload: data })} />
              </motion.div>
            )}
            
    
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RequestPanel;