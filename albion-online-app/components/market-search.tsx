"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Search, ArrowUpDown, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"

const CITIES = ["Todas las ciudades", "Bridgewatch", "Caerleon", "Fort Sterling", "Lymhurst", "Martlock", "Thetford"]

// Base de datos de objetos para sugerencias
const ITEM_SUGGESTIONS = [
  // Recursos
  { id: "T4_HIDE", name: "Cuero T4" },
  { id: "T5_HIDE", name: "Cuero T5" },
  { id: "T6_HIDE", name: "Cuero T6" },
  { id: "T7_HIDE", name: "Cuero T7" },
  { id: "T8_HIDE", name: "Cuero T8" },
  { id: "T4_FIBER", name: "Fibra T4" },
  { id: "T5_FIBER", name: "Fibra T5" },
  { id: "T6_FIBER", name: "Fibra T6" },
  { id: "T7_FIBER", name: "Fibra T7" },
  { id: "T8_FIBER", name: "Fibra T8" },
  { id: "T4_ORE", name: "Mineral T4" },
  { id: "T5_ORE", name: "Mineral T5" },
  { id: "T6_ORE", name: "Mineral T6" },
  { id: "T7_ORE", name: "Mineral T7" },
  { id: "T8_ORE", name: "Mineral T8" },
  { id: "T4_ROCK", name: "Roca T4" },
  { id: "T5_ROCK", name: "Roca T5" },
  { id: "T6_ROCK", name: "Roca T6" },
  { id: "T7_ROCK", name: "Roca T7" },
  { id: "T8_ROCK", name: "Roca T8" },
  { id: "T4_WOOD", name: "Madera T4" },
  { id: "T5_WOOD", name: "Madera T5" },
  { id: "T6_WOOD", name: "Madera T6" },
  { id: "T7_WOOD", name: "Madera T7" },
  { id: "T8_WOOD", name: "Madera T8" },

  // Armas
  { id: "T4_MAIN_SWORD", name: "Espada T4" },
  { id: "T5_MAIN_SWORD", name: "Espada T5" },
  { id: "T6_MAIN_SWORD", name: "Espada T6" },
  { id: "T7_MAIN_SWORD", name: "Espada T7" },
  { id: "T4_2H_CLAYMORE", name: "Claymore T4" },
  { id: "T5_2H_CLAYMORE", name: "Claymore T5" },
  { id: "T6_2H_CLAYMORE", name: "Claymore T6" },
  { id: "T4_MAIN_SPEAR", name: "Lanza T4" },
  { id: "T5_MAIN_SPEAR", name: "Lanza T5" },
  { id: "T6_MAIN_SPEAR", name: "Lanza T6" },
  { id: "T4_2H_BOW", name: "Arco T4" },
  { id: "T5_2H_BOW", name: "Arco T5" },
  { id: "T6_2H_BOW", name: "Arco T6" },

  // Armaduras
  { id: "T4_HEAD_CLOTH_SET1", name: "Capucha de Estudioso T4" },
  { id: "T5_HEAD_CLOTH_SET1", name: "Capucha de Estudioso T5" },
  { id: "T4_ARMOR_CLOTH_SET1", name: "Túnica de Estudioso T4" },
  { id: "T5_ARMOR_CLOTH_SET1", name: "Túnica de Estudioso T5" },
  { id: "T4_HEAD_LEATHER_SET2", name: "Capucha de Cazador T4" },
  { id: "T5_ARMOR_LEATHER_SET2", name: "Chaqueta de Cazador T5" },
  { id: "T6_ARMOR_LEATHER_SET2", name: "Chaqueta de Cazador T6" },
  { id: "T4_HEAD_PLATE_SET3", name: "Casco de Soldado T4" },
  { id: "T5_ARMOR_PLATE_SET3", name: "Armadura de Soldado T5" },

  // Accesorios
  { id: "T4_BAG", name: "Bolsa T4" },
  { id: "T5_BAG", name: "Bolsa T5" },
  { id: "T6_BAG", name: "Bolsa T6" },
  { id: "T7_BAG", name: "Bolsa T7" },
  { id: "T4_CAPE", name: "Capa T4" },
  { id: "T5_CAPE", name: "Capa T5" },
  { id: "T6_CAPE", name: "Capa T6" },
  { id: "T6_CAPEITEM_FW_BRIDGEWATCH", name: "Capa de Bridgewatch T6" },
  { id: "T7_CAPEITEM_FW_LYMHURST", name: "Capa de Lymhurst T7" },
]

// Categorías para filtrar
const ITEM_CATEGORIES = [
  { id: "all", name: "Todos los objetos" },
  { id: "resources", name: "Recursos" },
  { id: "weapons", name: "Armas" },
  { id: "armor", name: "Armaduras" },
  { id: "accessories", name: "Accesorios" },
]

interface MarketItem {
  item_id: string
  city: string
  quality: number
  sell_price_min: number
  sell_price_min_date: string
  buy_price_max: number
  buy_price_max_date: string
}

