import React from "react";

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
    );
  };
  
  export default HeadersSection;
  