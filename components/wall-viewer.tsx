import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Hold } from "@/types/climbing"

interface WallViewerProps {
  holds: Hold[]
  activeSequence: string[]
}

const GRID_COLUMNS = 6
const GRID_ROWS = 8

function holdAtPosition(holds: Hold[], x: number, y: number): Hold | undefined {
  return holds.find((hold) => hold.x === x && hold.y === y)
}

export function WallViewer({ holds, activeSequence }: WallViewerProps) {
  const rows = Array.from({ length: GRID_ROWS }, (_, index) => GRID_ROWS - 1 - index)
  const columns = Array.from({ length: GRID_COLUMNS }, (_, index) => index)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wall Viewer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-6 gap-2 rounded-md border p-3">
          {rows.flatMap((y) =>
            columns.map((x) => {
              const hold = holdAtPosition(holds, x, y)
              const isActive = hold ? activeSequence.includes(hold.id) : false
              const baseClasses = "flex h-10 items-center justify-center rounded text-xs font-medium"

              if (!hold) {
                return <div key={`cell-${x}-${y}`} className={`${baseClasses} border border-dashed bg-background`} />
              }

              return (
                <div
                  key={hold.id}
                  className={`${baseClasses} ${
                    isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                  title={`${hold.id} (${hold.type})`}
                >
                  {hold.id}
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}