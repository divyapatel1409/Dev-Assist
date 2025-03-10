import express from "express";
import { createCollection, getAllCollections, getCollectionWithRequests, deleteCollection } from "../controllers/collectionController.js";

const router = express.Router();

router.post("/collection", createCollection);
router.get("/collection", getAllCollections);
router.get("/collection/:id", getCollectionWithRequests);
router.delete("/collection/:id", deleteCollection);

export default router;
