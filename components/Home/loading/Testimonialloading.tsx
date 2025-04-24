import LoadingSpinner from "../../loading-spinner";
import { Card, CardContent } from "@/components/ui/card";

const TestimonialLoading = () => {
  return (
    <section className="py-20 bg-blue-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
          What Our Customers Say
        </h2>
        <div className="flex justify-center mb-8">
          <LoadingSpinner size={40} />
        </div>
        <p className="text-center text-blue-700 mb-8">
          Loading customer reviews...
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-white border-blue-100 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4 animate-pulse">
                  <div className="h-5 bg-blue-100 w-24 rounded"></div>
                </div>
                <div className="h-24 bg-blue-100 rounded mb-6 animate-pulse"></div>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 animate-pulse mr-4"></div>
                  <div>
                    <div className="h-4 bg-blue-100 rounded w-24 mb-2 animate-pulse"></div>
                    <div className="h-3 bg-blue-100 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialLoading;
