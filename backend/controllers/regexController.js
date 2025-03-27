import Regex from "../models/regexModel.js";

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
