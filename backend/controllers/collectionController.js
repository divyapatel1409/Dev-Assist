import Collection from "../models/collectionModel.js";
// import ApiRequest from "../models/apiRequestModel.js";

// Create a new collection
export const createCollection = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ success: false, message: "Collection name is required" });

    const newCollection = new Collection({ name, description });
    await newCollection.save();

    return res.status(201).json({ success: true, message: "Collection created", data: newCollection });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all collections with API Requests
export const getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find();
    return res.status(200).json({ success: true, data: collections });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get a collection with all its API requests
export const getCollectionWithRequests = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) return res.status(404).json({ success: false, message: "Collection not found" });

    // const requests = await ApiRequest.find({ collectionId: req.params.id });

    return res.status(200).json({ success: true, data: { collection } }); // , requests
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a collection and its requests
export const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);
    if (!collection) return res.status(404).json({ success: false, message: "Collection not found" });

    // await ApiRequest.deleteMany({ collectionId: req.params.id });

    return res.status(200).json({ success: true, message: "Collection and its requests deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
