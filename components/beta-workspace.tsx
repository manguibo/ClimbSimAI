"use client"

import { type ChangeEvent, useEffect, useRef, useState } from "react"

import { UserMetricsForm } from "@/components/user-metrics-form"
import { WallViewer } from "@/components/wall-viewer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { requestBetaSequence } from "@/lib/beta-client"
import { defaultFinishHoldId, defaultStartHoldId, orderedHoldIds } from "@/lib/holds"
import { stepToProgress } from "@/lib/playback"
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
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [metrics, setMetrics] = useState<UserMetrics>(DEFAULT_METRICS)
  const [sequence, setSequence] = useState<string[]>([])
  const [explanations, setExplanations] = useState<string[]>([])
  const [startHoldId, setStartHoldId] = useState(DEFAULT_START_HOLD_ID)
  const [finishHoldId, setFinishHoldId] = useState(DEFAULT_FINISH_HOLD_ID)
  const [videoUrl, setVideoUrl] = useState("")
  const [videoName, setVideoName] = useState("")
  const [videoDuration, setVideoDuration] = useState(0)
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
    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }
  }

  function onVideoSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    if (videoUrl) {
      URL.revokeObjectURL(videoUrl)
    }

    const nextVideoUrl = URL.createObjectURL(file)
    setVideoUrl(nextVideoUrl)
    setVideoName(file.name)
    setVideoDuration(0)
    setIsPlaying(false)
  }

  function onStepScrub(event: ChangeEvent<HTMLInputElement>) {
    const nextStep = Number(event.target.value)
    setCurrentStep(clampStep(nextStep, sequence.length))
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

  useEffect(() => {
    const video = videoRef.current
    if (!video) {
      return
    }

    if (isPlaying) {
      video.play().catch(() => setIsPlaying(false))
      return
    }

    video.pause()
  }, [isPlaying])

  useEffect(() => {
    if (!videoRef.current || !videoDuration || sequence.length <= 1) {
      return
    }

    videoRef.current.currentTime = stepToProgress(currentStep, sequence.length) * videoDuration
  }, [currentStep, sequence.length, videoDuration])

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl)
      }
    }
  }, [videoUrl])

  const activeSequence = activeSequenceForStep(sequence, currentStep)
  const explanation = currentStep > 0 ? explanations[currentStep - 1] : "Generate a beta sequence to start."

  return (
    <>
      <section className="grid gap-6 lg:grid-cols-3">
        <UserMetricsForm
          metrics={metrics}
          onMetricChange={updateMetric}
          onGenerate={generate}
          isGenerating={isGenerating}
        />
        <Card>
          <CardHeader>
            <CardTitle>Climb Video</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input type="file" accept="video/*" onChange={onVideoSelected} />
            <div className="h-[380px] overflow-hidden rounded-md border bg-muted/20">
              {videoUrl ? (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="h-full w-full object-contain"
                  controls
                  onLoadedMetadata={(event) => setVideoDuration(event.currentTarget.duration || 0)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                />
              ) : (
                <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
                  Upload a climb video to compare your attempt against generated beta.
                </div>
              )}
            </div>
            <p className="truncate text-xs text-muted-foreground">{videoName || "No video selected"}</p>
          </CardContent>
        </Card>
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
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Shared Timeline</label>
          <input
            className="w-full accent-primary"
            type="range"
            min={1}
            max={Math.max(sequence.length, 1)}
            value={Math.max(currentStep, 1)}
            onChange={onStepScrub}
            disabled={sequence.length === 0}
          />
          <div className="flex flex-wrap gap-2">
            {sequence.map((holdId, index) => {
              const stepNumber = index + 1
              const isActiveStep = currentStep === stepNumber
              return (
                <Button
                  key={`step-${holdId}-${stepNumber}`}
                  type="button"
                  variant={isActiveStep ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setCurrentStep(stepNumber)
                    setIsPlaying(false)
                  }}
                >
                  {stepNumber}:{holdId}
                </Button>
              )
            })}
          </div>
        </div>
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
