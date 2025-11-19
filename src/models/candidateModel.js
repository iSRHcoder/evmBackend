import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    serialNo: {
      type: Number,
      required: true,
      min: [1, "Serial number must be at least 1"],
      max: [19, "Serial number must be less than 20"],
      validate: {
        validator: (value) => Number.isInteger(value),
        message: "Serial number must be an integer",
      },
    },

    candidateName: {
      type: String,
      required: true,
      trim: true,
    },

    candidatePhoto: {
      type: String,
      required: true, // store cloudinary URL or local URL
    },

    symbolName: {
      type: String,
      required: true,
      trim: true,
    },

    symbolImage: {
      type: String,
      required: true,
    },

    constituency: {
      type: String,
      required: true,
      trim: true,
    },

    electionDate: {
      type: String,
      default: "02 डिसें २०२५",
    },

    votes: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// ensure unique candidate per serial number + constituency
candidateSchema.index({ serialNo: 1, constituency: 1 }, { unique: true });

export const Candidate = mongoose.model("Candidate", candidateSchema);
