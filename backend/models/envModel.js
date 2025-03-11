import mongoose from "mongoose";

const envSchema = new mongoose.Schema({
  name: { type: String, required: true },
  variables: [
    {
      key: { type: String, required: true },
      value: { type: String, required: true }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const envModel = mongoose.models.environment || mongoose.model("environment", envSchema);

export default envModel;
