import { useState } from "react";

export default function RegexHelperForm() {
  const [regex, setRegex] = useState("");
  const [testString, setTestString] = useState("");
  const [matches, setMatches] = useState([]);

  const handleTest = () => {
    
  };

  return (
    <div className="flex h-screen bg-white-100">
      {/* Sidebar */}

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Tabs */}
        <div className="border-b mb-4">
          <button className="px-4 py-2 border-b-2 border-black">
            Regex Tester
          </button>
        </div>

        {/* Input Fields */}
        <div>
          <input
            type="text"
            placeholder="Enter Regex Pattern"
            value={regex}
            onChange={(e) => setRegex(e.target.value)}
            className="w-full mb-2 d-input-field"
          />
          <textarea
            placeholder="Enter Test String"
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            className="w-full p-2 border h-24"
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="mt-6 space-x-4">
          <button onClick={handleTest} className="d-btn d-btn-primary">
          Test
          </button>
          <button
            onClick={() => {
              setRegex("");
              setTestString("");
              setMatches([]);
            }}
            className="d-btn d-btn-danger"
          >
            Clear
          </button>
        </div>

        {/* Results */}
        <div className="mt-6 p-4 border bg-white">
          <h2 className="font-bold">Results</h2>
          <p>Number of matches: {matches.length}</p>
          <ul>
            {matches.map((match, index) => (
              <li key={index}>
                Match {index + 1}: {match}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
