import { useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa"; // Import a play icon for the use button
import { VscRegex } from "react-icons/vsc";
import axios from "axios"; // Import axios for API calls
import appConfig from './../appConfig.js'

export default function RegexCommunityHelper({ setRegex, refresh }) {
  const [search, setSearch] = useState("");
  const [regexData, setRegexData] = useState([]);

	const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
	console.log('Env value' , apiBaseUrl)
  // Load community regex data from the backend whenever the component mounts or refresh changes
  useEffect(() => {
    const fetchRegexData = async () => {
      try {
        // Fetch community regex patterns from the API
        const response = await axios.get(`${appConfig.API_BASE_URL}/api/regex`);
        if (response.data.success) {
          setRegexData(response.data.data); // Store the fetched regex data
        } else {
          console.error("Failed to load community regex data");
        }
      } catch (error) {
        console.error("Error fetching regex data from the backend:", error);
      }
    };

    fetchRegexData();
  }, [refresh]); // Trigger fetching when the 'refresh' prop changes

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
            <div key={regex.name} className="p-4 bg-white rounded-lg shadow flex items-center justify-between hover:shadow-md transition">
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
