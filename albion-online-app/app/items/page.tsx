"use client"

import { useState, useMemo } from "react"
import { AlbionLogo } from "@/components/albion-logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calculator, ArrowDown, RefreshCw, Percent } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Tipos para los cálculos
interface MaterialCost {
  name: string
  id: string
  quantity: number
  pricePerUnit: number
  totalCost: number
}

interface CraftingCalculation {
  itemName: string
  itemId: string
  craftingFee: number
  returnRate: number
  sellPrice: number
  totalCost: number
  profit: number
  profitPercentage: number
  materials: MaterialCost[]
}

interface RefiningCalculation {
  resourceName: string
  resourceId: string
  inputResource: MaterialCost
  outputQuantity: number
  refiningFee: number
  sellPrice: number
  totalCost: number
  profit: number
  profitPercentage: number
}

interface TransportCalculation {
  itemName: string
  itemId: string
  buyCity: string
  sellCity: string
  buyPrice: number
  sellPrice: number
  quantity: number
  transportCost: number
  totalCost: number
  profit: number
  profitPercentage: number
}

// Ciudades para transporte
const CITIES = ["Bridgewatch", "Caerleon", "Fort Sterling", "Lymhurst", "Martlock", "Thetford"]

// Datos de ejemplo para materiales
const MATERIALS = [
  { id: "T4_HIDE", name: "Cuero T4", price: 120 },
  { id: "T5_HIDE", name: "Cuero T5", price: 250 },
  { id: "T6_HIDE", name: "Cuero T6", price: 500 },
  { id: "T4_FIBER", name: "Fibra T4", price: 110 },
  { id: "T5_FIBER", name: "Fibra T5", price: 230 },
  { id: "T6_FIBER", name: "Fibra T6", price: 480 },
  { id: "T4_ORE", name: "Mineral T4", price: 130 },
  { id: "T5_ORE", name: "Mineral T5", price: 260 },
  { id: "T6_ORE", name: "Mineral T6", price: 520 },
  { id: "T4_WOOD", name: "Madera T4", price: 100 },
  { id: "T5_WOOD", name: "Madera T5", price: 220 },
  { id: "T6_WOOD", name: "Madera T6", price: 450 },
  { id: "T4_ROCK", name: "Roca T4", price: 90 },
  { id: "T5_ROCK", name: "Roca T5", price: 200 },
  { id: "T6_ROCK", name: "Roca T6", price: 420 },
  { id: "T4_LEATHER", name: "Cuero Refinado T4", price: 350 },
  { id: "T5_LEATHER", name: "Cuero Refinado T5", price: 700 },
  { id: "T6_LEATHER", name: "Cuero Refinado T6", price: 1400 },
  { id: "T4_CLOTH", name: "Tela T4", price: 320 },
  { id: "T5_CLOTH", name: "Tela T5", price: 650 },
  { id: "T6_CLOTH", name: "Tela T6", price: 1300 },
  { id: "T4_METALBAR", name: "Lingote T4", price: 380 },
  { id: "T5_METALBAR", name: "Lingote T5", price: 750 },
  { id: "T6_METALBAR", name: "Lingote T6", price: 1500 },
  { id: "T4_PLANKS", name: "Tablones T4", price: 300 },
  { id: "T5_PLANKS", name: "Tablones T5", price: 600 },
  { id: "T6_PLANKS", name: "Tablones T6", price: 1200 },
  { id: "T4_STONEBLOCK", name: "Bloques de Piedra T4", price: 280 },
  { id: "T5_STONEBLOCK", name: "Bloques de Piedra T5", price: 550 },
  { id: "T6_STONEBLOCK", name: "Bloques de Piedra T6", price: 1100 },
]

