import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  5
);

const panelSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => nanoid(),
    },

    // ---------------------------
    // SERIAL NUMBERS
    // ---------------------------
    candidateASerialNo: Number,
    candidateBSerialNo: Number,
    candidateAdhyakshSerialNo: Number,

    multipleVotes: { type: Boolean, default: false },

    // ---------------------------
    // NAMES
    //----------------------------
    candidateAName: String,
    candidateBName: String,
    candidateAdhyakshName: String,

    // ---------------------------
    // PHOTOS
    //----------------------------
    candidateAPhoto: String,
    candidateBPhoto: String,
    candidateAdhyakshPhoto: String,

    candidatePoster: String,

    // ---------------------------
    // SYMBOLS
    //----------------------------
    candidateASymbolName: String,
    candidateBSymbolName: String,
    candidateAdhyakshSymbolName: String,

    candidateASymbolImage: String,
    candidateBSymbolImage: String,
    candidateAdhyakshSymbolImage: String,

    // ---------------------------
    // LOCATION
    //----------------------------
    constituency: String,
    wardNo: String,

    // ---------------------------
    // VOTES
    //----------------------------
    candidateAVotes: { type: Number, default: 0 },
    candidateBVotes: { type: Number, default: 0 },
    candidateAdhyakshVotes: { type: Number, default: 0 },

    // ---------------------------
    // PARTY
    //----------------------------
    candidateAParty: String,
    candidateBParty: String,
    candidateAdhyakshParty: String,

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Panel = mongoose.model("Panel", panelSchema);
