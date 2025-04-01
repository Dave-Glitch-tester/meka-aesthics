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
        <p className="text-blue-700">Loading your cart...</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mb-4 p-4 border border-blue-100 rounded-lg animate-pulse">
              <div className="flex items-center">
                <div className="h-24 w-24 bg-blue-100 rounded" />
                <div className="ml-4 flex-1">
                  <div className="h-6 bg-blue-100 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-blue-100 rounded w-1/4" />
                </div>
                <div className="h-8 w-24 bg-blue-100 rounded" />
              </div>
            </div>
          ))}
        </div>
        <div className="lg:w-1/3">
          <div className="h-64 bg-blue-100 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  )
}

