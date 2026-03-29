import mongoose, { Schema, Document } from "mongoose";

export interface IItem extends Document {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  seller: mongoose.Types.ObjectId;
  createdAt: Date;
  isSold: boolean;
  isDeleted: boolean;
  createdBy: mongoose.Types.ObjectId;
  image: string;
}

const itemSchema = new Schema<IItem>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
    category: { type: String, index: true },
    condition: { type: String },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isSold: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IItem>("Item", itemSchema);