// Datos de ejemplo para objetos craftables
const CRAFTABLE_ITEMS = [
  {
    id: "T4_BAG",
    name: "Bolsa T4",
    price: 2000,
    materials: [
      { id: "T4_LEATHER", quantity: 8 },
      { id: "T4_CLOTH", quantity: 4 },
    ],
  },
  {
    id: "T5_BAG",
    name: "Bolsa T5",
    price: 5000,
    materials: [
      { id: "T5_LEATHER", quantity: 12 },
      { id: "T5_CLOTH", quantity: 6 },
    ],
  },
  {
    id: "T4_CAPE",
    name: "Capa T4",
    price: 1800,
    materials: [
      { id: "T4_CLOTH", quantity: 8 },
      { id: "T4_LEATHER", quantity: 4 },
    ],
  },
  {
    id: "T5_CAPE",
    name: "Capa T5",
    price: 4500,
    materials: [
      { id: "T5_CLOTH", quantity: 12 },
      { id: "T5_LEATHER", quantity: 6 },
    ],
  },
  {
    id: "T4_HEAD_CLOTH_SET1",
    name: "Capucha de Estudioso T4",
    price: 3000,
    materials: [{ id: "T4_CLOTH", quantity: 16 }],
  },
  {
    id: "T5_HEAD_CLOTH_SET1",
    name: "Capucha de Estudioso T5",
    price: 7000,
    materials: [{ id: "T5_CLOTH", quantity: 24 }],
  },
  {
    id: "T4_ARMOR_PLATE_SET3",
    name: "Armadura de Soldado T4",
    price: 4000,
    materials: [{ id: "T4_METALBAR", quantity: 24 }],
  },
  {
    id: "T5_ARMOR_PLATE_SET3",
    name: "Armadura de Soldado T5",
    price: 9000,
    materials: [{ id: "T5_METALBAR", quantity: 32 }],
  },
  {
    id: "T4_2H_BOW",
    name: "Arco T4",
    price: 3500,
    materials: [{ id: "T4_PLANKS", quantity: 20 }],
  },
  {
    id: "T5_2H_BOW",
    name: "Arco T5",
    price: 8000,
    materials: [{ id: "T5_PLANKS", quantity: 28 }],
  },
]

// Datos de ejemplo para refinado
const REFINING_RECIPES = [
  {
    inputId: "T4_HIDE",
    outputId: "T4_LEATHER",
    outputQuantity: 1,
    inputQuantity: 2,
  },
  {
    inputId: "T5_HIDE",
    outputId: "T5_LEATHER",
    outputQuantity: 1,
    inputQuantity: 3,
  },
  {
    inputId: "T6_HIDE",
    outputId: "T6_LEATHER",
    outputQuantity: 1,
    inputQuantity: 4,
  },
  {
    inputId: "T4_FIBER",
    outputId: "T4_CLOTH",
    outputQuantity: 1,
    inputQuantity: 2,
  },
  {
    inputId: "T5_FIBER",
    outputId: "T5_CLOTH",
    outputQuantity: 1,
    inputQuantity: 3,
  },
  {
    inputId: "T6_FIBER",
    outputId: "T6_CLOTH",
    outputQuantity: 1,
    inputQuantity: 4,
  },
  {
    inputId: "T4_ORE",
    outputId: "T4_METALBAR",
    outputQuantity: 1,
    inputQuantity: 2,
  },
  {
    inputId: "T5_ORE",
    outputId: "T5_METALBAR",
    outputQuantity: 1,
    inputQuantity: 3,
  },
  {
    inputId: "T6_ORE",
    outputId: "T6_METALBAR",
    outputQuantity: 1,
    inputQuantity: 4,
  },
  {
    inputId: "T4_WOOD",
    outputId: "T4_PLANKS",
    outputQuantity: 1,
    inputQuantity: 2,
  },
  {
    inputId: "T5_WOOD",
    outputId: "T5_PLANKS",
    outputQuantity: 1,
    inputQuantity: 3,
  },
  {
    inputId: "T6_WOOD",
    outputId: "T6_PLANKS",
    outputQuantity: 1,
    inputQuantity: 4,
  },
  {
    inputId: "T4_ROCK",
    outputId: "T4_STONEBLOCK",
    outputQuantity: 1,
    inputQuantity: 2,
  },
  {
    inputId: "T5_ROCK",
    outputId: "T5_STONEBLOCK",
    outputQuantity: 1,
    inputQuantity: 3,
  },
  {
    inputId: "T6_ROCK",
    outputId: "T6_STONEBLOCK",
    outputQuantity: 1,
    inputQuantity: 4,
  },
]

