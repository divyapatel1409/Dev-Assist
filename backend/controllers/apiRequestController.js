import ApiRequest from '../models/apiRequestModel.js';
import Collection from '../models/collectionModel.js'; // Import the Collection model

// Create a new API request
export const createApiRequest = async (req, res) => {
  try {
    const { method, url, headers, body, params, collectionId } = req.body;

    if (!method || !url || !collectionId) {
      return res.status(400).json({ success: false, message: "Method, URL, and collectionId are required" });
    }

    // Check if the provided collectionId exists
    const collectionExists = await Collection.findById(collectionId);
    if (!collectionExists) {
      return res.status(404).json({ success: false, message: "Collection ID does not exist" });
    }

    const newApiRequest = new ApiRequest({
      method,
      url,
      headers,
      body,
      params,
      collectionId,
    });

    await newApiRequest.save();

    return res.status(201).json({ success: true, message: "API request created", data: newApiRequest });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single API request
export const getApiRequest = async (req, res) => {
  try {
    const apiRequest = await ApiRequest.findById(req.params.id);
    if (!apiRequest) return res.status(404).json({ success: false, message: "API request not found" });

    return res.status(200).json({ success: true, data: apiRequest });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update an existing API request
export const updateApiRequest = async (req, res) => {
  try {
    const { method, url, headers, body, params, collectionId } = req.body;

    // Check if the provided collectionId exists when updating
    if (collectionId) {
      const collectionExists = await Collection.findById(collectionId);
      if (!collectionExists) {
        return res.status(404).json({ success: false, message: "Collection ID does not exist" });
      }
    }

    const apiRequest = await ApiRequest.findById(req.params.id);
    if (!apiRequest) return res.status(404).json({ success: false, message: "API request not found" });

    // Update fields only if provided
    apiRequest.method = method || apiRequest.method;
    apiRequest.url = url || apiRequest.url;
    apiRequest.headers = headers || apiRequest.headers;
    apiRequest.body = body || apiRequest.body;
    apiRequest.params = params || apiRequest.params;
    apiRequest.collectionId = collectionId || apiRequest.collectionId;

    await apiRequest.save();

    return res.status(200).json({ success: true, message: "API request updated", data: apiRequest });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete an API request
export const deleteApiRequest = async (req, res) => {
  try {
    const apiRequest = await ApiRequest.findByIdAndDelete(req.params.id);
    if (!apiRequest) return res.status(404).json({ success: false, message: "API request not found" });

    return res.status(200).json({ success: true, message: "API request deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
