import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

// nanoid for 5-character alphanumeric ID
const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  5
);

const candidateSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => nanoid(), // auto-generate 5-char ID
    },
    serialNo: {
      type: Number,
      required: true,
      min: [1, "Serial number must be at least 1"],
      max: [20, "Serial number must be <= 20"],
      validate: {
        validator: Number.isInteger,
        message: "Serial number must be an integer",
      },
    },
    multipleVotes: { type: Boolean, default: false },
    candidateName: { type: String, required: true, trim: true },
    candidatePhoto: { type: String, required: true },
    candidatePoster: { type: String },
    symbolName: { type: String, required: true, trim: true },
    symbolImage: { type: String, required: true },
    constituency: { type: String, required: true, trim: true },
    electionDate: { type: String, default: "02 डिसें २०२५" },
    votes: { type: Number, default: 0 },
    party: { type: String, required: true, trim: true },
    wardNo: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export const Candidate = mongoose.model("Candidate", candidateSchema);
