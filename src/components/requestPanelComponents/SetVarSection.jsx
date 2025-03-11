import React from "react";

const SetVarSection = ({ setVarRows, setSetVarRows }) => {
    const handleSetVarChange = (index, field, value) => {
      const newRows = [...setVarRows];
      newRows[index][field] = value;
      setSetVarRows(newRows);
    };
  
    const addSetVarRow = () => {
      setSetVarRows([...setVarRows, { parameter: "", value: "", variableName: "" }]);
    };
  
    const removeSetVarRow = (index) => {
      setSetVarRows(setVarRows.filter((_, i) => i !== index));
    };
  
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
                    onChange={(e) => handleSetVarChange(index, "parameter", e.target.value)}
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
                    onChange={(e) => handleSetVarChange(index, "value", e.target.value)}
                    placeholder={getValuePlaceholder(row.parameter)}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <input
                    type="text"
                    value={row.variableName}
                    onChange={(e) => handleSetVarChange(index, "variableName", e.target.value)}
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
    );
  };
  
  export default SetVarSection;
  