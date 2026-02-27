import { BetaWorkspace } from "@/components/beta-workspace"

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-10 md:px-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">ClimbSimAI</h1>
        <p className="text-sm text-muted-foreground">V1: Rule-Based Beta Generator + Visualizer</p>
      </header>
      <BetaWorkspace />
    </main>
  )
}
