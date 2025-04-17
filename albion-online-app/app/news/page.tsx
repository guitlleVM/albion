import { AlbionLogo } from "@/components/albion-logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Bell, Calendar, ArrowRight, Info, Settings, Star } from "lucide-react"

export default function NewsPage() {
  // Datos de novedades y actualizaciones
  const news = [
    {
      id: 1,
      title: "Comparador de objetos ya disponible",
      date: "17/04/2025",
      description:
        "Hemos lanzado el nuevo comparador de objetos que te permite analizar las estadísticas de diferentes armas, armaduras y accesorios para optimizar tu build en Albion Online.",
      category: "feature",
      icon: Star,
    },
    {
      id: 2,
      title: "Mejoras en la API de mercado",
      date: "15/04/2025",
      description:
        "Hemos optimizado nuestras conexiones con la API de Albion Online para ofrecer datos de precios más precisos y actualizados. Ahora las consultas son un 40% más rápidas.",
      category: "technical",
      icon: Settings,
    },
    {
      id: 3,
      title: "Próximamente: Calculadora de recursos",
      date: "12/04/2025",
      description:
        "Estamos trabajando en una calculadora que te ayudará a determinar los materiales necesarios y el costo total para fabricar cualquier objeto en el juego.",
      category: "coming",
      icon: Calendar,
    },
    {
      id: 4,
      title: "Historial de precios con gráficos",
      date: "10/04/2025",
      description:
        "Ahora puedes visualizar la evolución de precios de cualquier objeto en el mercado mediante gráficos interactivos que muestran las tendencias de las últimas semanas.",
      category: "feature",
      icon: Star,
    },
    {
      id: 5,
      title: "Guía para nuevos usuarios",
      date: "05/04/2025",
      description:
        "Hemos publicado una guía completa que explica cómo utilizar todas las funciones de Albion Online Data para maximizar tu experiencia en el juego.",
      category: "guide",
      icon: Info,
    },
    {
      id: 6,
      title: "Sistema de favoritos",
      date: "01/04/2025",
      description:
        "Ahora puedes guardar tus objetos, jugadores y gremios favoritos para acceder rápidamente a ellos desde cualquier página de la aplicación.",
      category: "feature",
      icon: Star,
    },
  ]

  // Categorías para filtrar
  const categories = [
    { id: "all", name: "Todas" },
    { id: "feature", name: "Nuevas funciones" },
    { id: "technical", name: "Mejoras técnicas" },
    { id: "coming", name: "Próximamente" },
    { id: "guide", name: "Guías" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex flex-col items-center justify-center py-6">
        <Link href="/" className="flex items-center mb-6">
          <AlbionLogo className="w-12 h-12 mr-3" />
          <h1 className="text-2xl font-bold text-amber-500">Albion Online Data</h1>
        </Link>
        <h2 className="text-3xl font-bold text-white mb-4">Novedades y Actualizaciones</h2>
        <p className="text-gray-400 text-center max-w-2xl mb-8">
          Mantente al día con las últimas mejoras y funcionalidades de nuestra aplicación.
        </p>
      </header>

      <main>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center mb-6">
            <div className="bg-amber-500/20 p-3 rounded-full mr-4">
              <Bell className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-amber-500">Últimas Actualizaciones</h3>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Button key={category.id} variant="outline" size="sm" className="rounded-full">
                {category.name}
              </Button>
            ))}
          </div>

          <div className="space-y-6">
            {news.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.id} className="bg-gray-700 rounded-lg p-5 border border-gray-600">
                  <div className="flex items-start">
                    <div className="bg-amber-500/20 p-2 rounded-full mr-3 mt-1">
                      <Icon className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-bold text-white">{item.title}</h4>
                        <span className="text-sm text-gray-400">{item.date}</span>
                      </div>
                      <p className="text-gray-300 mb-4">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            item.category === "feature"
                              ? "bg-green-900/50 text-green-400"
                              : item.category === "technical"
                                ? "bg-blue-900/50 text-blue-400"
                                : item.category === "coming"
                                  ? "bg-amber-900/50 text-amber-400"
                                  : "bg-purple-900/50 text-purple-400"
                          }`}
                        >
                          {categories.find((cat) => cat.id === item.category)?.name ||
                            categories.find((cat) => cat.id === "all")?.name}
                        </span>
                        {item.category !== "coming" && (
                          <Button variant="ghost" size="sm" className="text-amber-400 hover:text-amber-300">
                            <ArrowRight className="h-4 w-4 mr-1" />
                            Más detalles
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 flex justify-center">
            <Button variant="outline" className="border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-white">
              Cargar más actualizaciones
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
