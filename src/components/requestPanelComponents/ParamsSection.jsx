import React from "react";

const ParamsSection = ({ params, setParams }) => {
    const handleParamChange = (index, field, value) => {
      const newParams = [...params];
      newParams[index][field] = value;
      setParams(newParams);
    };
  
    const addParam = () => setParams([...params, { key: "", value: "" }]);
    const removeParam = (index) => setParams(params.filter((_, i) => i !== index));
  
    return (
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Params</h2>
        {params.map((param, index) => (
          <div key={index} className="flex items-center space-x-4 mb-2">
            <input type="text" placeholder="Key" value={param.key} onChange={(e) => handleParamChange(index, "key", e.target.value)} className="px-4 py-2 border rounded-lg" />
            <input type="text" placeholder="Value" value={param.value} onChange={(e) => handleParamChange(index, "value", e.target.value)} className="px-4 py-2 border rounded-lg" />
            <button onClick={() => removeParam(index)} className="px-4 py-2 bg-red-500 text-white rounded-lg">✕</button>
          </div>
        ))}
        <button onClick={addParam} className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg">Add Param</button>
      </div>
    );
  };
  
  export default ParamsSection;
