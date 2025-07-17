import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToDb from "./config/dbConfig";
import userRouter from "./routes/userRoutes";
dotenv.config();

async function main() {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    console.log("Error in mongoDb url");
    return;
  }
  connectToDb(mongoUrl);
  const app = express();
  const PORT = process.env.PORT || 3000;
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
    })
  );
  app.use(express.json());
  app.get("/", (req, res) => {
    res.send("Hello, World!");
  });

  //user router
  app.use('/api/v1',userRouter);
  
  app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`);
  });
}
main();
