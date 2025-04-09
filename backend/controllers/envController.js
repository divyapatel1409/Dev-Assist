import Env from "../models/envModel.js";

//  Create a new environment
export const createEnv = async (req, res) => {
  try {
    const { name, variables } = req.body;

    // Validate request body
    if (!name || !variables || !Array.isArray(variables) || variables.length === 0) {
      return res.send({ success: false, message: "Please enter all required fields [name, variables]" });
    }

		const newEnv = new Env({ name, variables, userId: req.user._id });
		await newEnv.save();
		
    
    return res.status(201).json({ success: true, message: "Environment created successfully", data: newEnv });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//  Get all environments
export const getAllEnvs = async (req, res) => {
  try {
		const envs = await Env.find({ userId: req.user._id });
    return res.status(200).json({ success: true, data: envs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//  Get a single environment by ID
export const getEnvById = async (req, res) => {
  try {
		const env = await Env.findOne({ _id: req.params.id, userId: req.user._id });

		if (!env) return res.status(404).json({ success: false, message: "Environment not found or unauthorized" });

		return res.status(200).json({ success: true, data: env });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//  Update an environment
export const updateEnv = async (req, res) => {
  try {
    const { name, variables } = req.body;

    // Validate request body
    if (!name || !variables || !Array.isArray(variables) || variables.length === 0) {
      return res.send({ success: false, message: "Please enter all required fields" });
    }

		const updatedEnv = await Env.findOneAndUpdate(
			{ _id: req.params.id, userId: req.user._id },
			{ name, variables },
			{ new: true }
		);
		if (!updatedEnv) {
			return res.status(404).json({ success: false, message: "Environment not found or unauthorized" });
		}

    return res.status(200).json({ success: true, message: "Environment updated successfully", data: updatedEnv });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete an environment
export const deleteEnv = async (req, res) => {
  try {
		const deletedEnv = await Env.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
		if (!deletedEnv) {
			return res.status(404).json({ success: false, message: "Environment not found or unauthorized" });
		}
    return res.status(200).json({ success: true, message: "Environment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
