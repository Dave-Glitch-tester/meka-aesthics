import { Schema, models, model, Document, Types } from "mongoose";
import { IProduct } from "./product";
import { IUser } from "./users";

// Interface for a cart item with a referenced product
interface ICartItem extends Document {
  product: Types.ObjectId; // Reference to the Product model
  quantity: number;
  userId: Types.ObjectId; // Reference to the User model
}

// Interface for a cart item with a populated product
interface ICartItemPopulated extends Document {
  product: IProduct; // Populated product details
  quantity: number;
  userId: Types.ObjectId;
}

const cartSchema = new Schema(
  {
    product: {
      type: Types.ObjectId,
      ref: "Products", // Reference to the Product model
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    userId: {
      type: Types.ObjectId,
      ref: "Users", // Reference to the User model
      required: true,
    },
  },
  { timestamps: true }
);

// Add a compound index to prevent duplicate cart items for the same user
cartSchema.index({ userId: 1, product: 1 }, { unique: true });

export default models.Cart || model("Cart", cartSchema);
export type { ICartItem, ICartItemPopulated };
