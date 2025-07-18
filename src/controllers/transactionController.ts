import { Request, Response } from "express";
import TransactionModel from "../models/transactionModel";
import UserModel from "../models/userModel";
import { z } from "zod";

const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const clerkId = req.clerkId;
    const user = await UserModel.findOne({ clerkId: clerkId });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }
    const transactions = await TransactionModel.find({ user: user._id });
    if (transactions.length === 0) {
      res.status(200).json({
        success: true,
        message: "You don't have any transactions right now!",
        data: [],
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Transactions retrieved successfully!",
      data: transactions,
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "server error please try again later!",
    });
    return;
  }
};

const createTransaction = async (req: Request, res: Response) => {
  try {
    const clerkId = req.clerkId;
    const requiredBody = z.object({
      title: z.string().max(30).min(1),
      description: z.string().max(60).min(0),
      category: z.string().max(30).min(1),
      type: z.enum(["income", "expense"]),
      amount: z.number(),
    });
    const parsedBody = z.safeParse(requiredBody, req.body);
    if (!parsedBody.success) {
      res.status(400).json({
        success: false,
        message: "Incorrect request body",
        data: parsedBody.error.issues,
      });
      return;
    }
    const { title, description, category, type, amount } = parsedBody.data;
    const user = await UserModel.findOne({ clerkId: clerkId });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User doesn't exist",
      });
      return;
    }
    await TransactionModel.create({
      user: user._id,
      amount: amount,
      type: type,
      category: category,
      description: description,
      title: title,
    });
    res.status(201).json({
      success: true,
      message: "Transaction added successfully!",
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "server error please try again later!",
    });
    return;
  }
};

const deleteTransaction = async (req: Request, res: Response) => {
  const transactionId = req.params.id;
  try {
    if (!transactionId) {
      res.status(400).json({
        success: false,
        message: "Please provide a valid transaction id",
      });
      return;
    }
    const deletedTransaction = await TransactionModel.findOneAndDelete({
      _id: transactionId,
    });
    if (!deletedTransaction) {
      res.status(404).json({
        success: false,
        message: "transaction not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully!",
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "server error please try again later!",
    });
    return;
  }
};

export { getAllTransactions, createTransaction, deleteTransaction };
