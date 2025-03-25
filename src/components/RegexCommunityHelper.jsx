import { useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa"; // Import a play icon for the use button
import { VscRegex } from "react-icons/vsc";

export default function RegexCommunityHelper({ setRegex, refresh }) {
  const [search, setSearch] = useState("");
  const [regexData, setRegexData] = useState([]);

  // Load community regex data from localStorage whenever the component mounts or refresh changes
  useEffect(() => {
    const storedCommunityRegex = JSON.parse(localStorage.getItem("communityRegex")) || [];
    setRegexData(storedCommunityRegex);
  }, [refresh]);

  // Filter regex patterns based on search input
  const filteredRegex = regexData.filter((regex) =>
    regex.pattern.includes(search) || regex.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-gray-100">
      <h2 className="text-xl font-bold mb-4">🔍 Regex Community Helper</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search regex by name or pattern..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Regex List Section */}
      <div className="space-y-4">
        {filteredRegex.length > 0 ? (
          filteredRegex.map((regex) => (
            <div key={regex.id} className="p-4 bg-white rounded-lg shadow flex items-center justify-between hover:shadow-md transition">
              <div>
                <p className="text-lg font-semibold">{regex.name}</p>
                <p className="text-md font-mono text-blue-600">{regex.pattern}</p>
                <p className="text-sm text-gray-600">{regex.description}</p>
              </div>
              <button
                onClick={() => setRegex(regex.pattern)}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 transition"
                title="Use this regex"
              >
                <VscRegex />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No regex patterns found.</p>
        )}
      </div>
    </div>
  );
}