export default function ProfitCalculatorPage() {
  const [activeTab, setActiveTab] = useState("crafting")
  const { toast } = useToast()

  // Estados para la calculadora de crafteo
  const [selectedCraftItem, setSelectedCraftItem] = useState("")
  const [craftingFee, setCraftingFee] = useState(500)
  const [returnRate, setReturnRate] = useState(15.2)
  const [craftingResult, setCraftingResult] = useState<CraftingCalculation | null>(null)
  const [customMaterialPrices, setCustomMaterialPrices] = useState<Record<string, number>>({})
  const [customSellPrice, setCustomSellPrice] = useState<number | null>(null)

  // Estados para la calculadora de refinado
  const [selectedRefiningResource, setSelectedRefiningResource] = useState("")
  const [refiningFee, setRefiningFee] = useState(300)
  const [refiningResult, setRefiningResult] = useState<RefiningCalculation | null>(null)
  const [customRefiningInputPrice, setCustomRefiningInputPrice] = useState<number | null>(null)
  const [customRefiningOutputPrice, setCustomRefiningOutputPrice] = useState<number | null>(null)

  // Estados para la calculadora de transporte
  const [selectedTransportItem, setSelectedTransportItem] = useState("")
  const [buyCity, setBuyCity] = useState(CITIES[0])
  const [sellCity, setSellCity] = useState(CITIES[1])
  const [buyPrice, setBuyPrice] = useState(0)
  const [sellPrice, setSellPrice] = useState(0)
  const [transportQuantity, setTransportQuantity] = useState(100)
  const [transportCost, setTransportCost] = useState(500)
  const [transportResult, setTransportResult] = useState<TransportCalculation | null>(null)

  // Función para calcular la rentabilidad del crafteo
  const calculateCraftingProfit = () => {
    if (!selectedCraftItem) {
      toast({
        title: "Error",
        description: "Selecciona un objeto para calcular la rentabilidad",
        variant: "destructive",
      })
      return
    }

    const item = CRAFTABLE_ITEMS.find((item) => item.id === selectedCraftItem)
    if (!item) return

    const materials: MaterialCost[] = item.materials.map((material) => {
      const materialData = MATERIALS.find((m) => m.id === material.id)
      if (!materialData) return {} as MaterialCost

      const customPrice = customMaterialPrices[material.id]
      const pricePerUnit = customPrice !== undefined ? customPrice : materialData.price

      return {
        name: materialData.name,
        id: material.id,
        quantity: material.quantity,
        pricePerUnit,
        totalCost: pricePerUnit * material.quantity,
      }
    })

    const materialCost = materials.reduce((sum, material) => sum + material.totalCost, 0)
    const totalCost = materialCost + craftingFee
    const sellPrice = customSellPrice !== null ? customSellPrice : item.price
    const profit = sellPrice - totalCost
    const profitPercentage = (profit / totalCost) * 100

    const result: CraftingCalculation = {
      itemName: item.name,
      itemId: item.id,
      craftingFee,
      returnRate,
      sellPrice,
      totalCost,
      profit,
      profitPercentage,
      materials,
    }

    setCraftingResult(result)
  }

  // Función para calcular la rentabilidad del refinado
  const calculateRefiningProfit = () => {
    if (!selectedRefiningResource) {
      toast({
        title: "Error",
        description: "Selecciona un recurso para calcular la rentabilidad",
        variant: "destructive",
      })
      return
    }

    const recipe = REFINING_RECIPES.find((recipe) => recipe.inputId === selectedRefiningResource)
    if (!recipe) return

    const inputMaterial = MATERIALS.find((m) => m.id === recipe.inputId)
    const outputMaterial = MATERIALS.find((m) => m.id === recipe.outputId)
    if (!inputMaterial || !outputMaterial) return

    const inputPrice = customRefiningInputPrice !== null ? customRefiningInputPrice : inputMaterial.price
    const outputPrice = customRefiningOutputPrice !== null ? customRefiningOutputPrice : outputMaterial.price

    const inputCost: MaterialCost = {
      name: inputMaterial.name,
      id: inputMaterial.id,
      quantity: recipe.inputQuantity,
      pricePerUnit: inputPrice,
      totalCost: inputPrice * recipe.inputQuantity,
    }

    const totalCost = inputCost.totalCost + refiningFee
    const sellValue = outputPrice * recipe.outputQuantity
    const profit = sellValue - totalCost
    const profitPercentage = (profit / totalCost) * 100

    const result: RefiningCalculation = {
      resourceName: outputMaterial.name,
      resourceId: recipe.outputId,
      inputResource: inputCost,
      outputQuantity: recipe.outputQuantity,
      refiningFee,
      sellPrice: outputPrice,
      totalCost,
      profit,
      profitPercentage,
    }

    setRefiningResult(result)
  }

  // Función para calcular la rentabilidad del transporte
  const calculateTransportProfit = () => {
    if (!selectedTransportItem || buyCity === sellCity) {
      toast({
        title: "Error",
        description:
          buyCity === sellCity
            ? "Las ciudades de compra y venta deben ser diferentes"
            : "Selecciona un objeto para calcular la rentabilidad",
        variant: "destructive",
      })
      return
    }

    const item = [...CRAFTABLE_ITEMS, ...MATERIALS].find((item) => item.id === selectedTransportItem)
    if (!item) return

    const totalBuyCost = buyPrice * transportQuantity
    const totalSellValue = sellPrice * transportQuantity
    const totalCost = totalBuyCost + transportCost
    const profit = totalSellValue - totalCost
    const profitPercentage = (profit / totalCost) * 100

    const result: TransportCalculation = {
      itemName: item.name,
      itemId: item.id,
      buyCity,
      sellCity,
      buyPrice,
      sellPrice,
      quantity: transportQuantity,
      transportCost,
      totalCost,
      profit,
      profitPercentage,
    }

    setTransportResult(result)
  }

  // Función para actualizar el precio personalizado de un material
  const updateCustomMaterialPrice = (materialId: string, price: number | "") => {
    setCustomMaterialPrices((prev) => ({
      ...prev,
      [materialId]: price === "" ? 0 : price,
    }))
  }

  // Obtener todos los materiales y objetos para el selector de transporte
  const allItems = useMemo(() => {
    return [...MATERIALS, ...CRAFTABLE_ITEMS]
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex flex-col items-center justify-center py-6">
        <Link href="/" className="flex items-center mb-6">
          <AlbionLogo className="w-12 h-12 mr-3" />
          <h1 className="text-2xl font-bold text-amber-500">Albion Online Data</h1>
        </Link>
        <h2 className="text-3xl font-bold text-white mb-4">Calculadora de Rentabilidad</h2>
        <p className="text-gray-400 text-center max-w-2xl mb-8">
          Calcula la rentabilidad de crafteo, refinado y transporte para maximizar tus ganancias en Albion Online.
        </p>
      </header>

      <main>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="crafting" className="data-[state=active]:bg-amber-600">
                Crafteo
              </TabsTrigger>
              <TabsTrigger value="refining" className="data-[state=active]:bg-amber-600">
                Refinado
              </TabsTrigger>
              <TabsTrigger value="transport" className="data-[state=active]:bg-amber-600">
                Transporte
              </TabsTrigger>
            </TabsList>

            {/* Calculadora de Crafteo */}
            <TabsContent value="crafting">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-amber-500">Parámetros de Crafteo</CardTitle>
                    <CardDescription>Configura los detalles para calcular la rentabilidad</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Objeto a Craftear</label>
                      <Select value={selectedCraftItem} onValueChange={setSelectedCraftItem}>
                        <SelectTrigger className="bg-gray-600 border-gray-500">
                          <SelectValue placeholder="Selecciona un objeto" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          {CRAFTABLE_ITEMS.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Tasa de Crafteo (plata)</label>
                      <Input
                        type="number"
                        value={craftingFee}
                        onChange={(e) => setCraftingFee(Number(e.target.value))}
                        className="bg-gray-600 border-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Tasa de Retorno de Materiales (%)</label>
                      <Input
                        type="number"
                        value={returnRate}
                        onChange={(e) => setReturnRate(Number(e.target.value))}
                        className="bg-gray-600 border-gray-500"
                      />
                    </div>

                    {selectedCraftItem && (
                      <>
                        <div className="pt-4 border-t border-gray-600">
                          <h4 className="font-medium text-amber-400 mb-2">Materiales Necesarios</h4>
                          <div className="space-y-3">
                            {CRAFTABLE_ITEMS.find((item) => item.id === selectedCraftItem)?.materials.map(
                              (material) => {
                                const materialData = MATERIALS.find((m) => m.id === material.id)
                                if (!materialData) return null

                                return (
                                  <div key={material.id} className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm font-medium text-gray-200">{materialData.name}</p>
                                      <p className="text-xs text-gray-400">Cantidad: {material.quantity}</p>
                                    </div>
                                    <div className="w-28">
                                      <Input
                                        type="number"
                                        placeholder={`${materialData.price}`}
                                        value={customMaterialPrices[material.id] || ""}
                                        onChange={(e) =>
                                          updateCustomMaterialPrice(
                                            material.id,
                                            e.target.value === "" ? "" : Number(e.target.value),
                                          )
                                        }
                                        className="bg-gray-600 border-gray-500 h-8 text-sm"
                                      />
                                    </div>
                                  </div>
                                )
                              },
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Precio de Venta (plata)</label>
                          <Input
                            type="number"
                            placeholder={`${CRAFTABLE_ITEMS.find((item) => item.id === selectedCraftItem)?.price || 0}`}
                            value={customSellPrice === null ? "" : customSellPrice}
                            onChange={(e) => setCustomSellPrice(e.target.value === "" ? null : Number(e.target.value))}
                            className="bg-gray-600 border-gray-500"
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-amber-600 hover:bg-amber-700"
                      onClick={calculateCraftingProfit}
                      disabled={!selectedCraftItem}
                    >
                      Calcular Rentabilidad
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-amber-500">Resultados</CardTitle>
                    <CardDescription>Análisis de rentabilidad del crafteo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {craftingResult ? (
                      <div className="space-y-4">
                        <div className="bg-gray-600 p-4 rounded-lg">
                          <h3 className="font-bold text-lg text-white mb-2">{craftingResult.itemName}</h3>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-sm text-gray-400">Coste Total</p>
                              <p className="text-xl font-bold text-white">
                                {craftingResult.totalCost.toLocaleString()} plata
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Precio de Venta</p>
                              <p className="text-xl font-bold text-white">
                                {craftingResult.sellPrice.toLocaleString()} plata
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Beneficio</p>
                              <p
                                className={`text-xl font-bold ${craftingResult.profit >= 0 ? "text-green-400" : "text-red-400"}`}
                              >
                                {craftingResult.profit.toLocaleString()} plata
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Rentabilidad</p>
                              <p
                                className={`text-xl font-bold ${craftingResult.profitPercentage >= 0 ? "text-green-400" : "text-red-400"}`}
                              >
                                {craftingResult.profitPercentage.toFixed(2)}%
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-amber-400 mb-2">Desglose de Costes</h4>
                          <div className="space-y-2">
                            {craftingResult.materials.map((material, index) => (
                              <div key={index} className="flex justify-between items-center bg-gray-600/50 p-2 rounded">
                                <div>
                                  <p className="text-sm font-medium">{material.name}</p>
                                  <p className="text-xs text-gray-400">
                                    {material.quantity} x {material.pricePerUnit.toLocaleString()} plata
                                  </p>
                                </div>
                                <p className="font-medium">{material.totalCost.toLocaleString()} plata</p>
                              </div>
                            ))}
                            <div className="flex justify-between items-center bg-gray-600/50 p-2 rounded">
                              <p className="text-sm font-medium">Tasa de Crafteo</p>
                              <p className="font-medium">{craftingResult.craftingFee.toLocaleString()} plata</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-600 p-4 rounded-lg">
                          <h4 className="font-medium text-amber-400 mb-2">Análisis</h4>
                          <p className="text-gray-300">
                            {craftingResult.profitPercentage >= 20
                              ? `¡Excelente rentabilidad! Con un beneficio del ${craftingResult.profitPercentage.toFixed(2)}%, este crafteo es muy rentable.`
                              : craftingResult.profitPercentage >= 5
                                ? `Rentabilidad aceptable. Con un beneficio del ${craftingResult.profitPercentage.toFixed(2)}%, este crafteo genera ganancias moderadas.`
                                : craftingResult.profitPercentage >= 0
                                  ? `Rentabilidad baja. Con un beneficio del ${craftingResult.profitPercentage.toFixed(2)}%, apenas cubre los costes.`
                                  : `No rentable. Con una pérdida del ${Math.abs(craftingResult.profitPercentage).toFixed(2)}%, este crafteo genera pérdidas.`}
                          </p>
                          {craftingResult.returnRate > 0 && (
                            <p className="text-gray-300 mt-2">
                              Con una tasa de retorno de materiales del {craftingResult.returnRate}%, puedes recuperar
                              parte de los materiales para futuros crafteos.
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64 text-center">
                        <Calculator className="h-12 w-12 text-gray-500 mb-4" />
                        <p className="text-gray-400">
                          Selecciona un objeto y calcula su rentabilidad para ver los resultados
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Calculadora de Refinado */}
            <TabsContent value="refining">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-amber-500">Parámetros de Refinado</CardTitle>
                    <CardDescription>Configura los detalles para calcular la rentabilidad del refinado</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Recurso a Refinar</label>
                      <Select value={selectedRefiningResource} onValueChange={setSelectedRefiningResource}>
                        <SelectTrigger className="bg-gray-600 border-gray-500">
                          <SelectValue placeholder="Selecciona un recurso" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          {REFINING_RECIPES.map((recipe) => {
                            const material = MATERIALS.find((m) => m.id === recipe.inputId)
                            return material ? (
                              <SelectItem key={recipe.inputId} value={recipe.inputId}>
                                {material.name}
                              </SelectItem>
                            ) : null
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Tasa de Refinado (plata)</label>
                      <Input
                        type="number"
                        value={refiningFee}
                        onChange={(e) => setRefiningFee(Number(e.target.value))}
                        className="bg-gray-600 border-gray-500"
                      />
                    </div>

                    {selectedRefiningResource && (
                      <>
                        <div className="pt-4 border-t border-gray-600">
                          <h4 className="font-medium text-amber-400 mb-2">Detalles del Recurso</h4>
                          <div className="space-y-3">
                            {(() => {
                              const recipe = REFINING_RECIPES.find((r) => r.inputId === selectedRefiningResource)
                              const inputMaterial = MATERIALS.find((m) => m.id === selectedRefiningResource)
                              const outputMaterial = recipe ? MATERIALS.find((m) => m.id === recipe.outputId) : null

                              if (!recipe || !inputMaterial || !outputMaterial) return null

                              return (
                                <>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm font-medium text-gray-200">{inputMaterial.name}</p>
                                      <p className="text-xs text-gray-400">Cantidad: {recipe.inputQuantity}</p>
                                    </div>
                                    <div className="w-28">
                                      <Input
                                        type="number"
                                        placeholder={`${inputMaterial.price}`}
                                        value={customRefiningInputPrice === null ? "" : customRefiningInputPrice}
                                        onChange={(e) =>
                                          setCustomRefiningInputPrice(
                                            e.target.value === "" ? null : Number(e.target.value),
                                          )
                                        }
                                        className="bg-gray-600 border-gray-500 h-8 text-sm"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex justify-center">
                                    <ArrowDown className="h-6 w-6 text-amber-500" />
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm font-medium text-gray-200">{outputMaterial.name}</p>
                                      <p className="text-xs text-gray-400">Cantidad: {recipe.outputQuantity}</p>
                                    </div>
                                    <div className="w-28">
                                      <Input
                                        type="number"
                                        placeholder={`${outputMaterial.price}`}
                                        value={customRefiningOutputPrice === null ? "" : customRefiningOutputPrice}
                                        onChange={(e) =>
                                          setCustomRefiningOutputPrice(
                                            e.target.value === "" ? null : Number(e.target.value),
                                          )
                                        }
                                        className="bg-gray-600 border-gray-500 h-8 text-sm"
                                      />
                                    </div>
                                  </div>
                                </>
                              )
                            })()}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-amber-600 hover:bg-amber-700"
                      onClick={calculateRefiningProfit}
                      disabled={!selectedRefiningResource}
                    >
                      Calcular Rentabilidad
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-amber-500">Resultados</CardTitle>
                    <CardDescription>Análisis de rentabilidad del refinado</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {refiningResult ? (
                      <div className="space-y-4">
                        <div className="bg-gray-600 p-4 rounded-lg">
                          <h3 className="font-bold text-lg text-white mb-2">{refiningResult.resourceName}</h3>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-sm text-gray-400">Coste Total</p>
                              <p className="text-xl font-bold text-white">
                                {refiningResult.totalCost.toLocaleString()} plata
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Valor de Venta</p>
                              <p className="text-xl font-bold text-white">
                                {(refiningResult.sellPrice * refiningResult.outputQuantity).toLocaleString()} plata
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Beneficio</p>
                              <p
                                className={`text-xl font-bold ${refiningResult.profit >= 0 ? "text-green-400" : "text-red-400"}`}
                              >
                                {refiningResult.profit.toLocaleString()} plata
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Rentabilidad</p>
                              <p
                                className={`text-xl font-bold ${refiningResult.profitPercentage >= 0 ? "text-green-400" : "text-red-400"}`}
                              >
                                {refiningResult.profitPercentage.toFixed(2)}%
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-amber-400 mb-2">Desglose de Costes</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center bg-gray-600/50 p-2 rounded">
                              <div>
                                <p className="text-sm font-medium">{refiningResult.inputResource.name}</p>
                                <p className="text-xs text-gray-400">
                                  {refiningResult.inputResource.quantity} x{" "}
                                  {refiningResult.inputResource.pricePerUnit.toLocaleString()} plata
                                </p>
                              </div>
                              <p className="font-medium">
                                {refiningResult.inputResource.totalCost.toLocaleString()} plata
                              </p>
                            </div>
                            <div className="flex justify-between items-center bg-gray-600/50 p-2 rounded">
                              <p className="text-sm font-medium">Tasa de Refinado</p>
                              <p className="font-medium">{refiningResult.refiningFee.toLocaleString()} plata</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-600 p-4 rounded-lg">
                          <h4 className="font-medium text-amber-400 mb-2">Análisis</h4>
                          <p className="text-gray-300">
                            {refiningResult.profitPercentage >= 20
                              ? `¡Excelente rentabilidad! Con un beneficio del ${refiningResult.profitPercentage.toFixed(2)}%, este refinado es muy rentable.`
                              : refiningResult.profitPercentage >= 5
                                ? `Rentabilidad aceptable. Con un beneficio del ${refiningResult.profitPercentage.toFixed(2)}%, este refinado genera ganancias moderadas.`
                                : refiningResult.profitPercentage >= 0
                                  ? `Rentabilidad baja. Con un beneficio del ${refiningResult.profitPercentage.toFixed(2)}%, apenas cubre los costes.`
                                  : `No rentable. Con una pérdida del ${Math.abs(refiningResult.profitPercentage).toFixed(2)}%, este refinado genera pérdidas.`}
                          </p>
                          <p className="text-gray-300 mt-2">
                            Considera refinar en ciudades con bonificaciones para aumentar la rentabilidad.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64 text-center">
                        <RefreshCw className="h-12 w-12 text-gray-500 mb-4" />
                        <p className="text-gray-400">
                          Selecciona un recurso y calcula su rentabilidad para ver los resultados
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Calculadora de Transporte */}
            <TabsContent value="transport">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-amber-500">Parámetros de Transporte</CardTitle>
                    <CardDescription>
                      Configura los detalles para calcular la rentabilidad del transporte
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Objeto a Transportar</label>
                      <Select value={selectedTransportItem} onValueChange={setSelectedTransportItem}>
                        <SelectTrigger className="bg-gray-600 border-gray-500">
                          <SelectValue placeholder="Selecciona un objeto" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          {allItems.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Ciudad de Compra</label>
                        <Select value={buyCity} onValueChange={setBuyCity}>
                          <SelectTrigger className="bg-gray-600 border-gray-500">
                            <SelectValue placeholder="Ciudad de compra" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            {CITIES.map((city) => (
                              <SelectItem key={`buy-${city}`} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Ciudad de Venta</label>
                        <Select value={sellCity} onValueChange={setSellCity}>
                          <SelectTrigger className="bg-gray-600 border-gray-500">
                            <SelectValue placeholder="Ciudad de venta" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            {CITIES.map((city) => (
                              <SelectItem key={`sell-${city}`} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Precio de Compra (por unidad)</label>
                        <Input
                          type="number"
                          value={buyPrice}
                          onChange={(e) => setBuyPrice(Number(e.target.value))}
                          className="bg-gray-600 border-gray-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Precio de Venta (por unidad)</label>
                        <Input
                          type="number"
                          value={sellPrice}
                          onChange={(e) => setSellPrice(Number(e.target.value))}
                          className="bg-gray-600 border-gray-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Cantidad</label>
                        <Input
                          type="number"
                          value={transportQuantity}
                          onChange={(e) => setTransportQuantity(Number(e.target.value))}
                          className="bg-gray-600 border-gray-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Coste de Transporte</label>
                        <Input
                          type="number"
                          value={transportCost}
                          onChange={(e) => setTransportCost(Number(e.target.value))}
                          className="bg-gray-600 border-gray-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-amber-600 hover:bg-amber-700"
                      onClick={calculateTransportProfit}
                      disabled={!selectedTransportItem || buyCity === sellCity}
                    >
                      Calcular Rentabilidad
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-amber-500">Resultados</CardTitle>
                    <CardDescription>Análisis de rentabilidad del transporte</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {transportResult ? (
                      <div className="space-y-4">
                        <div className="bg-gray-600 p-4 rounded-lg">
                          <h3 className="font-bold text-lg text-white mb-2">{transportResult.itemName}</h3>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-sm text-gray-400">Coste Total</p>
                              <p className="text-xl font-bold text-white">
                                {transportResult.totalCost.toLocaleString()} plata
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Valor de Venta</p>
                              <p className="text-xl font-bold text-white">
                                {(transportResult.sellPrice * transportResult.quantity).toLocaleString()} plata
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Beneficio</p>
                              <p
                                className={`text-xl font-bold ${transportResult.profit >= 0 ? "text-green-400" : "text-red-400"}`}
                              >
                                {transportResult.profit.toLocaleString()} plata
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Rentabilidad</p>
                              <p
                                className={`text-xl font-bold ${transportResult.profitPercentage >= 0 ? "text-green-400" : "text-red-400"}`}
                              >
                                {transportResult.profitPercentage.toFixed(2)}%
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-amber-400 mb-2">Desglose de Costes</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center bg-gray-600/50 p-2 rounded">
                              <div>
                                <p className="text-sm font-medium">Coste de Compra</p>
                                <p className="text-xs text-gray-400">
                                  {transportResult.quantity} x {transportResult.buyPrice.toLocaleString()} plata
                                </p>
                              </div>
                              <p className="font-medium">
                                {(transportResult.buyPrice * transportResult.quantity).toLocaleString()} plata
                              </p>
                            </div>
                            <div className="flex justify-between items-center bg-gray-600/50 p-2 rounded">
                              <p className="text-sm font-medium">Coste de Transporte</p>
                              <p className="font-medium">{transportResult.transportCost.toLocaleString()} plata</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-600 p-4 rounded-lg">
                          <h4 className="font-medium text-amber-400 mb-2">Análisis</h4>
                          <p className="text-gray-300">
                            {transportResult.profitPercentage >= 20
                              ? `¡Excelente rentabilidad! Con un beneficio del ${transportResult.profitPercentage.toFixed(2)}%, este transporte es muy rentable.`
                              : transportResult.profitPercentage >= 5
                                ? `Rentabilidad aceptable. Con un beneficio del ${transportResult.profitPercentage.toFixed(2)}%, este transporte genera ganancias moderadas.`
                                : transportResult.profitPercentage >= 0
                                  ? `Rentabilidad baja. Con un beneficio del ${transportResult.profitPercentage.toFixed(2)}%, apenas cubre los costes.`
                                  : `No rentable. Con una pérdida del ${Math.abs(transportResult.profitPercentage).toFixed(2)}%, este transporte genera pérdidas.`}
                          </p>
                          <p className="text-gray-300 mt-2">
                            Ruta: {transportResult.buyCity} → {transportResult.sellCity}
                          </p>
                          <p className="text-gray-300 mt-1">
                            Considera usar monturas con mayor capacidad de carga para reducir el número de viajes.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64 text-center">
                        <Percent className="h-12 w-12 text-gray-500 mb-4" />
                        <p className="text-gray-400">Configura los parámetros de transporte para ver los resultados</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
