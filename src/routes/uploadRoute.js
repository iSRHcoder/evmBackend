import express from "express";
import { upload } from "../middlewares/upload.js";
import { uploadImage } from "../controllers/uploadController.js";

const UploadRouter = express.Router();

UploadRouter.post("/image", upload.single("image"), uploadImage);

export default UploadRouter;
