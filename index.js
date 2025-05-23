import express from "express";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./lib/db.js";
import bookRoutes from "./routes/bookRoutes.js";
import job from "./lib/cron.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

job.start();

app.listen(PORT, () => {
  console.log("Server running ", PORT);
  connectDB();
});

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
