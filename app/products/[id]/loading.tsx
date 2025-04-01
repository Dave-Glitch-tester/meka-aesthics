import LoadingSpinner from "@/components/loading-spinner"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">
          Meka<span className="text-blue-600">Aesthetics</span>
        </h1>
        <div className="flex justify-center mb-4">
          <LoadingSpinner size={40} />
        </div>
        <p className="text-blue-700">Loading product details...</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <div className="h-96 bg-blue-100 animate-pulse rounded-lg" />
          <div className="flex gap-4 mt-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 w-20 bg-blue-100 animate-pulse rounded" />
            ))}
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="h-8 bg-blue-100 animate-pulse rounded mb-4 w-3/4" />
          <div className="h-6 bg-blue-100 animate-pulse rounded mb-4 w-1/4" />
          <div className="h-4 bg-blue-100 animate-pulse rounded mb-6 w-full" />
          <div className="h-4 bg-blue-100 animate-pulse rounded mb-2 w-full" />
          <div className="h-4 bg-blue-100 animate-pulse rounded mb-2 w-full" />
          <div className="h-4 bg-blue-100 animate-pulse rounded mb-8 w-3/4" />
          <div className="h-12 bg-blue-100 animate-pulse rounded mb-4 w-full" />
          <div className="h-12 bg-blue-100 animate-pulse rounded w-full" />
        </div>
      </div>
    </div>
  )
}

