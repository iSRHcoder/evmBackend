import express from "express";
import { upload } from "../middlewares/upload.js";
import {
  createCandidate,
<<<<<<< HEAD
  deleteCandidate,
  getAllCandidates,
  getCandidate,
  updateCandidateVotes,
=======
  getAllCandidates,
  getCandidate,
>>>>>>> 6e7df337f5bd12f1e2babad2f92b842880197d83
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
<<<<<<< HEAD
candidateRouter.patch("/vote/:id", updateCandidateVotes);
candidateRouter.delete("/:id", deleteCandidate);
=======
>>>>>>> 6e7df337f5bd12f1e2babad2f92b842880197d83

export default candidateRouter;
