import { useState } from "react";

export default function RegexCommunityHelper() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("community");

  // Sample regex data
  const regexData = [
    { id: 1, pattern: "\\d+", description: "Matches digits", owner: "community" },
    { id: 2, pattern: "[a-zA-Z]+", description: "Matches letters", owner: "owned" },
    { id: 3, pattern: "\\w+", description: "Matches words", owner: "community" },
  ];

  // Filter regex patterns based on search and active tab
  const filteredRegex = regexData.filter(
    (regex) =>
      regex.owner === activeTab && regex.pattern.includes(search)
  );

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-gray-100">
      <h2 className="text-xl font-bold mb-4">Regex Community Helper</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search regex..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Tab Filter */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "owned" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("owned")}
        >
          Owned
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "community" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("community")}
        >
          Community
        </button>
      </div>

      {/* Card Section */}
      <div className="space-y-4">
        {filteredRegex.length > 0 ? (
          filteredRegex.map((regex) => (
            <div key={regex.id} className="p-4 bg-white rounded-lg shadow">
              <p className="text-lg font-mono text-blue-600">{regex.pattern}</p>
              <p className="text-sm text-gray-600">{regex.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No regex patterns found.</p>
        )}
      </div>
    </div>
  );
}
