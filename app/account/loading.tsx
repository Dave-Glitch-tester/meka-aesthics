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
        <p className="text-blue-700">Loading your account information...</p>
      </div>
    </div>
  )
}

