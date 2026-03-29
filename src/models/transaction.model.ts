import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  item: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  type: "buy" | "trade";
  status: "pending" | "completed" | "cancelled";
}

const transactionSchema = new Schema<ITransaction>(
  {
    item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["buy", "trade"], required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema
);