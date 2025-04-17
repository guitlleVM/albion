import { notFound } from "next/navigation"
import { AlbionLogo } from "@/components/albion-logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Suspense } from "react"
import { Shield, Sword, Award, Clock, Star, ArrowUpRight } from "lucide-react"

async function getPlayerData(name: string) {
  try {
    // Albion Online Data Project API
    const response = await fetch(`https://gameinfo-ams.albiononline.com/api/gameinfo/search?q=${name}`, {
      next: { revalidate: 3600 }, // Revalidar cada hora
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch player data: ${response.status}`)
    }

    const data = await response.json()
    const player = data.players.find((p: any) => p.Name.toLowerCase() === name.toLowerCase())

    if (!player) {
      return null
    }

    // Get detailed player info
    const playerResponse = await fetch(
      `https://gameinfo-ams.albiononline.com/api/gameinfo/players/${player.Id}`,
      {
        next: { revalidate: 3600 },
      },
    )
    if (!playerResponse.ok) {
      throw new Error(`Failed to fetch detailed player data: ${playerResponse.status}`)
    }

    const playerData = await playerResponse.json()

    // Get recent kills
    const killsResponse = await fetch(
      `https://gameinfo-ams.albiononline.com/api/gameinfo/players/${player.Id}/kills`,
      {
        next: { revalidate: 3600 },
      },
    )

    let recentKills = []
    if (killsResponse.ok) {
      const killsData = await killsResponse.json()
      recentKills = killsData.slice(0, 5)
    }

    return {
      ...playerData,
      recentKills,
    }
  } catch (error) {
    console.error("Error fetching player data:", error)
    return null
  }
}

function PlayerSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-700 rounded-full"></div>
          <div className="h-6 bg-gray-700 rounded w-32 mt-3"></div>
          <div className="h-4 bg-gray-700 rounded w-24 mt-2"></div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg h-40"></div>
          <div className="bg-gray-700 p-4 rounded-lg h-40"></div>
          <div className="bg-gray-700 p-4 rounded-lg h-40"></div>
          <div className="bg-gray-700 p-4 rounded-lg h-40"></div>
        </div>
      </div>
    </div>
  )
}

