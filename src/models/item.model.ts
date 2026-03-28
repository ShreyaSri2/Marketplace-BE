import mongoose, { Schema, Document } from "mongoose";

export interface IItem extends Document {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  seller: mongoose.Types.ObjectId;
  createdAt: Date;
}

const itemSchema = new Schema<IItem>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, index: true },
    condition: { type: String },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IItem>("Item", itemSchema);