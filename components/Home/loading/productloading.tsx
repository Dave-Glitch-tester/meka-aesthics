import LoadingSpinner from "../../loading-spinner";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
export default function ProductLoading() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
          Featured Products
        </h2>
        <div className="flex justify-center mb-8">
          <LoadingSpinner size={40} />
        </div>
        <p className="text-center text-blue-700 mb-8">
          Loading our featured collections...
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="rounded-lg overflow-hidden">
              <div className="h-64 bg-blue-100 animate-pulse" />
              <CardContent className="p-4">
                <div className="h-6 bg-blue-100 animate-pulse rounded mb-2" />
                <div className="h-4 bg-blue-100 animate-pulse rounded w-1/2" />
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <div className="h-6 bg-blue-100 animate-pulse rounded w-1/4" />
                <div className="h-10 bg-blue-100 animate-pulse rounded w-1/3" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
