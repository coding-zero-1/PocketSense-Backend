import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
} from "../controllers/transactionController";

const transactionRouter = Router();

transactionRouter.get("/", authMiddleware, getAllTransactions);
transactionRouter.post("/create", authMiddleware, createTransaction);
transactionRouter.delete("/delete/:id", authMiddleware, deleteTransaction);

export default transactionRouter;
