import { notFound } from "next/navigation"
import { AlbionLogo } from "@/components/albion-logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"

async function getGuildData(name: string) {
  try {
    const encodedName = encodeURIComponent(name)

    // 1) Buscar gremio en servidor Europa (Ámsterdam)
    const searchResponse = await fetch(
      `https://gameinfo-ams.albiononline.com/api/gameinfo/search?q=${encodedName}`,
      { next: { revalidate: 3600 } }
    )
    if (!searchResponse.ok) {
      throw new Error("Failed to fetch guild search data")
    }
    const searchData = await searchResponse.json()
    const guild = searchData.guilds.find(
      (g: any) => g.Name.toLowerCase() === name.toLowerCase()
    )
    if (!guild) {
      return null
    }

    // 2) Obtener detalles del gremio
    const guildResponse = await fetch(
      `https://gameinfo-ams.albiononline.com/api/gameinfo/guilds/${guild.Id}`,
      { next: { revalidate: 3600 } }
    )
    if (!guildResponse.ok) {
      throw new Error("Failed to fetch detailed guild data")
    }
    const guildData = await guildResponse.json()

    // 3) Obtener miembros del gremio
    const membersResponse = await fetch(
      `https://gameinfo-ams.albiononline.com/api/gameinfo/guilds/${guild.Id}/members`,
      { next: { revalidate: 3600 } }
    )
    if (!membersResponse.ok) {
      throw new Error("Failed to fetch guild members")
    }
    const membersData = await membersResponse.json()

    return {
      ...guildData,
      members: membersData,
    }
  } catch (error) {
    console.error("Error fetching EU guild data:", error)
    return null
  }
}

export default async function GuildPage({ params }: { params: { name: string } }) {
  const guildName = decodeURIComponent(params.name)
  const guildData = await getGuildData(guildName)

  if (!guildData) {
    notFound()
  }

  // Valores seguros para evitar undefined
  const killFame = typeof guildData.killFame === "number" ? guildData.killFame : 0
  const deathFame = typeof guildData.deathFame === "number" ? guildData.deathFame : 0

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col items-center justify-center py-6">
          <Link href="/" className="flex items-center mb-6">
            <AlbionLogo className="w-12 h-12 mr-3" />
            <h1 className="text-2xl font-bold text-amber-500">Albion Online Data</h1>
          </Link>
        </header>

        <main className="mt-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center border-4 border-amber-600 overflow-hidden">
                  {guildData.AllianceTag ? (
                    <span className="text-3xl font-bold">{guildData.AllianceTag}</span>
                  ) : (
                    <span className="text-3xl font-bold">{guildData.Name.charAt(0)}</span>
                  )}
                </div>
                <h2 className="text-2xl font-bold mt-3 text-amber-500">{guildData.Name}</h2>
                {guildData.AllianceName && (
                  <div className="mt-1 text-gray-300">
                    <span className="text-sm">Alianza: </span>
                    <span className="text-amber-400">{guildData.AllianceName}</span>
                  </div>
                )}
                <div className="text-sm text-gray-400 mt-1">
                  {guildData.FounderName && `Fundador: ${guildData.FounderName}`}
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Estadísticas</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-400">Miembros</p>
                      <p className="text-xl font-bold text-amber-400">{guildData.members.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Fama PvP</p>
                      <p className="text-xl font-bold text-red-400">{killFame.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Muertes PvP</p>
                      <p className="text-xl font-bold">{deathFame.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Ratio K/D</p>
                      <p className="text-xl font-bold">
                        {(killFame / (deathFame || 1)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Actividad</h3>
                  <p className="text-sm text-gray-300 mb-2">
                    Última actividad: {new Date().toLocaleDateString("es-ES")}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-2 w-full border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-white"
                    asChild
                  >
                    <a
                      href={`https://albiononline.com/en/killboard/guild/${guildData.Id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver en Killboard oficial
                    </a>
                  </Button>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg col-span-1 md:col-span-2">
                  <h3 className="text-lg font-medium mb-4">Miembros principales</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {guildData.members.slice(0, 6).map((member: any) => (
                      <a
                        key={member.Id}
                        href={`/players/${encodeURIComponent(member.Name)}`}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-600"
                      >
                        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold">{member.Name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{member.Name}</p>
                          <p className="text-xs text-gray-400">{member.RoleName || "Miembro"}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                  {guildData.members.length > 6 && (
                    <Button variant="link" className="mt-3 text-amber-400 hover:text-amber-300">
                      Ver todos los miembros ({guildData.members.length})
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
