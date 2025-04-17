"use client"

import type React from "react"

import { AlbionLogo } from "@/components/albion-logo"
import Link from "next/link"
import { Users, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function PlayersPage() {
  // Lista de jugadores populares para ejemplos
  const popularPlayers = ["Syndic", "Derrick", "Mojo", "Lewpac", "Shozen", "Equart", "Sohrab", "Elevate"]

  // Cliente-side búsqueda
  const PlayerSearch = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault()
      if (searchQuery.trim()) {
        router.push(`/players/${encodeURIComponent(searchQuery)}`)
      }
    }

    return (
      <form onSubmit={handleSearch} className="w-full max-w-md mx-auto mb-8">
        <div className="relative flex items-center">
          <Input
            type="text"
            placeholder="Buscar jugador por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 bg-gray-700 border-gray-600"
          />
          <Button type="submit" size="icon" className="absolute right-0 bg-amber-600 hover:bg-amber-700 rounded-l-none">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex flex-col items-center justify-center py-6">
        <Link href="/" className="flex items-center mb-6">
          <AlbionLogo className="w-12 h-12 mr-3" />
          <h1 className="text-2xl font-bold text-amber-500">Albion Online Data</h1>
        </Link>
        <h2 className="text-3xl font-bold text-white mb-4">Búsqueda de Jugadores</h2>
        <p className="text-gray-400 text-center max-w-2xl mb-8">
          Consulta estadísticas detalladas de cualquier jugador, incluyendo equipo, fama y más.
        </p>

        {/* Buscador específico para jugadores */}
        <PlayerSearch />
      </header>

      <main>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center mb-6">
            <div className="bg-amber-500/20 p-3 rounded-full mr-4">
              <Users className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-amber-500">Jugadores Populares</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularPlayers.map((player) => (
              <Link key={player} href={`/players/${player}`}>
                <div className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-colors flex items-center">
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-lg font-bold">{player.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{player}</p>
                    <p className="text-xs text-gray-400">Ver perfil</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">¿No encuentras a un jugador?</h3>
            <p className="text-gray-300 mb-4">Si no puedes encontrar a un jugador, puede que:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>El nombre esté mal escrito</li>
              <li>El jugador no haya estado activo recientemente</li>
              <li>La API de Albion Online esté experimentando problemas</li>
            </ul>
            <p className="text-gray-300">Intenta buscar con el nombre exacto, respetando mayúsculas y minúsculas.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
