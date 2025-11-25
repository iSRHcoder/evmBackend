import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import candidateRouter from "./src/routes/candidateRoute.js";
import panelRouter from "./src/routes/panelRoutes.js";

dotenv.config();

const app = express();

// ---------------------------------------
//             CORS CONFIG
// ---------------------------------------
const allowedOrigins = [
  "http://localhost:5173",
  "https://palika-vote.netlify.app",
  "https://www.mahavotes.info",
  "https://mahavotes.info",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow mobile apps, Postman, server-to-server requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn("❌ CORS Blocked:", origin);
      return callback(new Error("CORS blocked: " + origin), false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Preflight handling (important!)
//app.options("*", cors());

// ---------------------------------------
//        BODY PARSERS & SECURITY
// ---------------------------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Logging
app.use(morgan("dev"));

// ---------------------------------------
//                ROUTES
// ---------------------------------------

app.use("/api/candidates", candidateRouter);
app.use("/api/panel", panelRouter);

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend running successfully 🚀" });
});

app.get("/test-db", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.send("MongoDB connected!");
  } catch (err) {
    console.error("DB connection error:", err);
    res.status(500).send("MongoDB connection failed");
  }
});

export default app;
