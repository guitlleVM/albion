"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AlbionLogo } from "@/components/albion-logo"
import { Button } from "@/components/ui/button"
import { Menu, X, Users, Compass, ShoppingCart, Star, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const routes = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Jugadores", href: "/players", icon: Users },
    { name: "Gremios", href: "/guilds", icon: Compass },
    { name: "Mercado", href: "/market", icon: ShoppingCart },
    { name: "Calculadora", href: "/items", icon: Star },
  ]

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(path)
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <AlbionLogo className="w-8 h-8 mr-2" />
              <span className="text-xl font-bold text-amber-500">Albion Data</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {routes.map((route) => {
              const Icon = route.icon
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium flex items-center",
                    isActive(route.href)
                      ? "bg-gray-800 text-amber-400"
                      : "text-gray-300 hover:bg-gray-800 hover:text-amber-400",
                  )}
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {route.name}
                </Link>
              )
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {routes.map((route) => {
              const Icon = route.icon
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium flex items-center",
                    isActive(route.href)
                      ? "bg-gray-700 text-amber-400"
                      : "text-gray-300 hover:bg-gray-700 hover:text-amber-400",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {route.name}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}
