import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to DB", connection.connection.host);
  } catch (error) {
    console.error("Error connecting to database:", error.message);
    process.exit(1);
  }
};
