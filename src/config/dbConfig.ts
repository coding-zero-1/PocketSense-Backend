import mongoose from "mongoose";

const connectToDb = async (url: string) => {
  try {
    await mongoose.connect(url);
    console.log("MongoDb connected successfully")
  } catch (error: any) {
    console.log("Error connecting to MongoDb");
    process.exit(1)
  }
};

export default connectToDb;