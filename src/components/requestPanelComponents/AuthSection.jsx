import React from "react";

const AuthorizationSection = ({ authType, setAuthType, username, password, setUsername, setPassword }) => {
    return (
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Authorization</h2>
        <select value={authType} onChange={(e) => setAuthType(e.target.value)} className="px-4 py-2 border rounded-lg w-48 bg-gray-100">
          <option value="NoAuth">No Auth</option>
          <option value="BearerToken">Bearer Token</option>
          <option value="BasicAuth">Basic Auth</option>
        </select>
  
        {/* Basic Auth */}
        {authType === "BasicAuth" && (
          <div className="mt-2 space-y-2">
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="px-4 py-2 border rounded-lg w-64 bg-gray-100" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="px-4 py-2 border rounded-lg w-64 bg-gray-100" />
          </div>
        )}
  
        {/* Bearer Token */}
        {authType === "BearerToken" && (
          <input type="text" placeholder="Enter Bearer Token" value={password} onChange={(e) => setPassword(e.target.value)} className="px-4 py-2 border rounded-lg w-64 bg-gray-100 mt-2" />
        )}
      </div>
    );
  };
  
  export default AuthorizationSection;
  
