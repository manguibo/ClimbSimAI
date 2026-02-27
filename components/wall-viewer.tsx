"use client"

import { Canvas } from "@react-three/fiber"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Hold, HoldType } from "@/types/climbing"

interface WallViewerProps {
  holds: Hold[]
  activeSequence: string[]
}

const GRID_COLUMNS = 6
const GRID_ROWS = 8
const CELL_SIZE = 0.9
const HOLD_RADIUS = 0.16
const WALL_THICKNESS = 0.18
const GRID_LINE_THICKNESS = 0.015

const HOLD_COLORS: Record<HoldType, string> = {
  jug: "#d97706",
  crimp: "#b45309",
  sloper: "#92400e",
  pinch: "#78350f"
}

function worldPosition(hold: Hold): [number, number, number] {
  const x = (hold.x - (GRID_COLUMNS - 1) / 2) * CELL_SIZE
  const y = (hold.y - (GRID_ROWS - 1) / 2) * CELL_SIZE
  return [x, y, 0.1]
}

function HoldMesh({ hold, isActive }: { hold: Hold; isActive: boolean }) {
  const [x, y, z] = worldPosition(hold)
  const scale = isActive ? 1.25 : 1
  const color = isActive ? "#fb923c" : HOLD_COLORS[hold.type]

  return (
    <mesh position={[x, y, z]} scale={[scale, scale, scale]}>
      <sphereGeometry args={[HOLD_RADIUS, 24, 24]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function WallGridLines({ wallWidth, wallHeight }: { wallWidth: number; wallHeight: number }) {
  const verticalLines = Array.from({ length: GRID_COLUMNS + 1 }, (_, index) => {
    const x = -wallWidth / 2 + index * CELL_SIZE
    return (
      <mesh key={`v-${index}`} position={[x, 0, WALL_THICKNESS / 2 + 0.002]}>
        <boxGeometry args={[GRID_LINE_THICKNESS, wallHeight, GRID_LINE_THICKNESS]} />
        <meshStandardMaterial color="#d7ccb7" />
      </mesh>
    )
  })

  const horizontalLines = Array.from({ length: GRID_ROWS + 1 }, (_, index) => {
    const y = -wallHeight / 2 + index * CELL_SIZE
    return (
      <mesh key={`h-${index}`} position={[0, y, WALL_THICKNESS / 2 + 0.002]}>
        <boxGeometry args={[wallWidth, GRID_LINE_THICKNESS, GRID_LINE_THICKNESS]} />
        <meshStandardMaterial color="#d7ccb7" />
      </mesh>
    )
  })

  return (
    <>
      {verticalLines}
      {horizontalLines}
    </>
  )
}

export function WallViewer({ holds, activeSequence }: WallViewerProps) {
  const wallWidth = GRID_COLUMNS * CELL_SIZE
  const wallHeight = GRID_ROWS * CELL_SIZE

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wall Viewer (3D)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-[380px] w-full overflow-hidden rounded-md border bg-muted/20">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <ambientLight intensity={0.55} />
            <directionalLight position={[2, 4, 6]} intensity={0.9} />
            <directionalLight position={[-3, -2, 5]} intensity={0.35} />
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[wallWidth + 0.5, wallHeight + 0.5, WALL_THICKNESS]} />
              <meshStandardMaterial color="#f1e8d8" />
            </mesh>
            <WallGridLines wallWidth={wallWidth} wallHeight={wallHeight} />
            {holds.map((hold) => (
              <HoldMesh key={hold.id} hold={hold} isActive={activeSequence.includes(hold.id)} />
            ))}
          </Canvas>
        </div>
        <p className="text-xs text-muted-foreground">Active holds are highlighted in orange.</p>
      </CardContent>
    </Card>
  )
}
