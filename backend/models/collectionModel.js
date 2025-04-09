import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
});

const Collection = mongoose.model("Collection", collectionSchema);

export default Collection;
