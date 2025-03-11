import React, { useReducer,useState } from "react";
import axios from "axios";
import { requestReducer, initialState } from "./requestPanelComponents/requestReducer";
import ParamsSection from "./requestPanelComponents/ParamsSection";
import AuthorizationSection from "./requestPanelComponents/AuthSection";
import HeadersSection from "./requestPanelComponents/HeadersSection";
import BodySection from "./requestPanelComponents/BodySection";
import TestsSection from "./requestPanelComponents/TestsSection";
import SetVarSection from "./requestPanelComponents/SetVarSection";

const RequestPanel = ({ id,isExpanded, onToggle, topHeight, onResponse }) => {
  const [state, dispatch] = useReducer(requestReducer, initialState);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const handleSendRequest = async () => {
    if (!state.url) return alert("Please enter a URL");
    try {
      const filteredHeaders = state.headers
        .filter((header) => header.checked && header.key)
        .reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {});

      const queryParams = state.params.reduce((acc, { key, value }) => {
        if (key.trim() !== "") acc[key] = value;
        return acc;
      }, {});

      if (state.authType === "BasicAuth") {
        filteredHeaders["Authorization"] = `Basic ${btoa(`${state.username}:${state.password}`)}`;
      } else if (state.authType === "BearerToken") {
        filteredHeaders["Authorization"] = `Bearer ${state.password}`;
      }

      const config = {
        method: state.method,
        url: state.url,
        params: queryParams,
        headers: filteredHeaders,
        data: state.method !== "GET" ? state.body : undefined,
      };

      const response = await axios(config);
      onResponse(response);
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
