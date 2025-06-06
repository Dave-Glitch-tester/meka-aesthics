import TestimonialSection from "./testimonial-section";
import type { Review } from "@/types/product";

export default async function fetchTestimonials() {
  let review: Review[];
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reviews?featured=true`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) throw new Error("Failed to fetch testimonials");

    const data = await response.json();
    review = data;

    if (review.length === 0) {
      return (
        <section className="py-20 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
              What Our Customers Say
            </h2>
            <p className="text-center text-blue-700 mb-8">
              No reviews uploaded yet.
            </p>
          </div>
        </section>
      );
    }

    // Get the reviews with the highest ratings
    const topReviews = data
      .sort((a: Review, b: Review) => b.rating - a.rating)
      .slice(0, 6);

    return <TestimonialSection testimonials={topReviews} />;
  } catch (error) {
    console.error("Error fetching testimonials:", error);

    return (
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
            What Our Customers Say
          </h2>
          <p className="text-center text-red-500 mb-8">
            Failed to load testimonials. Please try again later.
          </p>
        </div>
      </section>
    );
  }
}
