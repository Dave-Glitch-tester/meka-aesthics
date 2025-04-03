import { Schema, model, models, Types } from "mongoose";

const wishlistSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "Users",
      required: true,
    },
    productId: {
      type: Types.ObjectId,
      ref: "product",
      required: true,
    },
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default models.Wishlist || model("Wishlist", wishlistSchema);
