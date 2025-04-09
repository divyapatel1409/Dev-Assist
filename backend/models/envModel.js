import mongoose from "mongoose";

const envSchema = new mongoose.Schema({
  name: { type: String, required: true },
  variables: [
    {
      key: { type: String, required: true },
      value: { type: String, required: true }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
});

const envModel = mongoose.models.environment || mongoose.model("environment", envSchema);

export default envModel;
