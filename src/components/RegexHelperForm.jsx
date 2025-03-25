import { useState, useEffect } from "react";
import RegexCommunityHelper from "./RegexCommunityHelper";

export default function RegexHelperForm() {
  const [regex, setRegex] = useState("");
  const [testString, setTestString] = useState("");
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");
  const [flags, setFlags] = useState("g");
  const [copyStatus, setCopyStatus] = useState(""); // State for feedback
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility
  const [regexName, setRegexName] = useState(""); // State for regex name
  const [regexDescription, setRegexDescription] = useState(""); // State for regex description
  const [refreshCommunity, setRefreshCommunity] = useState(false); // Used to trigger reloading community data

  // Auto-test on change
  useEffect(() => {
    if (regex && testString) handleTest();
  }, [regex, testString, flags]);

  const handleTest = () => {
    try {
      setError("");
      const pattern = new RegExp(regex, flags);
      const matchResults = [...testString.matchAll(pattern)];
      setMatches(matchResults);
    } catch (err) {
      setError("Invalid regular expression.");
      setMatches([]);
    }
  };

  const copyRegex = () => {
    navigator.clipboard.writeText(regex);
    setCopyStatus("Copied!"); // Show feedback
    setTimeout(() => setCopyStatus(""), 2000); // Reset after 2 seconds
  };

  const handleShare = () => {
    // Retrieve current community regex from localStorage or initialize empty array
    const storedCommunityRegex = JSON.parse(localStorage.getItem("communityRegex")) || [];

    // Create a new regex entry with a unique id (using Date.now())
    const newRegex = {
      id: Date.now(),
      pattern: regex,
      name: regexName,
      description: regexDescription,
      owner: "community"
    };

    // Add new entry to stored data and save back to localStorage
    storedCommunityRegex.push(newRegex);
    localStorage.setItem("communityRegex", JSON.stringify(storedCommunityRegex));

    alert("Regex shared successfully!");
    // Close the modal and reset share form data
    setIsModalOpen(false);
    setRegexName("");
    setRegexDescription("");
    // Trigger a refresh in the community helper
    setRefreshCommunity(!refreshCommunity);
  };

  return (
    <>
      <div className="flex">
        <div className="max-w-3xl mx-auto mt-10 p-6 border rounded shadow-lg bg-gray-100">
          <h1 className="text-2xl font-bold mb-4">🔍 Regex Helper</h1>

          {/* Regex Input with Copy Button */}
          <div className="mb-4 flex items-center">
            <div className="flex w-full border rounded">
              <input
                type="text"
                value={regex}
                onChange={(e) => setRegex(e.target.value)}
                className="w-4/5 p-2 border-r rounded-l focus:outline-none"
                placeholder="Enter regex pattern here..."
              />
              <button
                onClick={copyRegex}
                disabled={!regex}
                className={`w-1/5 px-4 py-2 rounded-r focus:outline-none ${
                  !regex
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-700"
                }`}
              >
                {copyStatus || "Copy"}
              </button>
            </div>
          </div>

          {/* Flags Selection */}
          <div className="mb-4">
            <label className="block font-semibold">Flags:</label>
            <div className="flex gap-2">
              {["g", "i", "m", "s", "u"].map((flag) => (
                <label key={flag}>
                  <input
                    type="checkbox"
                    checked={flags.includes(flag)}
                    onChange={(e) =>
                      setFlags(
                        e.target.checked
                          ? flags + flag
                          : flags.replace(flag, "")
                      )
                    }
                  />
                  {flag.toUpperCase()} (
                  {flag === "g"
                    ? "Global"
                    : flag === "i"
                    ? "Case Insensitive"
                    : flag === "m"
                    ? "Multiline"
                    : flag === "s"
                    ? "Dotall"
                    : "Unicode"}
                  )
                </label>
              ))}
            </div>
          </div>

          {/* Test String Input */}
          <div className="mb-4">
            <label className="block font-semibold">Test String:</label>
            <textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              className="w-full p-2 border rounded h-24"
              placeholder="Enter text to test your regex..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                setRegex("");
                setTestString("");
                setMatches([]);
                setError("");
              }}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
            >
              Clear
            </button>

            <button
              onClick={() => setIsModalOpen(true)} // Open modal when clicked
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Share With Community
            </button>
          </div>

          {/* Results */}
          <div className="mt-6 p-4 border rounded bg-white">
            <h2 className="font-bold text-lg">Results</h2>
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div>
                <p>Number of matches: {matches.length}</p>
                <div className="p-2 bg-gray-50 border rounded min-h-[50px] overflow-hidden break-words">
                  {testString.trim() === "" ? (
                    <span className="text-gray-400 italic">
                      No input provided...
                    </span>
                  ) : (
                    testString
                      .split(new RegExp(`(${regex})`, flags))
                      .map((part, idx) =>
                        matches.some((match) => match[0] === part) ? (
                          <span
                            key={idx}
                            className="bg-yellow-300 px-1 rounded break-all"
                          >
                            {part}
                          </span>
                        ) : (
                          <span key={idx} className="break-all">
                            {part}
                          </span>
                        )
                      )
                  )}
                </div>

                <ul className="mt-3 overflow-x-auto max-w-full">
                  {matches.map((match, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-700 break-all whitespace-pre-wrap border-b py-1"
                    >
                      <strong>Match {index + 1}:</strong>
                      <span className="bg-gray-200 px-1 rounded">
                        "{match[0]}"
                      </span>
                      at index {match.index}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for sharing */}
      {isModalOpen && (
        <div
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          className="fixed inset-0 flex justify-center items-center bg-black"
        >
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">
              Share Regex with Community
            </h2>

            <div className="mb-4">
              <label className="block font-semibold">Regex Name:</label>
              <input
                type="text"
                value={regexName}
                onChange={(e) => setRegexName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter Regex name"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold">Description:</label>
              <textarea
                value={regexDescription}
                onChange={(e) => setRegexDescription(e.target.value)}
                className="w-full p-2 border rounded h-24"
                placeholder="Enter a brief description"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setIsModalOpen(false)} // Close the modal
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleShare} // Save regex to localStorage
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pass refreshCommunity as a prop so the helper can reload the data */}
      <RegexCommunityHelper setRegex={setRegex} refresh={refreshCommunity} />
    </>
  );
}
