import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX } from 'react-icons/fi';

const BodySection = ({ body, setBody }) => {
  const [bodyType, setBodyType] = useState('raw');
  const [contentType, setContentType] = useState('application/json');
  const [jsonError, setJsonError] = useState('');
  
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
    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <h2 className="text-sm font-medium text-gray-700 mb-3">Body</h2>
      
      <div className="flex items-center mb-3 gap-2">
        <div className="w-1/3 min-w-[120px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">Body Type</label>
          <motion.select
            value={bodyType}
            onChange={(e) => setBodyType(e.target.value)}
            className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <option value="raw">Raw</option>
            <option value="form-data">Form Data</option>
            <option value="x-www-form-urlencoded">URL Encoded</option>
          </motion.select>
        </div>
        
        {bodyType === 'raw' && (
          <div className="w-1/3 min-w-[120px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Content Type</label>
            <motion.select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <option value="application/json">JSON</option>
              <option value="text/plain">Text</option>
              <option value="application/xml">XML</option>
            </motion.select>
          </div>
        )}
        
        {contentType === 'application/json' && (
          <motion.button
            onClick={formatJson}
            className="mt-5 py-1 px-2 text-xs font-medium rounded-lg bg-gray-800 text-white hover:bg-gray-700 flex items-center gap-1"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Format
          </motion.button>
        )}
      </div>
      
      <AnimatePresence>
        {jsonError && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-2 text-red-500 text-xs"
          >
            {jsonError}
          </motion.div>
        )}
      </AnimatePresence>
      
      {bodyType === 'raw' && (
        <motion.textarea
          value={body}
          onChange={handleBodyChange}
          placeholder={
            contentType === 'application/json' 
              ? '{\n  "key": "value"\n}' 
              : 'Enter request body here'
          }
          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white font-mono focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
          rows={10}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
        />
      )}
      
      {bodyType === 'form-data' && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-gray-200 rounded-lg p-2 bg-white"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-medium text-gray-700">Form Data</h3>
            <motion.button
              onClick={() => {}}
              className="py-1 px-2 text-xs flex items-center gap-1 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiPlus size={12} />
              Add Field
            </motion.button>
          </div>
          <p className="text-xs text-gray-500">Form Data implementation coming soon</p>
        </motion.div>
      )}
      
      {bodyType === 'x-www-form-urlencoded' && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-gray-200 rounded-lg p-2 bg-white"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-medium text-gray-700">URL Encoded</h3>
            <motion.button
              onClick={() => {}}
              className="py-1 px-2 text-xs flex items-center gap-1 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiPlus size={12} />
              Add Field
            </motion.button>
          </div>
          <p className="text-xs text-gray-500">x-www-form-urlencoded implementation coming soon</p>
        </motion.div>
      )}
    </div>
  );
};

export default BodySection;