import React, { useState } from "react";
import { BsRegex } from "react-icons/bs";

const RegexGenerator = ({ setRegex, setTestString }) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5001/api/regex/gen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate regex");
      }

      // Parse the JSON response
      // console.log('Response' , response);
      const data = await response.json();
      // console.log('Data' ,data);
			// setRegex(data.regex);

      if (data && data.regex && typeof data.regex === 'string') {
        // Optionally validate the regex on the client side as well
        try {
          new RegExp(data.regex);
          // Set regex directly since it's already valid
          setRegex(data.regex);
          setTestString(data.test);
        } catch (regexError) {
          throw new Error("Invalid regex pattern: " + regexError.message);
        }
      } else {
        throw new Error("Invalid response format or missing regex");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center py-4">
      <div className="flex w-full">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Generate regex using prompt..."
          className="flex-grow border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none"
        >
          {loading ? "..." : <BsRegex />}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default RegexGenerator;
