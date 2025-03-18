import express from 'express';
import { createApiRequest, getApiRequest, updateApiRequest, deleteApiRequest } from '../controllers/apiRequestController.js';

const router = express.Router();

// Route to create a new API request
router.post('/request', createApiRequest);

// Route to get a single API request by ID
router.get('/request/:id', getApiRequest);

// Route to update an existing API request by ID
router.put('/request/:id', updateApiRequest);

// Route to delete an API request by ID
router.delete('/request/:id', deleteApiRequest);

export default router;
