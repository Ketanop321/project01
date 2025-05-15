import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "Image Repetition Transition Effect | React Version",
  description: "A React implementation of the Codrops Repeating Image Transition effect",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="no-js">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/qvq2ysy.css" />
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.className = 'js';`,
          }}
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
