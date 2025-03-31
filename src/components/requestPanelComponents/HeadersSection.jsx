import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiX } from "react-icons/fi";

const HeadersSection = ({ headers, setHeaders }) => {
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
    setHeaders(headers.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <h2 className="text-sm font-medium text-gray-700 mb-3">Headers</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-xs text-gray-500">
              <th className="px-2 py-1.5 border-b border-gray-200 text-left">Include</th>
              <th className="px-2 py-1.5 border-b border-gray-200 text-left">Key</th>
              <th className="px-2 py-1.5 border-b border-gray-200 text-left">Value</th>
              <th className="px-2 py-1.5 border-b border-gray-200 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {headers.map((header, index) => (
                <motion.tr 
                  key={index}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <td className="px-2 py-1.5">
                    <input
                      type="checkbox"
                      checked={header.checked}
                      onChange={() => handleHeaderCheckboxChange(index)}
                      className="h-3.5 w-3.5 text-gray-900 focus:ring-gray-500 border-gray-300"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <motion.input
                      type="text"
                      value={header.key}
                      onChange={(e) => handleHeaderChange(index, "key", e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <motion.input
                      type="text"
                      value={header.value}
                      onChange={(e) => handleHeaderChange(index, "value", e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <motion.button
                      onClick={() => removeHeader(index)}
                      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiX size={14} />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <motion.button
        onClick={addHeader}
        className="mt-3 py-1.5 px-3 text-white text-xs font-medium rounded-lg flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 transition-colors w-auto"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        <FiPlus size={14} />
        <span>Add Header</span>
      </motion.button>
    </div>
  );
};

export default HeadersSection;