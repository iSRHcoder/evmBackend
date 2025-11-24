import cloudinary from "../config/cloudinary.js";
import { Candidate } from "../models/candidateModel.js";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  5
);

// ---------------- CREATE CANDIDATE -------------------
export const createCandidate = async (req, res) => {
  try {
    const {
      serialNo,
      candidateName,
      symbolName,
      constituency,
      party,
      wardNo,
      multipleVotes = false,
      electionDate = "02 डिसें २०२५",
    } = req.body;

    // --- Required fields check ---
    if (!serialNo || !candidateName || !symbolName || !constituency || !party) {
      return res.status(400).json({
        success: false,
        message:
          "serialNo, candidateName, symbolName, constituency and party are required.",
      });
    }

    // Read uploaded files
    const candidatePhotoFile = req.files?.candidatePhoto?.[0];
    const symbolImageFile = req.files?.symbolImage?.[0];
    const candidatePosterFile = req.files?.candidatePoster?.[0]; // optional

    // Mandatory file check (poster is optional)
    if (!candidatePhotoFile || !symbolImageFile) {
      return res.status(400).json({
        success: false,
        message: "Candidate photo & symbol image are required.",
      });
    }

    // Helper to upload to Cloudinary
    const uploadToCloudinary = (file, folder) =>
      new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder }, (err, result) => {
            if (err) reject(err);
            else resolve(result.secure_url);
          })
          .end(file.buffer);
      });

    // Upload mandatory images
    const candidatePhoto = await uploadToCloudinary(
      candidatePhotoFile,
      "candidates"
    );

    const symbolImage = await uploadToCloudinary(symbolImageFile, "symbols");

    // Upload optional poster
    let candidatePoster = null;
    if (candidatePosterFile) {
      candidatePoster = await uploadToCloudinary(
        candidatePosterFile,
        "posters"
      );
    }

    // Save to DB
    const candidate = await Candidate.create({
      _id: nanoid(),
      serialNo,
      candidateName,
      symbolName,
      constituency,
      party,
      multipleVotes,
      wardNo,
      electionDate: electionDate || null,
      candidatePhoto,
      candidatePoster, // can be null
      symbolImage,
    });

    return res.status(201).json({
      success: true,
      message: "Candidate created successfully",
      data: candidate,
    });
  } catch (err) {
    console.error("Candidate create error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ----------------- GET ALL CANDIDATES -------------------
export const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: candidates });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ----------------- GET ONE CANDIDATE -------------------
export const getCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate)
      return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({ success: true, data: candidate });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ----------------- UPDATE CANDIDATE VOTES -------------------
export const updateCandidateVotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { votes } = req.body;

    if (typeof votes !== "number" || votes < 0) {
      return res.status(400).json({
        success: false,
        message: "Votes must be a non-negative number",
      });
    }

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res
        .status(404)
        .json({ success: false, message: "Candidate not found" });
    }

    candidate.votes = votes;
    await candidate.save();

    res.status(200).json({
      success: true,
      message: "Candidate votes updated successfully",
      data: candidate,
    });
  } catch (err) {
    console.error("Update votes error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ----------------- DELETE CANDIDATE -------------------
export const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findById(id);
    if (!candidate)
      return res
        .status(404)
        .json({ success: false, message: "Candidate not found" });

    await candidate.remove();
    res.status(200).json({ success: true, message: "Candidate deleted" });
  } catch (err) {
    console.error("Delete candidate error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
