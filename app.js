import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import candidateRouter from "./src/routes/candidateRoute.js";

dotenv.config();

const app = express();

// ---------- Middlewares ----------
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));

// ---------- Routes ----------
app.use("/api/candidates", candidateRouter);

app.get("/api/health", (req, res) => {
  res.json({ message: "Backend running successfully 🚀" });
});

export default app;
