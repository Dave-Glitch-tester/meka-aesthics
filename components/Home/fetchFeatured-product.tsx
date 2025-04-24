import FeaturedProducts from "./featured-products";
import type { Product } from "@/types/product";

let products: Product[] = [];
export default async function fetchFeaturedProducts() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products?featured=true`,
      {
        next: { revalidate: 60 },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch products");
    const data = await response.json();
    products = data.slice(0, 4);

    if (products.length === 0) {
      return (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
              Featured Products
            </h2>
            <p className="text-center text-blue-700 mb-8">
              No featured products available at the moment.
            </p>
          </div>
        </section>
      );
    }
    return <FeaturedProducts products={products} />;
  } catch (error) {
    console.error("Error fetching products:", error);

    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
            Featured Products
          </h2>
          <p className="text-center text-blue-700 mb-8">
            Failed to load featured products. Please try again later.
          </p>
        </div>
      </section>
    );
  }
}
