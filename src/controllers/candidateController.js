import cloudinary from "../config/cloudinary.js";
import { Candidate } from "../models/candidateModel.js";

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
      electionDate,
    } = req.body;

    if (!serialNo || !candidateName || !symbolName || !constituency || !party) {
      return res.status(400).json({
        success: false,
        message:
          "serialNo, candidateName, symbolName, constituency and party are required.",
      });
    }

    const candidatePhotoFile = req.files?.candidatePhoto?.[0];
    const symbolImageFile = req.files?.symbolImage?.[0];

    if (!candidatePhotoFile || !symbolImageFile) {
      return res.status(400).json({
        success: false,
        message: "Both candidate photo & symbol image are required",
      });
    }

    const candidatePhoto = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "candidates" }, (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result.secure_url);
        })
        .end(candidatePhotoFile.buffer);
    });

    const symbolImage = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "symbols" }, (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result.secure_url);
        })
        .end(symbolImageFile.buffer);
    });

    const candidate = await Candidate.create({
      serialNo,
      candidateName,
      symbolName,
      constituency,
      party,
      wardNo,
      electionDate,
      candidatePhoto,
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
