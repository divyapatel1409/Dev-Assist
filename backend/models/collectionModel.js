import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Collection = mongoose.model("Collection", collectionSchema);

export default Collection;
