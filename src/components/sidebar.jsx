import React, { useState } from "react";

/* Left sidebar component */
const Sidebar = () => {
  const [filterText, setFilterText] = useState(""); // State for the input field
  const [selectedOption, setSelectedOption] = useState(""); // Default to no selection

  // Mock data for History, Collection, and Variable
  const mockData = {
    History: [
      { id: 1, name: "Request 1", method: "GET", url: "https://api.example.com/data" },
      { id: 2, name: "Request 2", method: "POST", url: "https://api.example.com/create" },
      { id: 3, name: "Request 3", method: "PUT", url: "https://api.example.com/update" },
      { id: 4, name: "Request 4", method: "DELETE", url: "https://api.example.com/delete" },
    ],
    Collection: [
      { id: 1, name: "Collection 1", description: "A set of API requests" },
      { id: 2, name: "Collection 2", description: "Another set of API requests" },
    ],
    Variable: [
      { id: 1, name: "Variable 1", value: "123" },
      { id: 2, name: "Variable 2", value: "456" },
    ],
  };

  const handleClear = () => {
    setFilterText(""); // Clear the input field
  };

  const handleOptionSelect = (option) => {
    // Toggle the selected option
    if (selectedOption === option) {
      setSelectedOption(""); // Deselect if the same option is clicked
    } else {
      setSelectedOption(option); // Select the new option
    }
    setFilterText(""); // Reset filter text when option changes
  };

  // Filter data based on the selected option and filter text
  const filteredData = selectedOption
    ? mockData[selectedOption].filter((item) =>
        item.name.toLowerCase().includes(filterText.toLowerCase())
      )
    : [];

  // Function to get the color for HTTP methods
  const getMethodColor = (method) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "bg-green-100 text-green-800 border-green-200"; // Green for GET
      case "POST":
        return "bg-blue-100 text-blue-800 border-blue-200"; // Blue for POST
      case "PUT":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"; // Yellow for PUT
      case "DELETE":
        return "bg-red-100 text-red-800 border-red-200"; // Red for DELETE
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"; // Gray for other methods
    }
  };

  return (
    <div className="w-80 h-screen bg-white shadow-lg rounded-lg p-6 border border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="flex justify-center items-center mb-8">
        <img
          src="images/DevAssist-Logo.png"
          alt="Dev Assist Logo"
          className="w-40 h-20"
        />
      </div>

      {/* New Request Button (Full Width) */}
      <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 mb-6">
        New Request
      </button>

      {/* Toggle Switch Buttons */}
      <div className="flex justify-between space-x-3 border-b border-gray-300 pb-4 mb-6">
        <button
          className={`w-1/3 py-2 text-gray-700 font-semibold rounded-lg transition-all duration-300 ease-in-out ${
            selectedOption === "History"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => handleOptionSelect("History")}
        >
          History
        </button>
        <button
          className={`w-1/3 py-2 text-gray-700 font-semibold rounded-lg transition-all duration-300 ease-in-out ${
            selectedOption === "Collection"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => handleOptionSelect("Collection")}
        >
          Collection
        </button>
        <button
          className={`w-1/3 py-2 text-gray-700 font-semibold rounded-lg transition-all duration-300 ease-in-out ${
            selectedOption === "Variable"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => handleOptionSelect("Variable")}
        >
          Variable
        </button>
      </div>

      {/* Dynamic Search Field */}
      <div className="flex items-center space-x-3 mb-6">
        <input
          type="text"
          placeholder={
            selectedOption ? `Filter ${selectedOption}` : "Select an option to filter"
          } // Dynamic placeholder
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
          value={filterText} // Bind the value of the input to the state
          onChange={(e) => setFilterText(e.target.value)} // Update the state when the input changes
          disabled={!selectedOption} // Disable input if no option is selected
        />
        <button
          className="px-4 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all duration-300 ease-in-out"
          onClick={handleClear} // Clear the input field when clicked
          disabled={!selectedOption} // Disable clear button if no option is selected
        >
          Clear
        </button>
      </div>

      {/* Scrollable List of Cards */}
      <div className="overflow-y-auto flex-1 pr-4 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50">
        {selectedOption ? (
          filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out mb-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  {selectedOption === "History" && (
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full border ${getMethodColor(
                        item.method
                      )}`}
                    >
                      {item.method}
                    </span>
                  )}
                </div>
                {selectedOption === "History" && (
                  <p className="text-sm text-gray-600 mt-2 break-all">{item.url}</p>
                )}
                {selectedOption === "Collection" && (
                  <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                )}
                {selectedOption === "Variable" && (
                  <p className="text-sm text-gray-600 mt-2">Value: {item.value}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No {selectedOption} Available</p>
          )
        ) : (
          <p className="text-gray-500 text-center">Please select an option</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;