export function MarketSearch() {
  const [itemName, setItemName] = useState("")
  const [city, setCity] = useState("Todas las ciudades")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<MarketItem[]>([])
  const [error, setError] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: keyof MarketItem; direction: "asc" | "desc" } | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    // Cargar favoritos del localStorage
    try {
      const savedFavorites = localStorage.getItem("favoriteItems")
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites))
      }
    } catch (e) {
      console.error("Error parsing favorites:", e)
    }
  }, [])

  // Filtrar sugerencias basadas en la búsqueda y categoría
  const filteredSuggestions = useMemo(() => {
    if (!itemName) return []

    const searchLower = itemName.toLowerCase()

    return ITEM_SUGGESTIONS.filter((item) => {
      const matchesSearch = item.id.toLowerCase().includes(searchLower) || item.name.toLowerCase().includes(searchLower)

      const matchesCategory =
        selectedCategory === "all" ||
        (selectedCategory === "resources" &&
          (item.id.includes("_HIDE") ||
            item.id.includes("_FIBER") ||
            item.id.includes("_ORE") ||
            item.id.includes("_ROCK") ||
            item.id.includes("_WOOD"))) ||
        (selectedCategory === "weapons" &&
          (item.id.includes("_SWORD") ||
            item.id.includes("_SPEAR") ||
            item.id.includes("_BOW") ||
            item.id.includes("_STAFF"))) ||
        (selectedCategory === "armor" &&
          (item.id.includes("_CLOTH") || item.id.includes("_LEATHER") || item.id.includes("_PLATE"))) ||
        (selectedCategory === "accessories" && (item.id.includes("_BAG") || item.id.includes("_CAPE")))

      return matchesSearch && matchesCategory
    }).slice(0, 10) // Limitar a 10 sugerencias
  }, [itemName, selectedCategory])

  const toggleFavorite = (itemId: string) => {
    try {
      const newFavorites = favorites.includes(itemId) ? favorites.filter((id) => id !== itemId) : [...favorites, itemId]
      setFavorites(newFavorites)
      localStorage.setItem("favoriteItems", JSON.stringify(newFavorites))

      toast({
        title: favorites.includes(itemId) ? "Eliminado de favoritos" : "Añadido a favoritos",
        description: `El objeto ${itemId} ha sido ${favorites.includes(itemId) ? "eliminado de" : "añadido a"} tus favoritos.`,
        variant: favorites.includes(itemId) ? "destructive" : "default",
      })
    } catch (e) {
      console.error("Error toggling favorite:", e)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!itemName.trim()) return

    setIsLoading(true)
    setError("")

    try {
      // Albion Online Data Project API - Servidor Europeo
      const baseUrl = "https://europe.albion-online-data.com/api/v2/stats/prices"
      const cityParam = city !== "Todas las ciudades" ? `&locations=${city}` : ""
      const response = await fetch(`${baseUrl}/${itemName}?qualities=1,2,3,4,5${cityParam}`)

      if (!response.ok) {
        throw new Error(`Error al obtener datos del mercado: ${response.status}`)
      }

      const data = await response.json()

      if (data.length === 0) {
        setError("No se encontraron resultados. Intenta con otro nombre de objeto o verifica el formato (ej: T4_BAG).")
        setResults([])
      } else {
        // Filtrar resultados con precios válidos
        const validResults = data.filter((item: MarketItem) => item.sell_price_min > 0 || item.buy_price_max > 0)

        if (validResults.length === 0) {
          setError("Se encontró el objeto, pero no hay datos de precios disponibles actualmente.")
          setResults([])
        } else {
          setResults(validResults)

          try {
            // Guardar en historial de búsquedas
            const searchHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]")
            const newHistory = [itemName, ...searchHistory.filter((item: string) => item !== itemName)].slice(0, 10)
            localStorage.setItem("searchHistory", JSON.stringify(newHistory))
          } catch (e) {
            console.error("Error saving search history:", e)
          }
        }
      }
    } catch (error) {
      console.error("Error fetching market data:", error)
      setError("Error al obtener datos del mercado. Verifica tu conexión e intenta de nuevo más tarde.")
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const sortData = (key: keyof MarketItem) => {
    let direction: "asc" | "desc" = "asc"

    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }

    setSortConfig({ key, direction })
  }

  const getSortedData = () => {
    if (!sortConfig) return results

    return [...results].sort((a, b) => {
      if (a[sortConfig.key] === null) return 1
      if (b[sortConfig.key] === null) return -1

      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })
  }

  const getQualityColor = (quality: number) => {
    switch (quality) {
      case 1:
        return "text-gray-200" // Normal
      case 2:
        return "text-green-400" // Good
      case 3:
        return "text-blue-400" // Outstanding
      case 4:
        return "text-purple-400" // Excellent
      case 5:
        return "text-amber-400" // Masterpiece
      default:
        return "text-gray-200"
    }
  }

  const getQualityName = (quality: number) => {
    switch (quality) {
      case 1:
        return "Normal"
      case 2:
        return "Bueno"
      case 3:
        return "Excepcional"
      case 4:
        return "Excelente"
      case 5:
        return "Obra Maestra"
      default:
        return "Desconocido"
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"

    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch (e) {
      return "Fecha inválida"
    }
  }

  const selectSuggestion = (suggestion: string) => {
    setItemName(suggestion)
    setShowSuggestions(false)
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[180px] bg-gray-700 border-gray-600">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600">
            {ITEM_CATEGORIES.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Nombre del objeto (ej: T4_BAG, T5_HIDE)"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full bg-gray-700 border-gray-600 pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />

          {itemName && (
            <button
              type="button"
              onClick={() => setItemName("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
              <ul>
                {filteredSuggestions.map((suggestion) => (
                  <li
                    key={suggestion.id}
                    className="p-2 hover:bg-gray-700 cursor-pointer flex items-center justify-between"
                    onClick={() => selectSuggestion(suggestion.id)}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center mr-2">
                        <span className="text-xs font-bold">{suggestion.id.split("_")[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-200">{suggestion.name}</p>
                        <p className="text-xs text-gray-400">{suggestion.id}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-amber-400 hover:text-amber-300"
                      onClick={(e) => {
                        e.stopPropagation()
                        selectSuggestion(suggestion.id)
                      }}
                    >
                      Seleccionar
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="w-full sm:w-[180px] bg-gray-700 border-gray-600">
            <SelectValue placeholder="Ciudad" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600">
            {CITIES.map((cityName) => (
              <SelectItem key={cityName} value={cityName}>
                {cityName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button type="submit" className="bg-amber-600 hover:bg-amber-700" disabled={isLoading}>
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Buscando...
            </>
          ) : (
            "Buscar"
          )}
        </Button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-md text-red-200 flex items-start">
          <div className="bg-red-800 p-1 rounded-full mr-2 mt-0.5">
            <Info className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
            <p className="text-sm mt-2">Sugerencia: Asegúrate de usar el formato correcto (ej: T4_BAG, T5_HIDE)</p>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center my-12">
          <LoadingSpinner size="lg" />
          <span className="ml-4 text-gray-300">Consultando precios del mercado...</span>
        </div>
      )}

      {results.length > 0 && !isLoading && (
        <div className="mt-6 overflow-x-auto">
          <TooltipProvider>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-3 text-left">Objeto</th>
                  <th className="p-3 text-left">Ciudad</th>
                  <th className="p-3 text-left">Calidad</th>
                  <th className="p-3 text-right cursor-pointer" onClick={() => sortData("sell_price_min")}>
                    <div className="flex items-center justify-end">
                      Precio de venta
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="p-3 text-right cursor-pointer" onClick={() => sortData("buy_price_max")}>
                    <div className="flex items-center justify-end">
                      Precio de compra
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="p-3 text-right">Actualizado</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {getSortedData().map((item, index) => (
                  <tr
                    key={`${item.item_id}-${item.city}-${item.quality}-${index}`}
                    className="border-t border-gray-700 hover:bg-gray-700/50"
                  >
                    <td className="p-3">
                      <div className="flex items-center">
                        <span className="font-medium">{item.item_id}</span>
                      </div>
                    </td>
                    <td className="p-3">{item.city || "N/A"}</td>
                    <td className={`p-3 ${getQualityColor(item.quality)}`}>{getQualityName(item.quality)}</td>
                    <td className="p-3 text-right">
                      {item.sell_price_min ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="font-medium">{item.sell_price_min.toLocaleString()} plata</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Precio mínimo de venta</p>
                            <p className="text-xs text-gray-400">Actualizado: {formatDate(item.sell_price_min_date)}</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {item.buy_price_max ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="font-medium">{item.buy_price_max.toLocaleString()} plata</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Precio máximo de compra</p>
                            <p className="text-xs text-gray-400">Actualizado: {formatDate(item.buy_price_max_date)}</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="p-3 text-right text-sm text-gray-400">
                      {formatDate(item.sell_price_min_date || item.buy_price_max_date)}
                    </td>
                    <td className="p-3 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(item.item_id)}
                        className={favorites.includes(item.item_id) ? "text-amber-400" : "text-gray-400"}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill={favorites.includes(item.item_id) ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TooltipProvider>
        </div>
      )}

      {!isLoading && results.length === 0 && !error && (
        <div className="mt-8 p-6 bg-gray-700 rounded-lg text-center">
          <h3 className="text-lg font-medium mb-2">Ingresa un ID de objeto para ver sus precios</h3>
          <p className="text-gray-300">Utiliza el formato correcto para buscar (ej: T4_BAG, T5_HIDE, T6_MAIN_SPEAR)</p>
        </div>
      )}
    </div>
  )
}
