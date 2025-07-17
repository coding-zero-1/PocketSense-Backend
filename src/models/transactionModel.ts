import mongoose, { Schema } from "mongoose";

const TransactionSchema = new Schema({
  date: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: Schema.ObjectId,
    ref: "users",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    maxLength: [100, "max length is 100 characters"],
    trim: true,
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },
  category: {
    type: String,
    trim: true,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    trim: true,
  },
});

const TransactionModel = mongoose.model("transaction", TransactionSchema);

export default TransactionModel;
