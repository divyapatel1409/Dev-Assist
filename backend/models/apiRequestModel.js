import mongoose from "mongoose";

const apiRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  method: { type: String, required: true },
  url: { type: String, required: true },
  headers: { type: Object },
  body: { type: Object },
  params: { type: Object },
  collectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Collection", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
});


const ApiRequest = mongoose.model("ApiRequest", apiRequestSchema);

export default ApiRequest;