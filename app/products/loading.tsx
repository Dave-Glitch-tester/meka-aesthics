import LoadingSpinner from "@/components/loading-spinner";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">
          Meka<span className="text-blue-600">Aesthetics</span>
        </h1>
        <div className="flex justify-center mb-4">
          <LoadingSpinner size={40} />
        </div>
        <p className="text-blue-700">Loading our beautiful collections...</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="rounded-lg overflow-hidden border border-blue-100"
          >
            <div className="h-64 bg-blue-100 animate-pulse" />
            <div className="p-4">
              <div className="h-6 bg-blue-100 animate-pulse rounded mb-2" />
              <div className="h-4 bg-blue-100 animate-pulse rounded w-1/2 mb-4" />
              <div className="flex justify-between">
                <div className="h-6 bg-blue-100 animate-pulse rounded w-1/4" />
                <div className="h-10 bg-blue-100 animate-pulse rounded w-1/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
