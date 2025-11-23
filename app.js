import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import candidateRouter from "./src/routes/candidateRoute.js";

dotenv.config();

const app = express();

// ---------------- CORS FIX ----------------

const allowedOrigins = [
  "http://localhost:5173",
  "https://palika-vote.netlify.app",
  "https://www.mahavotes.info",
  "https://mahavotes.info",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // mobile / postman
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS blocked: " + origin), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// This MUST come after CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));

// ---------- Routes ----------
app.use("/api/candidates", candidateRouter);

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Backend running successfully 🚀" });
});

export default app;
