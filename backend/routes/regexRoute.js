import express from "express";
import {
  createRegex,
  getAllRegex,
  getRegexById,
  updateRegex,
  deleteRegex,	
} from "../controllers/regexController.js";

const router = express.Router();

router.post("/regex", createRegex);       // Create a new regex pattern
router.get("/regex", getAllRegex);        // Get all regex patterns
router.get("/regex/:id", getRegexById);   // Get a single regex by ID
router.put("/regex/:id", updateRegex);    // Update a regex pattern
router.delete("/regex/:id", deleteRegex); // Delete a regex pattern

export default router;
