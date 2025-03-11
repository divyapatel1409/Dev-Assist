import express from "express";
import { createEnv, getAllEnvs, getEnvById, updateEnv, deleteEnv } from "../controllers/envController.js";

const router = express.Router();

router.post("/env", createEnv);       // Create a new environment
router.get("/env", getAllEnvs);       // Get all environments
router.get("/env/:id", getEnvById);    // Get a single environment by ID
router.put("/env/:id", updateEnv);     // Update an environment
router.delete("/env/:id", deleteEnv);  // Delete an environment

export default router;
