import LoadingSpinner from "@/components/loading-spinner"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">
          Meka<span className="text-blue-600">Aesthetics</span>
        </h1>
        <div className="flex justify-center mb-4">
          <LoadingSpinner size={40} />
        </div>
        <p className="text-blue-700">Setting up your account...</p>
      </div>
    </div>
  )
}

