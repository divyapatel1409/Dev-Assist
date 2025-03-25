import { useState, useEffect } from "react";

export default function RegexHelperForm() {
  const [regex, setRegex] = useState("");
  const [testString, setTestString] = useState("");
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");
  const [flags, setFlags] = useState("g");
  const [copyStatus, setCopyStatus] = useState(""); // State for feedback

  // Regex Examples
  const regexExamples = [
    {
      name: "Email",
      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    },
    {
      name: "Phone Number",
      pattern:
        "^\\+?[0-9]{1,4}?[-.\\s]?\\(?[0-9]{1,3}?\\)?[-.\\s]?[0-9]{3,4}[-.\\s]?[0-9]{3,4}$",
    },
    {
      name: "URL",
      pattern:
        "^(https?:\\/\\/)?(www\\.)?[a-zA-Z0-9-]+(\\.[a-zA-Z]{2,6})+(\\/[a-zA-Z0-9@:%_+.~#?&//=]*)?$",
    },
    {
      name: "IPv4 Address",
      pattern:
        "^((25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$",
    },
    {
      name: "Hex Color",
      pattern: "^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$",
    },
    {
      name: "Password (8+ chars, 1 letter, 1 number)",
      pattern: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$",
    },
  ];

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
    setCopyStatus("Copied!"); // Show copied feedback
    setTimeout(() => setCopyStatus(""), 2000); // Reset feedback after 2 seconds
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded shadow-lg bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">🔍 Regex Helper</h1>

      {/* Regex Selection */}
      <div className="mb-4">
        <label className="block font-semibold">Select a Regex Example:</label>
        <select
          className="w-full p-2 border rounded"
          onChange={(e) => setRegex(e.target.value)}
        >
          <option value="">Custom (Enter Below)</option>
          {regexExamples.map((example, idx) => (
            <option key={idx} value={example.pattern}>
              {example.name}
            </option>
          ))}
        </select>
      </div>

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
            {copyStatus || "Copy Regex"}
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
                    e.target.checked ? flags + flag : flags.replace(flag, "")
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
                  <span className="bg-gray-200 px-1 rounded">"{match[0]}"</span>
                  at index {match.index}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
