"use client"

import type React from "react"

import { AlbionLogo } from "@/components/albion-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Compass, Users, Shield, Award, Search } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function GuildsPage() {
  // Lista de gremios populares para ejemplos
  const popularGuilds = [
    {
      name: "Blue Army",
      members: 300,
      alliance: "SQUAD",
      fame: 25000000000,
    },
    {
      name: "Conflict",
      members: 250,
      alliance: "POE",
      fame: 18000000000,
    },
    {
      name: "Elevate",
      members: 280,
      alliance: "SURF",
      fame: 22000000000,
    },
    {
      name: "Money Guild",
      members: 320,
      alliance: "ARCH",
      fame: 30000000000,
    },
  ]

  // Cliente-side búsqueda
  const GuildSearch = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault()
      if (searchQuery.trim()) {
        router.push(`/guilds/${encodeURIComponent(searchQuery)}`)
      }
    }

    return (
      <form onSubmit={handleSearch} className="w-full max-w-md mx-auto mb-8">
        <div className="relative flex items-center">
          <Input
            type="text"
            placeholder="Buscar gremio por nombre..."
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
        <h2 className="text-3xl font-bold text-white mb-4">Información de Gremios</h2>
        <p className="text-gray-400 text-center max-w-2xl mb-8">
          Explora gremios, sus miembros, alianzas y estadísticas de batallas.
        </p>

        {/* Buscador específico para gremios */}
        <GuildSearch />
      </header>

      <main>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center mb-6">
            <div className="bg-amber-500/20 p-3 rounded-full mr-4">
              <Compass className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-amber-500">Gremios Destacados</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {popularGuilds.map((guild) => (
              <Link
                key={guild.name}
                href={`/guilds/${encodeURIComponent(guild.name)}`}
                className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 transition-colors"
              >
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-lg font-bold">{guild.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{guild.name}</h4>
                    <p className="text-sm text-gray-400">Alianza: {guild.alliance}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-amber-400 mr-2" />
                    <span className="text-gray-300">{guild.members} miembros</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 text-amber-400 mr-2" />
                    <span className="text-gray-300">{(guild.fame / 1000000000).toFixed(1)}B fama</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="bg-gray-700 p-6 rounded-lg">
            <h4 className="text-lg font-medium text-white mb-4 flex items-center">
              <Shield className="h-5 w-5 text-amber-500 mr-2" />
              Alianzas Principales
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {["ARCH", "POE", "SURF", "SQUAD", "CIR", "CLAP"].map((alliance) => (
                <div key={alliance} className="bg-gray-600 rounded-lg p-3 text-center">
                  <h5 className="font-bold text-amber-400 text-lg">{alliance}</h5>
                  <p className="text-sm text-gray-300">Ver gremios</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <p className="text-gray-300 mb-4">
                Las alianzas son agrupaciones de gremios que trabajan juntos para controlar territorios y recursos en
                Albion Online.
              </p>
              <Button className="bg-amber-600 hover:bg-amber-700">Ver todas las alianzas</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
