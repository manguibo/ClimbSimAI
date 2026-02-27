import { UserMetricsForm } from "@/components/user-metrics-form"
import { WallViewer } from "@/components/wall-viewer"
import type { Hold } from "@/types/climbing"

const demoHolds: Hold[] = [
  { id: "h1", x: 1, y: 0, type: "jug" },
  { id: "h2", x: 2, y: 1, type: "crimp" },
  { id: "h3", x: 3, y: 2, type: "sloper" },
  { id: "h4", x: 4, y: 3, type: "pinch" }
]

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-10 md:px-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">ClimbSimAI</h1>
        <p className="text-sm text-muted-foreground">V1: Rule-Based Beta Generator + Visualizer</p>
      </header>
      <section className="grid gap-6 md:grid-cols-2">
        <UserMetricsForm />
        <WallViewer holds={demoHolds} activeSequence={["h1", "h2"]} />
      </section>
    </main>
  )
}