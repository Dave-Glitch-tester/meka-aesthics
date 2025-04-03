import { Schema, models, model, Document } from "mongoose";

export interface IProduct extends Document {
  productName: string;
  description: string;
  featured: boolean;
  price: number;
  quantity: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}
const productSchema: Schema<IProduct> = new Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default models.products || model("products", productSchema);
