import { AlbionLogo } from "@/components/albion-logo"
import { MarketSearch } from "@/components/market-search"

export default function MarketPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col items-center justify-center py-6">
          <a href="/" className="flex items-center mb-6">
            <AlbionLogo className="w-12 h-12 mr-3" />
            <h1 className="text-2xl font-bold text-amber-500">Albion Online Data</h1>
          </a>
        </header>

        <main className="mt-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-amber-500 mb-6">Precios del Mercado</h2>
            <p className="text-gray-300 mb-6">
              Consulta los precios actuales de objetos en diferentes ciudades del servidor europeo de Albion Online.
            </p>

            <MarketSearch />
          </div>
        </main>
      </div>
    </div>
  )
}
