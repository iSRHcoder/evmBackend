import express from "express";
import { upload } from "../middlewares/upload.js";

import {
  createPanel,
  getPanel,
  updatePanelVotes,
} from "../controllers/panelController.js";

const panelRouter = express.Router();

// ------------------- CREATE PANEL -------------------
panelRouter.post(
  "/create",
  upload.fields([
    { name: "candidateAPhoto", maxCount: 1 },
    { name: "candidateBPhoto", maxCount: 1 },
    { name: "candidateAdhyakshPhoto", maxCount: 1 },

    { name: "candidateASymbolImage", maxCount: 1 },
    { name: "candidateBSymbolImage", maxCount: 1 },
    { name: "candidateAdhyakshSymbolImage", maxCount: 1 },

    { name: "candidatePoster", maxCount: 1 }, // optional
  ]),
  createPanel
);

// ------------------- GET ONE PANEL --------------------
panelRouter.get("/:id", getPanel);

// ------------------- UPDATE VOTES SEPARATELY ----------
panelRouter.patch("/vote/:id/:candidateType", updatePanelVotes);

export default panelRouter;
