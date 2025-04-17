import { AlbionLogo } from "@/components/albion-logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Compass, Users, ShoppingCart, Star, Bell } from "lucide-react"

export default function Home() {
  // Datos de novedades reales
  const news = [
    {
      title: "Nuevas funciones disponibles",
      date: "17/04/2025",
      description: "Hemos añadido comparación de objetos y seguimiento de precios del mercado.",
      type: "update",
    },
    {
      title: "Actualización de la API",
      date: "15/04/2025",
      description: "Mejoras en la velocidad y fiabilidad de los datos del mercado.",
      type: "api",
    },
    {
      title: "Próximamente: Calculadora de recursos",
      date: "12/04/2025",
      description: "Estamos trabajando en una calculadora para optimizar la fabricación de objetos.",
      type: "coming",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col items-center justify-center py-12">
          <AlbionLogo className="w-24 h-24 mb-6" />
          <h1 className="text-4xl font-bold text-amber-500 mb-2">Albion Online Data</h1>
          <p className="text-gray-400 text-center max-w-2xl mb-8">
            Consulta información de jugadores, gremios y precios del mercado en el servidor europeo de Albion Online
          </p>
        </header>

        <main className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/players" className="group">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 group-hover:border-amber-500 transition-colors h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="bg-amber-500/20 p-3 rounded-full mr-4">
                    <Users className="h-6 w-6 text-amber-500" />
                  </div>
                  <h2 className="text-xl font-bold text-amber-500">Búsqueda de Jugadores</h2>
                </div>
                <p className="text-gray-300 mb-4 flex-grow">
                  Consulta estadísticas detalladas de cualquier jugador, incluyendo equipo, fama y más.
                </p>
                <span className="text-amber-400 group-hover:text-amber-300 font-medium flex items-center">
                  Buscar jugadores
                  <svg
                    className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            <Link href="/guilds" className="group">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 group-hover:border-amber-500 transition-colors h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="bg-amber-500/20 p-3 rounded-full mr-4">
                    <Compass className="h-6 w-6 text-amber-500" />
                  </div>
                  <h2 className="text-xl font-bold text-amber-500">Información de Gremios</h2>
                </div>
                <p className="text-gray-300 mb-4 flex-grow">
                  Explora gremios, sus miembros, alianzas y estadísticas de batallas.
                </p>
                <span className="text-amber-400 group-hover:text-amber-300 font-medium flex items-center">
                  Buscar gremios
                  <svg
                    className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            <Link href="/market" className="group">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 group-hover:border-amber-500 transition-colors h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="bg-amber-500/20 p-3 rounded-full mr-4">
                    <ShoppingCart className="h-6 w-6 text-amber-500" />
                  </div>
                  <h2 className="text-xl font-bold text-amber-500">Precios del Mercado</h2>
                </div>
                <p className="text-gray-300 mb-4 flex-grow">
                  Compara precios de objetos en diferentes ciudades para maximizar tus ganancias.
                </p>
                <span className="text-amber-400 group-hover:text-amber-300 font-medium flex items-center">
                  Ver precios
                  <svg
                    className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            <Link href="/items" className="group">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 group-hover:border-amber-500 transition-colors h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="bg-amber-500/20 p-3 rounded-full mr-4">
                    <Star className="h-6 w-6 text-amber-500" />
                  </div>
                  <h2 className="text-xl font-bold text-amber-500">Calculadora de Rentabilidad</h2>
                </div>
                <p className="text-gray-300 mb-4 flex-grow">
                  Calcula la rentabilidad de crafteo, refinado y transporte para maximizar tus ganancias.
                </p>
                <span className="text-amber-400 group-hover:text-amber-300 font-medium flex items-center">
                  Calcular rentabilidad
                  <svg
                    className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            <Link href="/news" className="group">
              <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg p-6 border border-amber-700 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="bg-white/20 p-3 rounded-full mr-4">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Novedades</h2>
                </div>
                <div className="flex-grow space-y-3">
                  {news.map((item, index) => (
                    <div key={index} className="bg-white/10 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-white">{item.title}</h3>
                        <span className="text-xs text-white/70">{item.date}</span>
                      </div>
                      <p className="text-sm text-white/90 mt-1">{item.description}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-4 bg-white/10 border-white/30 text-white hover:bg-white/20">
                  Ver todas las novedades
                </Button>
              </div>
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}
