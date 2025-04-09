import ApiRequest from '../models/apiRequestModel.js';
import Collection from '../models/collectionModel.js'; // Import the Collection model

// Create a new API request
export const createApiRequest = async (req, res) => {
  try {
    const { name, method, url, headers, body, params, collectionId } = req.body;

    if (!name || !method || !url || !collectionId) {
      return res.status(400).json({ success: false, message: "Name, Method, URL, and collectionId are required" });
    }

    // Check if the provided collectionId exists
		const collection = await Collection.findOne({ _id: collectionId, userId: req.user._id });
		if (!collection) return res.status(404).json({ success: false, message: "Unauthorized to access this collection" });
		
		const newApiRequest = new ApiRequest({
			name, method, url, headers, body, params, collectionId,
			userId: req.user._id
		});
		console.log('working')

    await newApiRequest.save();
		console.log('working')

    return res.status(201).json({ success: true, message: "API request created", data: newApiRequest });
  } catch (error) {
		console.log('error occured', req.user)

    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single API request
export const getApiRequest = async (req, res) => {
  try {
		const apiRequest = await ApiRequest.findOne({ _id: req.params.id, userId: req.user._id });

    if (!apiRequest) return res.status(404).json({ success: false, message: "API request not found" });

    return res.status(200).json({ success: true, data: apiRequest });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update an existing API request
export const updateApiRequest = async (req, res) => {
  try {
    const { name, method, url, headers, body, params, collectionId } = req.body;

		const apiRequest = await ApiRequest.findOne({ _id: req.params.id, userId: req.user._id });
		if (!apiRequest) return res.status(404).json({ success: false, message: "Not found or unauthorized" });



    // Check if the provided collectionId exists when updating
		if (collectionId) {
			const collection = await Collection.findOne({ _id: collectionId, userId: req.user._id });
			if (!collection) return res.status(404).json({ success: false, message: "Unauthorized to move to that collection" });
		}

    // Update fields only if provided
    apiRequest.name = name || apiRequest.name;
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
		const apiRequest = await ApiRequest.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!apiRequest) return res.status(404).json({ success: false, message: "API request not found" });

    return res.status(200).json({ success: true, message: "API request deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
