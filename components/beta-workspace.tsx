"use client"

import { useEffect, useState } from "react"

import { UserMetricsForm } from "@/components/user-metrics-form"
import { WallViewer } from "@/components/wall-viewer"
import { Button } from "@/components/ui/button"
import { requestBetaSequence } from "@/lib/beta-client"
import { defaultFinishHoldId, defaultStartHoldId, orderedHoldIds } from "@/lib/holds"
import { activeSequenceForStep, canStepBackward, canStepForward, clampStep } from "@/lib/sequence"
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
const HOLD_OPTIONS = orderedHoldIds(DEMO_HOLDS)
const DEFAULT_START_HOLD_ID = defaultStartHoldId(DEMO_HOLDS)
const DEFAULT_FINISH_HOLD_ID = defaultFinishHoldId(DEMO_HOLDS)
const AUTOPLAY_INTERVAL_MS = 900

export function BetaWorkspace() {
  const [metrics, setMetrics] = useState<UserMetrics>(DEFAULT_METRICS)
  const [sequence, setSequence] = useState<string[]>([])
  const [explanations, setExplanations] = useState<string[]>([])
  const [startHoldId, setStartHoldId] = useState(DEFAULT_START_HOLD_ID)
  const [finishHoldId, setFinishHoldId] = useState(DEFAULT_FINISH_HOLD_ID)
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  function updateMetric<K extends keyof UserMetrics>(key: K, value: number) {
    setMetrics((prev) => ({ ...prev, [key]: value }))
  }

  async function generate() {
    if (!startHoldId || !finishHoldId || startHoldId === finishHoldId) {
      setError("Choose different start and finish holds.")
      return
    }

    setIsGenerating(true)
    setError("")

    try {
      const result = await requestBetaSequence({
        holds: DEMO_HOLDS,
        startHoldId,
        finishHoldId,
        userMetrics: metrics
      })

      setSequence(result.sequence)
      setExplanations(result.explanations)
      setCurrentStep(result.sequence.length > 0 ? 1 : 0)
      setIsPlaying(false)
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to generate beta"
      setError(message)
      setSequence([])
      setExplanations([])
      setCurrentStep(0)
      setIsPlaying(false)
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

  function resetSteps() {
    setCurrentStep(sequence.length > 0 ? 1 : 0)
    setIsPlaying(false)
  }

  useEffect(() => {
    if (!isPlaying || sequence.length === 0) {
      return
    }

    if (!canStepForward(currentStep, sequence.length)) {
      setIsPlaying(false)
      return
    }

    const timer = setTimeout(() => {
      setCurrentStep((prev) => clampStep(prev + 1, sequence.length))
    }, AUTOPLAY_INTERVAL_MS)

    return () => clearTimeout(timer)
  }, [currentStep, isPlaying, sequence.length])

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
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            Start Hold
            <select
              className="h-10 rounded-md border bg-background px-3 text-sm"
              value={startHoldId}
              onChange={(event) => setStartHoldId(event.target.value)}
            >
              {HOLD_OPTIONS.map((holdId) => (
                <option key={`start-${holdId}`} value={holdId}>
                  {holdId}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            Finish Hold
            <select
              className="h-10 rounded-md border bg-background px-3 text-sm"
              value={finishHoldId}
              onChange={(event) => setFinishHoldId(event.target.value)}
            >
              {HOLD_OPTIONS.map((holdId) => (
                <option key={`finish-${holdId}`} value={holdId}>
                  {holdId}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="text-sm text-muted-foreground">{error || explanation}</p>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={previousStep} disabled={!canStepBackward(currentStep)}>
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={nextStep}
            disabled={!canStepForward(currentStep, sequence.length)}
          >
            Next
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying((prev) => !prev)}
            disabled={sequence.length === 0 || currentStep >= sequence.length}
          >
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={resetSteps} disabled={sequence.length === 0}>
            Reset
          </Button>
          <p className="text-xs text-muted-foreground">
            Step {currentStep} / {sequence.length}
          </p>
        </div>
      </section>
    </>
  )
}
