import mongoose from "mongoose";

const apiRequestSchema = new mongoose.Schema({
  method: { type: String, required: true }, // GET, POST, etc.
  name: { type: String, required: true }, 
  url: { type: String, required: true },
  headers: { type: Map, of: String },
  body: { type: String },
  params: { type: Map, of: String },
  collectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Collection" },
  createdAt: { type: Date, default: Date.now },
});

const ApiRequest = mongoose.model("ApiRequest", apiRequestSchema);

export default ApiRequest;