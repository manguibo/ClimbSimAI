"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { UserMetrics } from "@/types/climbing"

const DEFAULT_METRICS: UserMetrics = {
  height: 175,
  wingspan: 178,
  apeIndex: 3,
  mobility: 6
}

export function UserMetricsForm() {
  const [metrics, setMetrics] = useState<UserMetrics>(DEFAULT_METRICS)

  function updateMetric<K extends keyof UserMetrics>(key: K, value: number) {
    setMetrics((prev) => ({ ...prev, [key]: value }))
  }

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
            onChange={(event) => updateMetric("height", Number(event.target.value))}
          />
        </label>
        <label className="grid gap-1 text-sm">
          Wingspan (cm)
          <Input
            type="number"
            value={metrics.wingspan}
            onChange={(event) => updateMetric("wingspan", Number(event.target.value))}
          />
        </label>
        <label className="grid gap-1 text-sm">
          Ape Index (cm)
          <Input
            type="number"
            value={metrics.apeIndex}
            onChange={(event) => updateMetric("apeIndex", Number(event.target.value))}
          />
        </label>
        <label className="grid gap-1 text-sm">
          Mobility (1-10)
          <Input
            type="number"
            min={1}
            max={10}
            value={metrics.mobility}
            onChange={(event) => updateMetric("mobility", Number(event.target.value))}
          />
        </label>
        <Button type="button" variant="outline" className="w-full">
          Save Metrics
        </Button>
      </CardContent>
    </Card>
  )
}