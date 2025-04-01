import LoadingSpinner from "./loading-spinner"

interface PageLoadingProps {
  message?: string
}

export default function PageLoading({ message = "Loading..." }: PageLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-3xl font-bold text-blue-900 mb-4">
        Meka<span className="text-blue-600">Aesthetics</span>
      </h1>
      <div className="flex justify-center mb-4">
        <LoadingSpinner size={40} />
      </div>
      <p className="text-blue-700">{message}</p>
    </div>
  )
}

