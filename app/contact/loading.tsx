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
        <p className="text-blue-700">Loading contact information...</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="h-8 bg-blue-100 animate-pulse rounded mb-4 w-1/2" />
          <div className="h-4 bg-blue-100 animate-pulse rounded mb-2 w-full" />
          <div className="h-4 bg-blue-100 animate-pulse rounded mb-8 w-3/4" />

          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4 animate-pulse" />
                <div>
                  <div className="h-5 bg-blue-100 animate-pulse rounded mb-2 w-1/3" />
                  <div className="h-4 bg-blue-100 animate-pulse rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="h-64 bg-blue-100 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  )
}

