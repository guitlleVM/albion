import Link from "next/link"
import { AlbionLogo } from "@/components/albion-logo"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <AlbionLogo className="w-24 h-24 mb-6" />
      <h1 className="text-4xl font-bold text-amber-500 mb-2">404 - No encontrado</h1>
      <p className="text-gray-400 text-center max-w-md mb-8">
        Lo sentimos, no pudimos encontrar la página o el recurso que estás buscando.
      </p>
      <Button asChild className="bg-amber-600 hover:bg-amber-700">
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  )
}
