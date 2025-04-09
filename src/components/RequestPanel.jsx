import React, { useReducer, useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { requestReducer, initialState } from "./requestPanelComponents/requestReducer";
import ParamsSection from "./requestPanelComponents/ParamsSection";
import AuthorizationSection from "./requestPanelComponents/AuthSection";
import HeadersSection from "./requestPanelComponents/HeadersSection";
import BodySection from "./requestPanelComponents/BodySection";
import { getCollections, createCollection } from "../services/collectionService.js";
import { getEnvironments } from "../services/envService.js";
import { replaceEnvVariables } from '../utils/environmentUtils.js';
import { createEnvironment } from "../services/envService.js";
import { AuthContext } from "../context/AuthContext";
import { 
  FiSend, FiX, FiSearch, FiPlus, 
  FiChevronUp, FiChevronDown, FiLoader, 
  FiCheckCircle, FiAlertCircle, FiKey, 
  FiFileText, FiCode, FiEye, FiEyeOff,
  FiSave
} from "react-icons/fi";

const RequestPanel = ({ id, request, isExpanded, onToggle, topHeight, onResponse }) => {
  const { user } = useContext(AuthContext);
  const [state, dispatch] = useReducer(requestReducer, {
    ...initialState,
    method: request.method || 'GET',
    url: request.url || '',
    params: request.params || [],
    headers: request.headers || [],
    body: request.body || '',
    authType: request.authType || 'None',
    username: request.username || '',
    password: request.password || '',
    name: request.name || `Request #${id}`
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [collections, setCollections] = useState([]);
  const [environments, setEnvironments] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedEnvironment, setSelectedEnvironment] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newEnvironmentName, setNewEnvironmentName] = useState("");
  const [environmentVariables, setEnvironmentVariables] = useState([{ key: "", value: "" }]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [requestName, setRequestName] = useState(request.name || `Request #${id}`);

  // Updated color scheme to match sidebar
  const colorScheme = {
    GET: {
      bg: "bg-green-50",
      text: "text-green-700",
      button: "bg-gray-900 hover:bg-gray-800",
      border: "border-green-100"
    },
    POST: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      button: "bg-gray-900 hover:bg-gray-800",
      border: "border-blue-100"
    },
    PUT: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      button: "bg-gray-900 hover:bg-gray-800",
      border: "border-amber-100"
    },
    DELETE: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      button: "bg-gray-900 hover:bg-gray-800",
      border: "border-rose-100"
    },
    DEFAULT: {
      bg: "bg-gray-50",
      text: "text-gray-700",
      button: "bg-gray-900 hover:bg-gray-800",
      border: "border-gray-100"
    }
  };

  const getMethodColors = (method) => {
    return colorScheme[method.toUpperCase()] || colorScheme.DEFAULT;
  };

  const tabSections = [
    { id: "params", label: "Params", icon: <FiSearch size={16} className="opacity-70" /> },
    { id: "authorization", label: "Auth", icon: <FiKey size={16} className="opacity-70" /> },
    { id: "headers", label: "Headers", icon: <FiFileText size={16} className="opacity-70" /> },
    { id: "body", label: "Body", icon: <FiCode size={16} className="opacity-70" /> },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collectionsRes, environmentsRes] = await Promise.all([
          getCollections(),
          getEnvironments()
        ]);
        if (collectionsRes.success) setCollections(collectionsRes.data);
        if (environmentsRes.success) setEnvironments(environmentsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();

    const interval = setInterval(fetchData, 30000); // Fetch every 30 seconds

  return () => clearInterval(interval);
  }, []);

  const handleNameChange = (e) => {
    setRequestName(e.target.value);
  };

  const handleNameBlur = () => {
    setIsEditingName(false);
    dispatch({ type: "SET_NAME", payload: requestName });
  };

  const handleNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNameBlur();
    }
  };

  const handleSendRequest = async () => {
    if (!state.url) {
      dispatch({ type: "SET_ERROR", payload: "Please enter a URL before sending the request" });
      setTimeout(() => dispatch({ type: "CLEAR_ERROR" }), 3000);
      return;
    }
    
    setIsLoading(true);
    try {
      let envVariables = [];
      if (selectedEnvironment) {
        const env = environments.find(env => env._id === selectedEnvironment);
        if (env) envVariables = env.variables;
      }
      
      const filteredHeaders = state.headers
        .filter((header) => header.checked && header.key)
        .reduce((acc, { key, value }) => ({
          ...acc, 
          [key]: replaceEnvVariables(value, envVariables)
        }), {});

      const queryParams = state.params.reduce((acc, { key, value }) => {
        if (key.trim() !== "") {
          acc[key] = replaceEnvVariables(value, envVariables);
        }
        return acc;
      }, {});

      if (state.authType === "BasicAuth") {
        filteredHeaders["Authorization"] = `Basic ${btoa(`${state.username}:${state.password}`)}`;
      } else if (state.authType === "BearerToken") {
        filteredHeaders["Authorization"] = `Bearer ${state.password}`;
      }

      const processedUrl = replaceEnvVariables(state.url, envVariables);
      const processedBody = state.method !== "GET" && state.body 
        ? replaceEnvVariables(state.body, envVariables) 
        : undefined;

      const response = await axios({
        method: state.method,
        url: processedUrl,
        params: queryParams,
        headers: filteredHeaders,
        data: processedBody,
      });

      onResponse(response);
      
      if (selectedCollection) {
        try {
          await axios.post('http://localhost:5001/api/request', {
            name: state.name,
            method: state.method,
            url: state.url,
            headers: filteredHeaders,
            body: processedBody,
            params: queryParams,
            collectionId: selectedCollection
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
        } catch (error) {
          console.error("Error saving request:", error);
        }
      }

      dispatch({ type: "SET_SUCCESS", payload: "Request sent successfully" });
      setTimeout(() => dispatch({ type: "CLEAR_SUCCESS" }), 3000);
    } catch (error) {
      onResponse(error);
      dispatch({ type: "SET_ERROR", payload: error.message || "Request failed" });
      setTimeout(() => dispatch({ type: "CLEAR_ERROR" }), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRequest = async () => {
    if (!user) {
      dispatch({ type: "SET_ERROR", payload: "Please login to save requests" });
      setTimeout(() => dispatch({ type: "CLEAR_ERROR" }), 3000);
      return;
    }

    if (!state.url) {
      dispatch({ type: "SET_ERROR", payload: "Please enter a URL before saving the request" });
      setTimeout(() => dispatch({ type: "CLEAR_ERROR" }), 3000);
      return;
    }

    if (!selectedCollection) {
      dispatch({ type: "SET_ERROR", payload: "Please select a collection to save the request" });
      setTimeout(() => dispatch({ type: "CLEAR_ERROR" }), 3000);
      return;
    }

    try {
      let envVariables = [];
      if (selectedEnvironment) {
        const env = environments.find(env => env._id === selectedEnvironment);
        if (env) envVariables = env.variables;
      }
      
      const filteredHeaders = state.headers
        .filter((header) => header.checked && header.key)
        .reduce((acc, { key, value }) => ({
          ...acc, 
          [key]: replaceEnvVariables(value, envVariables)
        }), {});

      const queryParams = state.params.reduce((acc, { key, value }) => {
        if (key.trim() !== "") {
          acc[key] = replaceEnvVariables(value, envVariables);
        }
        return acc;
      }, {});

      const processedUrl = replaceEnvVariables(state.url, envVariables);
      const processedBody = state.method !== "GET" && state.body 
        ? replaceEnvVariables(state.body, envVariables) 
        : undefined;

        if(!request._id){
          await axios.post('http://localhost:5001/api/request', {
            name: state.name,
            method: state.method,
            url: state.url,
            headers: filteredHeaders,
            body: processedBody,
            params: queryParams,
            collectionId: selectedCollection
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
        } else {
          await axios.put(`http://localhost:5001/api/request/${request._id}`, {
            name: state.name,
            method: state.method,
            url: state.url,
            headers: filteredHeaders,
            body: processedBody,
            params: queryParams,
            collectionId: selectedCollection
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
        } 

        

      

      dispatch({ type: "SET_SUCCESS", payload: "Request saved successfully" });
      setTimeout(() => dispatch({ type: "CLEAR_SUCCESS" }), 3000);
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message || "Failed to save request" });
      setTimeout(() => dispatch({ type: "CLEAR_ERROR" }), 3000);
    }
  };

  // Environment variable handlers
  const addEnvironmentVariable = () => {
    setEnvironmentVariables([...environmentVariables, { key: "", value: "" }]);
  };
  
  const updateEnvironmentVariable = (index, field, value) => {
    const newVariables = [...environmentVariables];
    newVariables[index][field] = value;
    setEnvironmentVariables(newVariables);
  };
  
  const removeEnvironmentVariable = (index) => {
    if (environmentVariables.length > 1) {
      const newVariables = [...environmentVariables];
      newVariables.splice(index, 1);
      setEnvironmentVariables(newVariables);
    }
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) {
      dispatch({ type: "SET_ERROR", payload: "Please enter a collection name" });
      setTimeout(() => dispatch({ type: "CLEAR_ERROR" }), 3000);
      return;
    }
    
    try {
      const response = await createCollection({ name: newCollectionName });
      if (response.success) {
        setCollections([...collections, response.data]);
        setSelectedCollection(response.data._id);
        setNewCollectionName("");
        dispatch({ type: "SET_SUCCESS", payload: "Collection created successfully" });
        setTimeout(() => dispatch({ type: "CLEAR_SUCCESS" }), 3000);
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message || "Failed to create collection" });
      setTimeout(() => dispatch({ type: "CLEAR_ERROR" }), 3000);
    }
  };

  const handleCreateEnvironment = async () => {
    if (!newEnvironmentName.trim()) {
      dispatch({ type: "SET_ERROR", payload: "Please enter an environment name" });
      setTimeout(() => dispatch({ type: "CLEAR_ERROR" }), 3000);
      return;
    }

    const filteredVariables = environmentVariables.filter(v => v.key.trim() !== "");
    
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
        dispatch({ type: "SET_SUCCESS", payload: "Environment created successfully" });
        setTimeout(() => dispatch({ type: "CLEAR_SUCCESS" }), 3000);
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message || "Failed to create environment" });
      setTimeout(() => dispatch({ type: "CLEAR_ERROR" }), 3000);
    }
  };

  return (
    <motion.div
      className="bg-white/95 backdrop-blur-sm rounded-lg border border-gray-100 shadow-sm relative w-full flex flex-col"
      style={{ height: isExpanded ? "100%" : `${topHeight}px` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-gray-900"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {isEditingName ? (
            <input
              type="text"
              value={requestName}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              onKeyDown={handleNameKeyDown}
              className="text-sm font-medium text-gray-700 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
              autoFocus
            />
          ) : (
            <h1 
              className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900"
              onClick={() => setIsEditingName(true)}
            >
              {requestName}
            </h1>
          )}
        </div>
        <div className="flex items-center gap-2">
          {user && (
            <motion.button
              onClick={handleSaveRequest}
              className="text-gray-600 hover:text-gray-900 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Save to Collection"
            >
              <FiSave size={16} />
            </motion.button>
          )}
          <motion.button
            onClick={onToggle}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isExpanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
          </motion.button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 pt-3">
        <AnimatePresence>
          {state.error && (
            <motion.div
              className="bg-rose-50 border border-rose-100 text-rose-500 px-4 py-2 rounded-lg mb-4 flex items-center justify-between"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center gap-2">
                <FiAlertCircle size={16} />
                <span className="text-xs font-medium">{state.error}</span>
              </div>
              <button onClick={() => dispatch({ type: "CLEAR_ERROR" })}>
                <FiX size={16} className="text-rose-400 hover:text-rose-600" />
              </button>
            </motion.div>
          )}
          {state.success && (
            <motion.div
              className="bg-green-50 border border-green-100 text-green-600 px-4 py-2 rounded-lg mb-4 flex items-center justify-between"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center gap-2">
                <FiCheckCircle size={16} />
                <span className="text-xs font-medium">{state.success}</span>
              </div>
              <button onClick={() => dispatch({ type: "CLEAR_SUCCESS" })}>
                <FiX size={16} className="text-green-400 hover:text-green-600" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Request Controls */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <motion.select
            value={state.method}
            onChange={(e) => dispatch({ type: "SET_METHOD", payload: e.target.value })}
            className={`px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium ${
              getMethodColors(state.method).bg
            } ${getMethodColors(state.method).text}`}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            style={{ minWidth: '90px' }}
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
              className="w-full px-4 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            />
            {state.url && (
              <button
                onClick={() => dispatch({ type: "SET_URL", payload: "" })}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX size={14} />
              </button>
            )}
          </div>

          <motion.button
            onClick={handleSendRequest}
            disabled={isLoading}
            className={`px-4 py-2 ${
              getMethodColors(state.method).button
            } text-white text-xs font-medium rounded-lg flex items-center justify-center gap-2`}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <>
                <FiLoader className="animate-spin" size={14} />
                <span>Sending</span>
              </>
            ) : (
              <>
                <FiSend size={14} />
                <span>Send</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Collections and Environments */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300"
            >
              <option value="">Select Collection</option>
              {collections.map(collection => (
                <option key={collection._id} value={collection._id}>{collection.name}</option>
              ))}
            </select>
          </div>
          
          <div className="relative flex-1">
            <select
              value={selectedEnvironment}
              onChange={(e) => setSelectedEnvironment(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300"
            >
              <option value="">Select Environment</option>
              {environments.map(env => (
                <option key={env._id} value={env._id}>{env.name}</option>
              ))}
              <option value="new">+ New Environment</option>
            </select>
          </div>
        </div>

        <AnimatePresence>
          {selectedCollection === "new" && (
            <motion.div
              className="bg-gray-50/90 backdrop-blur-sm rounded-lg p-3 mb-4 border border-gray-200"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-medium text-gray-700">New Collection</h4>
                <button onClick={() => setSelectedCollection("")}>
                  <FiX size={16} className="text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Collection Name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg mb-2 focus:ring-1 focus:ring-gray-300"
              />
              <motion.button
                onClick={handleCreateCollection}
                className="w-full bg-gray-900 text-white text-xs font-medium py-2 rounded-lg"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                Create Collection
              </motion.button>
            </motion.div>
          )}

          {selectedEnvironment === "new" && (
            <motion.div
              className="bg-gray-50/90 backdrop-blur-sm rounded-lg p-3 mb-4 border border-gray-200"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-medium text-gray-700">New Environment</h4>
                <button onClick={() => setSelectedEnvironment("")}>
                  <FiX size={16} className="text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Environment Name"
                value={newEnvironmentName}
                onChange={(e) => setNewEnvironmentName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg mb-2 focus:ring-1 focus:ring-gray-300"
              />
              <div className="mb-2">
                <h5 className="text-xs text-gray-500 mb-1">Variables</h5>
                {environmentVariables.map((variable, index) => (
                  <div key={index} className="flex gap-2 mb-1">
                    <input
                      type="text"
                      placeholder="Key"
                      value={variable.key}
                      onChange={(e) => updateEnvironmentVariable(index, 'key', e.target.value)}
                      className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={variable.value}
                      onChange={(e) => updateEnvironmentVariable(index, 'value', e.target.value)}
                      className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300"
                    />
                    <button
                      onClick={() => removeEnvironmentVariable(index)}
                      className="px-2 bg-gray-100 rounded-lg text-gray-500 hover:bg-gray-200"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
                <motion.button
                  onClick={addEnvironmentVariable}
                  className="w-full bg-gray-100 text-gray-600 text-xs py-1 rounded-lg flex items-center justify-center gap-1 mt-1"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiPlus size={12} />
                  <span>Add Variable</span>
                </motion.button>
              </div>
              <motion.button
                onClick={handleCreateEnvironment}
                className="w-full bg-gray-900 text-white text-xs font-medium py-2 rounded-lg"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                Create Environment
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-1.5 bg-gray-50 p-1 rounded-lg mb-4">
          {tabSections.map((section) => (
            <motion.button
              key={section.id}
              onClick={() => dispatch({ type: "SET_ACTIVE_SECTION", payload: section.id })}
              className={`flex-1 py-2 flex items-center justify-center gap-2 text-xs font-medium rounded-lg ${
                state.activeSection === section.id
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
            {state.activeSection === "params" && (
              <ParamsSection 
                params={state.params} 
                setParams={(data) => dispatch({ type: "SET_PARAMS", payload: data })} 
              />
            )}

{state.activeSection === "authorization" && (
  <div className="space-y-3">
    <div className="flex gap-4">
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          name="authType"
          checked={state.authType === "None"}
          onChange={() => dispatch({ type: "SET_AUTH_TYPE", payload: "None" })}
          className="h-3.5 w-3.5 text-gray-900 focus:ring-gray-500 border-gray-300"
        />
        <span className="text-xs text-gray-700">None</span>
      </label>
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          name="authType"
          checked={state.authType === "BasicAuth"}
          onChange={() => dispatch({ type: "SET_AUTH_TYPE", payload: "BasicAuth" })}
          className="h-3.5 w-3.5 text-gray-900 focus:ring-gray-500 border-gray-300"
        />
        <span className="text-xs text-gray-700">Basic Auth</span>
      </label>
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          name="authType"
          checked={state.authType === "BearerToken"}
          onChange={() => dispatch({ type: "SET_AUTH_TYPE", payload: "BearerToken" })}
          className="h-3.5 w-3.5 text-gray-900 focus:ring-gray-500 border-gray-300"
        />
        <span className="text-xs text-gray-700">Bearer Token</span>
      </label>
    </div>

    {state.authType === "BasicAuth" && (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <motion.input
            type="text"
            placeholder="Username"
            value={state.username}
            onChange={(e) => dispatch({ type: "SET_USERNAME", payload: e.target.value })}
            className="w-36 px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          />
          <div className="relative">
            <motion.input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={state.password}
              onChange={(e) => dispatch({ type: "SET_PASSWORD", payload: e.target.value })}
              className="w-36 px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all pr-8"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            />
            <motion.button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
            </motion.button>
          </div>
        </div>
      </div>
    )}

    {state.authType === "BearerToken" && (
      <div className="relative">
        <motion.input
          type={showPassword ? "text" : "password"}
          placeholder="Bearer Token"
          value={state.password}
          onChange={(e) => dispatch({ type: "SET_PASSWORD", payload: e.target.value })}
          className="w-36 px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all pr-8"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
        />
        <motion.button
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
        </motion.button>
      </div>
    )}
  </div>
)}

            {state.activeSection === "headers" && (
              <HeadersSection 
                headers={state.headers} 
                setHeaders={(data) => dispatch({ type: "SET_HEADERS", payload: data })} 
              />
            )}

            {state.activeSection === "body" && (
              <BodySection 
                body={state.body} 
                setBody={(data) => dispatch({ type: "SET_BODY", payload: data })} 
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RequestPanel;