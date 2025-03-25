import React, { useState } from 'react';

const BodySection = ({ body, setBody }) => {
  const [bodyType, setBodyType] = useState('raw');
  const [contentType, setContentType] = useState('application/json');
  const [jsonError, setJsonError] = useState('');
  
  // Handle JSON validation
  const validateJson = (jsonString) => {
    try {
      if (!jsonString.trim()) {
        setJsonError('');
        return;
      }
      
      JSON.parse(jsonString);
      setJsonError('');
    } catch (error) {
      setJsonError(`Invalid JSON: ${error.message}`);
    }
  };
  
  const handleBodyChange = (e) => {
    const newBody = e.target.value;
    setBody(newBody);
    
    // Validate JSON if content type is application/json
    if (contentType === 'application/json') {
      validateJson(newBody);
    }
  };
  
  const formatJson = () => {
    try {
      if (!body.trim()) return;
      
      const parsedJson = JSON.parse(body);
      const formattedJson = JSON.stringify(parsedJson, null, 2);
      setBody(formattedJson);
      setJsonError('');
    } catch (error) {
      setJsonError(`Cannot format: ${error.message}`);
    }
  };
  
  return (
    <div className="mb-4">
      <div className="flex mb-2">
        <div className="mr-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Body Type</label>
          <select
            value={bodyType}
            onChange={(e) => setBodyType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
          >
            <option value="raw">Raw</option>
            <option value="form-data">Form Data</option>
            <option value="x-www-form-urlencoded">x-www-form-urlencoded</option>
          </select>
        </div>
        
        {bodyType === 'raw' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
            >
              <option value="application/json">JSON</option>
              <option value="text/plain">Text</option>
              <option value="application/xml">XML</option>
            </select>
          </div>
        )}
        
        {contentType === 'application/json' && (
          <div className="ml-auto">
            <button
              onClick={formatJson}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 mt-5"
            >
              Format JSON
            </button>
          </div>
        )}
      </div>
      
      {jsonError && (
        <div className="mb-2 text-red-500 text-sm">{jsonError}</div>
      )}
      
      {bodyType === 'raw' && (
        <textarea
          value={body}
          onChange={handleBodyChange}
          placeholder={
            contentType === 'application/json' 
              ? '{\n  "key": "value"\n}' 
              : 'Enter request body here'
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 font-mono"
          rows={10}
        />
      )}
      
      {/* Add form data and x-www-form-urlencoded implementations as needed */}
      {bodyType === 'form-data' && (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <p className="text-gray-500">Form Data implementation coming soon</p>
        </div>
      )}
      
      {bodyType === 'x-www-form-urlencoded' && (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <p className="text-gray-500">x-www-form-urlencoded implementation coming soon</p>
        </div>
      )}
    </div>
  );
};

export default BodySection;