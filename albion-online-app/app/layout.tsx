import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Albion Online Data - Servidor Europeo",
  description:
    "Consulta información de jugadores, gremios y precios del mercado en el servidor europeo de Albion Online",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <footer className="bg-gray-900 border-t border-gray-800 py-6">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <p className="text-gray-400 text-sm">
                      © {new Date().getFullYear()} Albion Online Data. No afiliado con Sandbox Interactive.
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-amber-400 text-sm">
                      Términos de uso
                    </a>
                    <a href="#" className="text-gray-400 hover:text-amber-400 text-sm">
                      Política de privacidad
                    </a>
                    <a href="#" className="text-gray-400 hover:text-amber-400 text-sm">
                      Contacto
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'