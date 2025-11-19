import dotenv from "dotenv";
import app from "./app.js";
import { connectDb } from "./src/db/connectDb.js";
dotenv.config();

const PORT = process.env.PORT || 5000;

// connect DB first
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🔥 Server running on port ${PORT}`);
  });
});
