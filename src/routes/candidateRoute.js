import express from "express";
import { upload } from "../middlewares/upload.js";
import {
  createCandidate,
  deleteCandidate,
  getAllCandidates,
  getCandidate,
  updateCandidateVotes,
} from "../controllers/candidateController.js";

const candidateRouter = express.Router();

candidateRouter.post(
  "/create",
  upload.fields([
    { name: "candidatePhoto", maxCount: 1 },
    { name: "symbolImage", maxCount: 1 },
  ]),
  createCandidate
);

candidateRouter.get("/", getAllCandidates);
candidateRouter.get("/:id", getCandidate);

candidateRouter.patch("/vote/:id", updateCandidateVotes);
candidateRouter.delete("/:id", deleteCandidate);

export default candidateRouter;
