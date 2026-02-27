"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { UserMetrics } from "@/types/climbing"
interface UserMetricsFormProps {
  metrics: UserMetrics
  onMetricChange: <K extends keyof UserMetrics>(key: K, value: number) => void
  onGenerate: () => void
  isGenerating: boolean
}

export function UserMetricsForm({ metrics, onMetricChange, onGenerate, isGenerating }: UserMetricsFormProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <label className="grid gap-1 text-sm">
          Height (cm)
          <Input
            type="number"
            value={metrics.height}
            onChange={(event) => onMetricChange("height", Number(event.target.value))}
          />
        </label>
        <label className="grid gap-1 text-sm">
          Wingspan (cm)
          <Input
            type="number"
            value={metrics.wingspan}
            onChange={(event) => onMetricChange("wingspan", Number(event.target.value))}
          />
        </label>
        <label className="grid gap-1 text-sm">
          Ape Index (cm)
          <Input
            type="number"
            value={metrics.apeIndex}
            onChange={(event) => onMetricChange("apeIndex", Number(event.target.value))}
          />
        </label>
        <label className="grid gap-1 text-sm">
          Mobility (1-10)
          <Input
            type="number"
            min={1}
            max={10}
            value={metrics.mobility}
            onChange={(event) => onMetricChange("mobility", Number(event.target.value))}
          />
        </label>
        <Button type="button" variant="outline" className="w-full" onClick={onGenerate} disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate Beta"}
        </Button>
      </CardContent>
    </Card>
  )
}
