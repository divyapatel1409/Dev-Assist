import axios from "axios";
import React, { useState } from "react";

const RequestPanel = ({ id, closeTab, topHeight, onResponse }) => {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [params, setParams] = useState([{ key: "", value: "" }]);
  const [headers, setHeaders] = useState([
    { key: "Cache-Control", value: "no-cache", checked: false },
    { key: "Accept", value: "*/*", checked: false },
    { key: "User-Agent", value: "Fetch Client", checked: false },
    { key: "Accept-Encoding", value: "gzip, deflate", checked: false },
    { key: "Connection", value: "keep-alive", checked: false },
  ]);
  const [body, setBody] = useState("");
  const [testParam, setTestParam] = useState("");
  const [testValue, setTestValue] = useState("");
  const [variable, setVariable] = useState("");
  const [authType, setAuthType] = useState("NoAuth");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // State for Set Variable section
  const [setVarRows, setSetVarRows] = useState([
    { parameter: "", value: "", variableName: "" },
  ]);

  const [activeSection, setActiveSection] = useState("params");

  const handleSendRequest = async () => {
    if(!url){
      return alert("PLease enter a URL")
    }
    alert("handleSendRequest function executed!"); 
    try {
      const filteredHeaders = headers
      .filter((header) => header.checked && header.key)
      .reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {});


      const queryParams = params.reduce((acc, { key, value }) => {
        if (key.trim() !== "") acc[key] = value;
        return acc;
      }, {});

      if (authType === "BasicAuth") {
        filteredHeaders["Authorization"] = `Basic ${btoa(
          `${username}:${password}`
        )}`;
      } else if (authType === "BearerToken") {
        filteredHeaders["Authorization"] = `Bearer ${password}`;
      }

      const config = {
        method,
        url,
        params: queryParams,
        headers: filteredHeaders,
        data: method !== "GET" ? body : undefined,
      };

      console.log("Sending Request with Config:", config);

    const response = await axios(config);

    alert("Response Data:", response.data);
    alert(`Response Data: ${JSON.stringify(response.data, null, 2)}`);
    alert("Request sent successfully! Check the console for details.");
    console.log(response)
    onResponse(response);
    } catch (error) {
      console.error("Error:", error);
    alert(`Request failed: ${error.message}`);
    onResponse(error)
    }
  };

  const handleParamChange = (index, field, value) => {
    const newParams = [...params];
    newParams[index][field] = value;
    setParams(newParams);
  };

  const addParam = () => {
    setParams([...params, { key: "", value: "" }]);
  };

  const removeParam = (index) => {
    const newParams = params.filter((_, i) => i !== index);
    setParams(newParams);
  };

  const handleHeaderCheckboxChange = (index) => {
    const newHeaders = [...headers];
    newHeaders[index].checked = !newHeaders[index].checked;
    setHeaders(newHeaders);
  };

  const handleHeaderChange = (index, field, value) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "", checked: false }]);
  };

  const removeHeader = (index) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);
  };

  // Handle Set Variable row changes
  const handleSetVarChange = (index, field, value) => {
    const newRows = [...setVarRows];
    newRows[index][field] = value;
    setSetVarRows(newRows);
  };

  // Add a new Set Variable row
  const addSetVarRow = () => {
    setSetVarRows([...setVarRows, { parameter: "", value: "", variableName: "" }]);
  };

  // Remove a Set Variable row
  const removeSetVarRow = (index) => {
    const newRows = setVarRows.filter((_, i) => i !== index);
    setSetVarRows(newRows);
  };

  // Get placeholder for the Value field based on the selected parameter
  const getValuePlaceholder = (parameter) => {
    switch (parameter) {
      case "Header":
        return "Enter Header Name";
      case "Cookie":
        return "Enter Cookie Name";
      case "JSON Response":
        return "Enter JSON Path (e.g., $.data.id)";
      default:
        return "Enter Value";
    }
  };

  return (
    <div className="bg-white-100 p-4 border border-gray-300 common-style-block" style={{ height: `${topHeight}px`, overflow: "auto", borderBottom: "2px solid #ccc" }}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Request #{id}</h1>
        <button
          onClick={() => closeTab(id)}
          className="text-red-500 hover:text-red-700 text-lg"
        >
          ✕
        </button>
      </div>

      {/* HTTP Method, URL, and Send Button */}
      <div className="flex space-x-4 mb-4 items-center">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-28 bg-gray-100"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>

        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full bg-gray-100"
        />

        <button
          onClick={handleSendRequest}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 ease-in-out"
        >
          Send
        </button>
      </div>

      {/* Tab Buttons */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveSection("params")}
          className={`px-4 py-2 ${activeSection === "params" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"} rounded-lg`}
        >
          Params
        </button>
        <button
          onClick={() => setActiveSection("authorization")}
          className={`px-4 py-2 ${activeSection === "authorization" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"} rounded-lg`}
        >
          Authorization
        </button>
        <button
          onClick={() => setActiveSection("headers")}
          className={`px-4 py-2 ${activeSection === "headers" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"} rounded-lg`}
        >
          Headers
        </button>
        <button
          onClick={() => setActiveSection("body")}
          className={`px-4 py-2 ${activeSection === "body" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"} rounded-lg`}
        >
          Body
        </button>
        <button
          onClick={() => setActiveSection("tests")}
          className={`px-4 py-2 ${activeSection === "tests" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"} rounded-lg`}
        >
          Tests
        </button>
        <button
          onClick={() => setActiveSection("setVar")}
          className={`px-4 py-2 ${activeSection === "setVar" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"} rounded-lg`}
        >
          Set Variable
        </button>
      </div>

      {/* Params Section */}
      {activeSection === "params" && (
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-gray-700">Params</h2>
    <div className="space-y-2">
      {params.map((param, index) => (
        <div key={index} className="flex items-center space-x-4 mb-2">
          {/* Key Input */}
          <div className="flex flex-col flex-1">
            <label htmlFor={`key-${index}`} className="text-gray-700 text-sm">
              Key
            </label>
            <input
              type="text"
              id={`key-${index}`}
              placeholder="Enter Key"
              value={param.key}
              onChange={(e) => handleParamChange(index, "key", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>

          {/* Value Input */}
          <div className="flex flex-col flex-1">
            <label htmlFor={`value-${index}`} className="text-gray-700 text-sm">
              Value
            </label>
            <input
              type="text"
              id={`value-${index}`}
              placeholder="Enter Value"
              value={param.value}
              onChange={(e) => handleParamChange(index, "value", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>

          {/* Remove Button */}
          <div className="flex flex-col justify-end">
            <button
              onClick={() => removeParam(index)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 mt-6"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={addParam}
        className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Add Param
      </button>
    </div>
  </div>
)}

      {/* Authorization Section */}
      {activeSection === "authorization" && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Authorization</h2>
          <div className="space-y-2">
            <select
              value={authType}
              onChange={(e) => setAuthType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg w-48 bg-gray-100"
            >
              <option value="NoAuth">No Auth</option>
              <option value="BearerToken">Bearer Token</option>
              <option value="BasicAuth">Basic Auth</option>
            </select>

            {authType === "BasicAuth" && (
              <div className="mt-2 space-y-2">
                <div className="flex flex-col">
                  <label htmlFor="username" className="text-gray-700 text-sm">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg w-64 bg-gray-100"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="password" className="text-gray-700 text-sm">
                    Password
                  </label>
                  <div className="flex items-center">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg w-64 bg-gray-100"
                    />
                    <label className="ml-2">
                      <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                        className="mr-1"
                      />
                      Show Password
                    </label>
                  </div>
                </div>
              </div>
            )}

            {authType === "BearerToken" && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Enter Bearer Token"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg w-64 bg-gray-100"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Headers Section */}
      {activeSection === "headers" && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Headers</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border border-gray-300">Select</th>
                <th className="px-4 py-2 border border-gray-300">Header</th>
                <th className="px-4 py-2 border border-gray-300">Value</th>
                <th className="px-4 py-2 border border-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {headers.map((header, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border border-gray-300 text-center">
                    <input
                      type="checkbox"
                      checked={header.checked}
                      onChange={() => handleHeaderCheckboxChange(index)}
                    />
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <input
                      type="text"
                      value={header.key}
                      onChange={(e) => handleHeaderChange(index, "key", e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <input
                      type="text"
                      value={header.value}
                      onChange={(e) => handleHeaderChange(index, "value", e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-4 py-2 border border-gray-300 text-center">
                    <button
                      onClick={() => removeHeader(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={addHeader}
            className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Add Header
          </button>
        </div>
      )}

      {/* Body Section */}
      {activeSection === "body" && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Body</h2>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Enter request body (e.g., JSON)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
            rows={6} // Reduced rows for a smaller field
          />
        </div>
      )}

      {/* Tests Section */}
      {activeSection === "tests" && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Tests</h2>
          <div className="space-y-2">
            <div className="flex flex-col">
              <label htmlFor="testParam" className="text-gray-700 text-sm">
                Test Parameter
              </label>
              <input
                type="text"
                id="testParam"
                placeholder="Enter Test Parameter"
                value={testParam}
                onChange={(e) => setTestParam(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 w-64" // Smaller width
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="testValue" className="text-gray-700 text-sm">
                Test Value
              </label>
              <input
                type="text"
                id="testValue"
                placeholder="Enter Test Value"
                value={testValue}
                onChange={(e) => setTestValue(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 w-64" // Smaller width
              />
            </div>
          </div>
        </div>
      )}

      {/* Set Variable Section */}
      {activeSection === "setVar" && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Set Variable</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border border-gray-300">Parameter</th>
                <th className="px-4 py-2 border border-gray-300">Value</th>
                <th className="px-4 py-2 border border-gray-300">Variable Name</th>
                <th className="px-4 py-2 border border-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {setVarRows.map((row, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border border-gray-300">
                    <select
                      value={row.parameter}
                      onChange={(e) =>
                        handleSetVarChange(index, "parameter", e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                    >
                      <option value="">Select Parameter</option>
                      <option value="Header">Header</option>
                      <option value="Cookie">Cookie</option>
                      <option value="JSON Response">JSON Response</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <input
                      type="text"
                      value={row.value}
                      onChange={(e) =>
                        handleSetVarChange(index, "value", e.target.value)
                      }
                      placeholder={getValuePlaceholder(row.parameter)}
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <input
                      type="text"
                      value={row.variableName}
                      onChange={(e) =>
                        handleSetVarChange(index, "variableName", e.target.value)
                      }
                      placeholder="Enter Variable Name"
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-4 py-2 border border-gray-300 text-center">
                    <button
                      onClick={() => removeSetVarRow(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={addSetVarRow}
            className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Add Row
          </button>
        </div>
      )}
    </div>
  );
};

export default RequestPanel;