import Regex from "../models/regexModel.js";
import { HfInference  , InferenceClient } from "@huggingface/inference";
import { jsonrepair } from 'jsonrepair';

const HF_TOKEN = process.env.HF_API_KEY;
// const inference = new InferenceClient(HF_TOKEN);
const client = new HfInference(HF_TOKEN);

// Create a new regex pattern
export const createRegex = async (req, res) => {
  try {
    const { name, pattern, description } = req.body;

    // Validate request body
    if (!name || !pattern) {
      return res.status(400).json({ success: false, message: "Name and pattern are required." });
    }

    const newRegex = new Regex({ name, pattern, description });
    await newRegex.save();

    return res.status(201).json({ success: true, message: "Regex pattern created successfully", data: newRegex });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all regex patterns
export const getAllRegex = async (req, res) => {
  try {
    const regexPatterns = await Regex.find();
    return res.status(200).json({ success: true, data: regexPatterns });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single regex pattern by ID
export const getRegexById = async (req, res) => {
  try {
    const regex = await Regex.findById(req.params.id);
    if (!regex) {
      return res.status(404).json({ success: false, message: "Regex pattern not found." });
    }
    return res.status(200).json({ success: true, data: regex });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update a regex pattern
export const updateRegex = async (req, res) => {
  try {
    const { name, pattern, description } = req.body;
    const updatedRegex = await Regex.findByIdAndUpdate(
      req.params.id,
      { name, pattern, description },
      { new: true }
    );

    if (!updatedRegex) {
      return res.status(404).json({ success: false, message: "Regex pattern not found." });
    }

    return res.status(200).json({ success: true, message: "Regex updated successfully", data: updatedRegex });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a regex pattern
export const deleteRegex = async (req, res) => {
  try {
    const deletedRegex = await Regex.findByIdAndDelete(req.params.id);
    if (!deletedRegex) {
      return res.status(404).json({ success: false, message: "Regex pattern not found." });
    }
    return res.status(200).json({ success: true, message: "Regex deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Define the API endpoint for generating regex
export const generateRegex = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required." });

	 // Create the improved prompt to enforce rules
	 const aiPrompt = `Generate a regular expression for the following task: ${prompt}. Please return only the regex pattern in the following format: { "regex": "<your_regex_here>", "test": "<example_test_string>" }. Do not include any additional information or explanations.`;


    // // Prepare the system message to enforce behavior rules
    // const systemMessage = {
    //   role: "system",
    //   content: "You are an assistant that generates regular expressions. Return **only** the regular expression in the following JSON format: { \"regex\": \"<regex-pattern>\" }. Do not include any explanations, descriptions, or extra text. Only return the regex pattern."
    // };

    // Call the Hugging Face API to generate the regex pattern
    const response = await client.chatCompletion({
      // model: "beowolx/CodeNinja-1.0-OpenChat-7B", // Choose a suitable model for your task
			model: "deepseek-ai/DeepSeek-Coder-V2-Lite-Instruct",
      messages: [
        { role: "user", content: aiPrompt } // User's request for the regex
      ],
      // provider: "novita",  // Set provider to Hugging Face
			provider: "nebius",
      max_tokens: 256,     // Limit response length
      top_p: 0.7,          // Use nucleus sampling
      temperature: 0.5 ,    // Ensure deterministic output
			stream: false
    });

    // Extract the regex pattern from the response
    let regexOutput = response.choices[0]?.message?.content || "{}";
		// console.log(regexOutput)
		// console.log(typeof regexOutput)
		// regexOutput = JSON.parse(regexOutput); 

		let parsedOutput;
		console.log(regexOutput)
		try {
			// Attempt to parse the output as valid JSON
			parsedOutput = JSON.parse(regexOutput);
		} catch (initialParseError) {
			console.warn("Initial JSON parsing failed. Attempting repair...");
			try {
				// Repair the JSON string and parse again
				const repairedJson = jsonrepair(regexOutput);
				console.log("Repaired JSON:", repairedJson);
				parsedOutput = JSON.parse(repairedJson);
			} catch (repairError) {
				console.error("Failed to repair or parse JSON:", repairError);
				return res.status(500).json({ error: "Failed to process regex output." });
			}
		}
		
		console.log("Parsed Output:", parsedOutput);
		return res.json(parsedOutput);
		// console.log(regexOutput) 
		// console.log(regexOutput , 'Parsed : ' , JSON.parse(regexOutput) )

    // // Try parsing the regexOutput to validate JSON structure
    // // let parsedOutput;
    // try {
    //   parsedOutput = JSON.parse(regexOutput);
    // } catch (parseError) {
    //   console.error("Error parsing regex output:", parseError);
    //   return res.status(400).json({ error: "Invalid JSON format returned by AI", raw: regexOutput });
    // }

    // // Validate the regex pattern
    // if (parsedOutput.regex && typeof parsedOutput.regex === "string") {
    //   try {
    //     new RegExp(parsedOutput.regex); // Validate regex syntax
    //   } catch (regexError) {
    //     console.error("Invalid regex pattern:", regexError);
    //     return res.status(400).json({ error: "Invalid regex pattern returned", details: regexError.message });
    //   }
    // } else {
    //   return res.status(400).json({ error: "Regex pattern not found in the response." });
    // }
    
    // // Send the parsed and validated output as JSON response
    // res.json(parsedOutput);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
