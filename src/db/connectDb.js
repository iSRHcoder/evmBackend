import mongoose from "mongoose";

export const connectDb = async () => {
  const MAX_RETRIES = 5;
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        dbName: process.env.DB_NAME || "evmDB",
      });

      console.log(`🟢 MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      attempts++;
      console.error(`❌ DB Connection Failed (${attempts}/${MAX_RETRIES})`);
      console.error(error.message);

      if (attempts === MAX_RETRIES) {
        console.error("❌ Max retries reached. Shutting down...");
        process.exit(1);
      }

      console.log("⏳ Retrying in 5 seconds...");
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
};
