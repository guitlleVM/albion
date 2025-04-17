import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-400">Cargando información del jugador...</p>
    </div>
  )
}
