import { customAlphabet } from "nanoid";
import cloudinary from "../config/cloudinary.js";
import { Panel } from "../models/panelModel.js";

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  5
);

// -------------------- CREATE PANEL ----------------------
export const createPanel = async (req, res) => {
  try {
    const {
      candidateASerialNo,
      candidateBSerialNo,
      candidateAdhyakshSerialNo,
      candidateAName,
      candidateBName,
      candidateAdhyakshName,
      candidateASymbolName,
      candidateBSymbolName,
      candidateAdhyakshSymbolName,
      candidateAParty,
      candidateBParty,
      candidateAdhyakshParty,
      constituency,
      wardNo,
      multipleVotes = false,
    } = req.body;

    // REQUIRED FIELDS CHECK
    if (
      !candidateASerialNo ||
      !candidateBSerialNo ||
      !candidateAdhyakshSerialNo ||
      !candidateAName ||
      !candidateBName ||
      !candidateAdhyakshName ||
      !candidateASymbolName ||
      !candidateBSymbolName ||
      !candidateAdhyakshSymbolName ||
      !candidateAParty ||
      !candidateBParty ||
      !candidateAdhyakshParty ||
      !constituency ||
      !wardNo
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required except poster.",
      });
    }

    // FILES
    const candidateAPhotoFile = req.files?.candidateAPhoto?.[0];
    const candidateBPhotoFile = req.files?.candidateBPhoto?.[0];
    const candidateAdhyakshPhotoFile = req.files?.candidateAdhyakshPhoto?.[0];

    const candidateASymbolImageFile = req.files?.candidateASymbolImage?.[0];
    const candidateBSymbolImageFile = req.files?.candidateBSymbolImage?.[0];
    const candidateAdhyakshSymbolImageFile =
      req.files?.candidateAdhyakshSymbolImage?.[0];

    const candidatePosterFile = req.files?.candidatePoster?.[0];

    // Required PHOTOS check
    if (
      !candidateAPhotoFile ||
      !candidateBPhotoFile ||
      !candidateAdhyakshPhotoFile ||
      !candidateASymbolImageFile ||
      !candidateBSymbolImageFile ||
      !candidateAdhyakshSymbolImageFile
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All candidate photos and symbol images are required. Poster is optional.",
      });
    }

    // Helper Cloudinary
    const uploadToCloudinary = (file, folder) =>
      new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder }, (err, result) => {
            if (err) reject(err);
            else resolve(result.secure_url);
          })
          .end(file.buffer);
      });

    // Upload section
    const candidateAPhoto = await uploadToCloudinary(
      candidateAPhotoFile,
      "panel/candidateA"
    );
    const candidateBPhoto = await uploadToCloudinary(
      candidateBPhotoFile,
      "panel/candidateB"
    );
    const candidateAdhyakshPhoto = await uploadToCloudinary(
      candidateAdhyakshPhotoFile,
      "panel/adhyaksh"
    );

    const candidateASymbolImage = await uploadToCloudinary(
      candidateASymbolImageFile,
      "panel/symbolA"
    );
    const candidateBSymbolImage = await uploadToCloudinary(
      candidateBSymbolImageFile,
      "panel/symbolB"
    );
    const candidateAdhyakshSymbolImage = await uploadToCloudinary(
      candidateAdhyakshSymbolImageFile,
      "panel/symbolAdhyaksh"
    );

    let candidatePoster = null;
    if (candidatePosterFile) {
      candidatePoster = await uploadToCloudinary(
        candidatePosterFile,
        "panel/poster"
      );
    }

    // SAVE PANEL
    const panel = await Panel.create({
      _id: nanoid(),
      candidateASerialNo,
      candidateBSerialNo,
      candidateAdhyakshSerialNo,

      candidateAName,
      candidateBName,
      candidateAdhyakshName,

      candidateASymbolName,
      candidateBSymbolName,
      candidateAdhyakshSymbolName,

      candidateAParty,
      candidateBParty,
      candidateAdhyakshParty,

      candidateAPhoto,
      candidateBPhoto,
      candidateAdhyakshPhoto,

      candidateASymbolImage,
      candidateBSymbolImage,
      candidateAdhyakshSymbolImage,

      candidatePoster,
      constituency,
      wardNo,
      multipleVotes,
    });

    res.status(201).json({
      success: true,
      message: "Panel created successfully",
      data: panel,
    });
  } catch (err) {
    console.error("Create panel error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ----------------- GET ONE PANEL -------------------
export const getPanel = async (req, res) => {
  try {
    const panel = await Panel.findById(req.params.id);

    if (!panel) {
      return res
        .status(404)
        .json({ success: false, message: "Panel not found" });
    }

    res.status(200).json({
      success: true,
      data: panel,
    });
  } catch (err) {
    console.error("Get panel error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ------------------------------------
// UPDATE VOTES (Dynamic: A / B / ADHYAKSH)
// ------------------------------------
export const updatePanelVotes = async (req, res) => {
  try {
    const { id, candidateType } = req.params;

    const type = candidateType.toUpperCase(); // normalize

    let field = "";
    if (type === "A") field = "candidateAVotes";
    else if (type === "B") field = "candidateBVotes";
    else if (type === "ADHYAKSH") field = "candidateAdhyakshVotes";
    else return res.status(400).json({ message: "Invalid candidate type" });

    const { votes } = req.body;

    const updated = await Panel.findByIdAndUpdate(
      id,
      { [field]: votes },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Panel not found" });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("vote update error", err);
    res.status(500).json({ message: "Server error" });
  }
};
