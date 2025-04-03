import mongoose from "mongoose";
import Review from "@/models/reviews";
import product from "@/models/product";

export async function addFeaturedProducts() {
  try {
    // Define four featured products
    const featuredProducts = [
      {
        name: "Product 1",
        description: "Description for Product 1",
        price: 100,
        category: "Category 1",
        isFeatured: true,
      },
      {
        name: "Product 2",
        description: "Description for Product 2",
        price: 200,
        category: "Category 2",
        isFeatured: true,
      },
      {
        name: "Product 3",
        description: "Description for Product 3",
        price: 300,
        category: "Category 3",
        isFeatured: true,
      },
      {
        name: "Product 4",
        description: "Description for Product 4",
        price: 400,
        category: "Category 4",
        isFeatured: true,
      },
    ];

    // Insert products into the database
    const createdProducts = await product.insertMany(featuredProducts);

    // Add reviews for each product
    const reviews = createdProducts.map((product) => ({
      productId: product._id,
      userId: new mongoose.Types.ObjectId(), // Replace with actual user IDs
      rating: 5,
      comment: `Great product: ${product.name}`,
    }));

    await Review.insertMany(reviews);

    console.log("Featured products and reviews added successfully!");
  } catch (error) {
    console.error("Error adding featured products and reviews:", error);
  }
}
