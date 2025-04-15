import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiX } from "react-icons/fi";

const ParamsSection = ({ params, setParams }) => {
  const handleParamChange = (index, field, value) => {
    const newParams = [...params];
    newParams[index][field] = value;
    setParams(newParams);
  };

  const addParam = () => setParams([...params, { key: "", value: "" }]);
  const removeParam = (index) => setParams(params.filter((_, i) => i !== index));

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h2 className="text-sm font-medium text-gray-700 mb-3">Query Parameters</h2>

      <div className="space-y-2">
        <AnimatePresence>
          {params.map((param, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <motion.input
                type="text"
                placeholder="Key"
                value={param.key}
                onChange={(e) => handleParamChange(index, "key", e.target.value)}
                className="w-36 px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all"
                whileHover={{ y: -1 }}
								aria-label="Input Key"
                whileTap={{ scale: 0.98 }}
              />
              <motion.input
                type="text"
                placeholder="Value"
                value={param.value}
                onChange={(e) => handleParamChange(index, "value", e.target.value)}
                className="w-36 px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all"
                whileHover={{ y: -1 }}
								aria-label="Input Value"
                whileTap={{ scale: 0.98 }}
              />
              <motion.button
                onClick={() => removeParam(index)}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
								aria-label="Remove Button"

              >
                <FiX size={14} />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.button
        onClick={addParam}
        className="py-1.5 px-3 text-white text-xs font-medium rounded-lg flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 transition-colors mt-3 w-auto"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        <FiPlus size={14} />
        <span>Add Parameter</span>
      </motion.button>
    </div>
  );
};

export default ParamsSection;