import mongoose from "mongoose";

const regexSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pattern: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const RegexModel = mongoose.models.regex || mongoose.model("regex", regexSchema);

export default RegexModel;