function PlayerContent({ playerData }: { playerData: any }) {
  if (!playerData) {
    notFound()
  }

  const formatDate = (timestamp: string) => {
    if (!timestamp) return "Desconocido"
    try {
      return new Date(timestamp).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (e) {
      return "Fecha inválida"
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center border-4 border-amber-600 relative">
            <span className="text-4xl font-bold">{playerData.Name.charAt(0)}</span>
            {playerData.KillFame > 10000000 && (
              <div className="absolute -top-2 -right-2 bg-amber-500 text-black text-xs font-bold rounded-full p-1 w-8 h-8 flex items-center justify-center">
                <Star className="h-5 w-5" />
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold mt-3 text-amber-500">{playerData.Name}</h2>
          {playerData.GuildName && (
            <div className="mt-1 text-gray-300">
              <span className="text-sm">Gremio: </span>
              <Link
                href={`/guilds/${encodeURIComponent(playerData.GuildName)}`}
                className="text-amber-400 hover:text-amber-300"
              >
                {playerData.GuildName}
              </Link>
            </div>
          )}
          {playerData.AllianceName && <div className="text-sm text-gray-400">Alianza: {playerData.AllianceName}</div>}

          <div className="mt-4 flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-white"
              asChild
            >
              <Link
                href={`https://albiononline.com/en/killboard/player/${playerData.Id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ArrowUpRight className="h-4 w-4 mr-1" />
                Killboard
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <Sword className="h-5 w-5 text-amber-500 mr-2" />
              <h3 className="text-lg font-medium">Estadísticas PvP</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-400">Fama PvP</p>
                <p className="text-xl font-bold text-amber-400">{playerData.KillFame.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Muertes PvP</p>
                <p className="text-xl font-bold text-red-400">{playerData.DeathFame.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Ratio K/D</p>
                <p className="text-xl font-bold">{(playerData.KillFame / (playerData.DeathFame || 1)).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Jugadores eliminados</p>
                <p className="text-xl font-bold">
                  {playerData.KillFame > 0 ? Math.floor(playerData.KillFame / 10000) : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <Clock className="h-5 w-5 text-amber-500 mr-2" />
              <h3 className="text-lg font-medium">Actividad reciente</h3>
            </div>
            <p className="text-sm text-gray-300 mb-2">
              Última actividad: {formatDate(playerData.LifetimeStatistics?.Timestamp || Date.now())}
            </p>

            {playerData.recentKills && playerData.recentKills.length > 0 ? (
              <div className="mt-2">
                <p className="text-sm text-gray-400 mb-1">Eliminaciones recientes:</p>
                <div className="text-sm">
                  {playerData.recentKills.slice(0, 3).map((kill: any, index: number) => (
                    <div key={index} className="text-gray-300 mb-1 truncate">
                      {kill.Victim.Name}
                      <span className="text-gray-400 text-xs ml-1">({formatDate(kill.TimeStamp)})</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 mt-2">No hay eliminaciones recientes</p>
            )}
          </div>

          {playerData.LifetimeStatistics && (
            <>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <Shield className="h-5 w-5 text-amber-500 mr-2" />
                  <h3 className="text-lg font-medium">Recolección</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-400">Fama total</p>
                    <p className="text-xl font-bold text-green-400">
                      {(playerData.LifetimeStatistics.Gathering?.All?.Total || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Recursos recolectados</p>
                    <p className="text-xl font-bold">
                      {Math.floor((playerData.LifetimeStatistics.Gathering?.All?.Total || 0) / 100).toLocaleString()}
                    </p>
                  </div>
                </div>

                {playerData.LifetimeStatistics.Gathering && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {["Fiber", "Hide", "Ore", "Rock", "Wood"].map(
                      (resourceType) =>
                        playerData.LifetimeStatistics.Gathering[resourceType] && (
                          <div key={resourceType} className="bg-gray-600 rounded p-2">
                            <p className="text-xs text-gray-300">{resourceType}</p>
                            <p className="text-sm font-medium">
                              {(playerData.LifetimeStatistics.Gathering[resourceType].Total || 0).toLocaleString()}
                            </p>
                          </div>
                        ),
                    )}
                  </div>
                )}
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <Award className="h-5 w-5 text-amber-500 mr-2" />
                  <h3 className="text-lg font-medium">PvE</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-400">Fama PvE</p>
                    <p className="text-xl font-bold text-blue-400">
                      {(playerData.LifetimeStatistics.PvE?.Total || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Mobs eliminados</p>
                    <p className="text-xl font-bold">
                      {Math.floor((playerData.LifetimeStatistics.PvE?.Total || 0) / 1000).toLocaleString()}
                    </p>
                  </div>
                </div>

                {playerData.LifetimeStatistics.PvE && (
                  <div className="mt-3">
                    <div className="bg-gray-600 rounded p-2 mb-2">
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-300">Progreso PvE</p>
                        <p className="text-xs text-gray-300">
                          {Math.min(100, Math.floor((playerData.LifetimeStatistics.PvE.Total || 0) / 100000))}%
                        </p>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min(100, Math.floor((playerData.LifetimeStatistics.PvE.Total || 0) / 100000))}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default async function PlayerPage({ params }: { params: { name: string } }) {
  const playerName = decodeURIComponent(params.name)
  const playerData = await getPlayerData(playerName)

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex flex-col items-center justify-center py-6">
        <Link href="/" className="flex items-center mb-6">
          <AlbionLogo className="w-12 h-12 mr-3" />
          <h1 className="text-2xl font-bold text-amber-500">Albion Online Data</h1>
        </Link>
      </header>

      <main className="mt-6">
        <Suspense fallback={<PlayerSkeleton />}>
          <PlayerContent playerData={playerData} />
        </Suspense>
      </main>
    </div>
  )
}
