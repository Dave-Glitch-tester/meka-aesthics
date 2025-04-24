import mongoose from "mongoose";

export interface Product {
  _id: string;
  productName: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  quantity: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface cartItem {
  _id: string;
  productId: mongoose.ObjectId;
}

export interface Review {
  _id: string;
  productId: string;
  productName: string;
  userId: string;
  name: string;
  role: string;
  rating: number;
  title: string;
  comment: string;
  userRole: string;
  createdAt: string;
  avatar: string;
}
// this has not been added yet
export interface Users {}
