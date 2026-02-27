"use client"

import { useState } from "react"

import { UserMetricsForm } from "@/components/user-metrics-form"
import { WallViewer } from "@/components/wall-viewer"
import { Button } from "@/components/ui/button"
import { requestBetaSequence } from "@/lib/beta-client"
import { activeSequenceForStep, clampStep } from "@/lib/sequence"
import type { Hold, UserMetrics } from "@/types/climbing"

const DEMO_HOLDS: Hold[] = [
  { id: "h1", x: 1, y: 0, type: "jug" },
  { id: "h2", x: 2, y: 1, type: "crimp" },
  { id: "h3", x: 3, y: 2, type: "sloper" },
  { id: "h4", x: 4, y: 3, type: "pinch" }
]

const DEFAULT_METRICS: UserMetrics = {
  height: 175,
  wingspan: 178,
  apeIndex: 3,
  mobility: 6
}

export function BetaWorkspace() {
  const [metrics, setMetrics] = useState<UserMetrics>(DEFAULT_METRICS)
  const [sequence, setSequence] = useState<string[]>([])
  const [explanations, setExplanations] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  function updateMetric<K extends keyof UserMetrics>(key: K, value: number) {
    setMetrics((prev) => ({ ...prev, [key]: value }))
  }

  async function generate() {
    setIsGenerating(true)
    setError("")

    try {
      const result = await requestBetaSequence({
        holds: DEMO_HOLDS,
        startHoldId: "h1",
        finishHoldId: "h4",
        userMetrics: metrics
      })

      setSequence(result.sequence)
      setExplanations(result.explanations)
      setCurrentStep(result.sequence.length > 0 ? 1 : 0)
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to generate beta"
      setError(message)
      setSequence([])
      setExplanations([])
      setCurrentStep(0)
    } finally {
      setIsGenerating(false)
    }
  }

  function previousStep() {
    setCurrentStep((prev) => clampStep(prev - 1, sequence.length))
  }

  function nextStep() {
    setCurrentStep((prev) => clampStep(prev + 1, sequence.length))
  }

  const activeSequence = activeSequenceForStep(sequence, currentStep)
  const explanation = currentStep > 0 ? explanations[currentStep - 1] : "Generate a beta sequence to start."

  return (
    <>
      <section className="grid gap-6 md:grid-cols-2">
        <UserMetricsForm
          metrics={metrics}
          onMetricChange={updateMetric}
          onGenerate={generate}
          isGenerating={isGenerating}
        />
        <WallViewer holds={DEMO_HOLDS} activeSequence={activeSequence} />
      </section>
      <section className="space-y-3 rounded-md border bg-card p-4">
        <p className="text-sm text-muted-foreground">{error || explanation}</p>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={previousStep} disabled={currentStep <= 1}>
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={nextStep}
            disabled={sequence.length === 0 || currentStep >= sequence.length}
          >
            Next
          </Button>
          <p className="text-xs text-muted-foreground">
            Step {currentStep} / {sequence.length}
          </p>
        </div>
      </section>
    </>
  )
}
