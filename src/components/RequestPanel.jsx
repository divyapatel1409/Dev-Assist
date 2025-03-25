import React, { useReducer,useState,useEffect } from "react";
import axios from "axios";
import { requestReducer, initialState } from "./requestPanelComponents/requestReducer";
import ParamsSection from "./requestPanelComponents/ParamsSection";
import AuthorizationSection from "./requestPanelComponents/AuthSection";
import HeadersSection from "./requestPanelComponents/HeadersSection";
import BodySection from "./requestPanelComponents/BodySection";
import TestsSection from "./requestPanelComponents/TestsSection";
import SetVarSection from "./requestPanelComponents/SetVarSection";
import { getCollections, createCollection } from "../services/collectionService.js";
import { getEnvironments } from "../services/envService.js";
import { replaceEnvVariables, processObjectWithEnvVars } from '../utils/environmentUtils.js';
import { createEnvironment } from "../services/envService.js";

const RequestPanel = ({ id,isExpanded, onToggle, topHeight, onResponse }) => {
  const [state, dispatch] = useReducer(requestReducer, initialState);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
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
    if (!state.url) return alert("Please enter a URL");
    
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
  } catch (error) {
    onResponse(error);
  }
};

  return (
    <div className= "bg-white-100 p-4 border border-gray-300 relative"
    style={!isExpanded ? { height: `${topHeight}px`, overflow: "auto", borderBottom: "2px solid #ccc" } : {}}>

       {/* Header Section */}
       <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl font-semibold text-gray-800">Request #{id}</h1>
        <div className="flex items-center space-x-2">
          <button onClick={onToggle} className="text-gray-500 hover:text-gray-800 transition-all duration-200">
            {isExpanded ? "📏 Restore" : "🔽 Minimize"}
          </button>
          
        </div>
      </div>

      {!isExpanded && (
        <>
        
        {/* HTTP Method, URL, and Send Button */}
      <div className="flex space-x-4 mb-4 items-center">
      <select value={state.method} onChange={(e) => dispatch({ type: "SET_METHOD", payload: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg w-28 bg-gray-100">
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
      </select>

      <input type="text" placeholder="Enter URL" value={state.url} onChange={(e) => dispatch({ type: "SET_URL", payload: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg w-full bg-gray-100" />

      <button onClick={handleSendRequest} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 ease-in-out">
        Send
      </button>
    </div>

    {/* Tab Buttons */}
    <div className="flex space-x-4 mb-4">
      {["params", "authorization", "headers", "body", "tests", "setVar"].map((section) => (
        <button key={section} onClick={() => dispatch({ type: "SET_ACTIVE_SECTION", payload: section })} className={`px-4 py-2 ${state.activeSection === section ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"} rounded-lg`}>
          {section.charAt(0).toUpperCase() + section.slice(1)}
        </button>
      ))}
    </div>

    {/* Sections */}
    {state.activeSection === "params" && <ParamsSection params={state.params} setParams={(data) => dispatch({ type: "SET_PARAMS", payload: data })} />}
    {state.activeSection === "authorization" && <AuthorizationSection authType={state.authType} setAuthType={(data) => dispatch({ type: "SET_AUTH_TYPE", payload: data })} username={state.username} password={state.password} setUsername={(data) => dispatch({ type: "SET_USERNAME", payload: data })} setPassword={(data) => dispatch({ type: "SET_PASSWORD", payload: data })} />}
    {state.activeSection === "headers" && <HeadersSection headers={state.headers} setHeaders={(data) => dispatch({ type: "SET_HEADERS", payload: data })} />}
    {state.activeSection === "body" && <BodySection body={state.body} setBody={(data) => dispatch({ type: "SET_BODY", payload: data })} />}
    {state.activeSection === "tests" && <TestsSection testParam={state.testParam} setTestParam={(data) => dispatch({ type: "SET_TEST_PARAM", payload: data })} testValue={state.testValue} setTestValue={(data) => dispatch({ type: "SET_TEST_VALUE", payload: data })} />}
    {state.activeSection === "setVar" && <SetVarSection setVarRows={state.setVarRows} setSetVarRows={(data) => dispatch({ type: "SET_SET_VAR_ROWS", payload: data })} />}
    </>)
      }
      
    </div>
  );
};

export default RequestPanel;
