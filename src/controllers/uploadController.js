import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "evm_images" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(file.buffer);
    });

    res.json({
      message: "Uploaded successfully",
      url: uploadResult.secure_url,
    });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error });
  }
};
