import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "ClimbSimAI",
  description: "Rule-based climbing beta generator and visualizer"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}