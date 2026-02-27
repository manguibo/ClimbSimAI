# AGENTS.md — ClimbSimAI Development Rules

This document defines how AI agents (Codex, ChatGPT, etc.) must generate and modify code in this repository.

All generated code MUST follow these rules.

---

# Project Overview

ClimbSimAI is a Next.js (App Router) TypeScript application that:

- Simulates climbing problems (holds + wall layout)
- Accepts user body metrics
- Generates beta (hold sequences)
- Visualizes beta step-by-step

Architecture must remain modular, clean, and extensible.

---

# Tech Stack (Do Not Change Without Explicit Instruction)

- Next.js (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- shadcn/ui components
- Optional: react-three-fiber (3D only when needed)

No Redux.
No unnecessary state libraries.
No class-based React components.
No JavaScript files — TypeScript only.

---

# Core Architectural Rules

## 1. Folder Responsibilities

### `/app`
- Routing only
- Layouts
- Pages
- API route handlers
- No heavy business logic

### `/components`
- Pure UI components
- No complex algorithms
- Must receive data via props
- Must be reusable

### `/lib`
- All business logic
- Beta generation
- Reach math
- Utility functions
- Type definitions (if not global)

### `/types`
- Shared TypeScript interfaces (if project grows)

---

# Coding Standards

## General

- Use functional components only
- Use named exports (NOT default exports unless required by Next)
- Prefer pure functions
- Keep functions under 40 lines when possible
- No deeply nested logic
- Avoid premature abstraction

## Naming

- camelCase for variables/functions
- PascalCase for components
- Types must end with descriptive names:
  - `UserMetrics`
  - `Hold`
  - `BetaResult`

## No Magic Numbers

All constants must be clearly defined:

```ts
const MAX_REACH_MULTIPLIER = 1.05

export type HoldType = "jug" | "crimp" | "sloper" | "pinch"

export interface Hold {
  id: string
  x: number
  y: number
  type: HoldType
}
UserMetrics
export interface UserMetrics {
  height: number
  wingspan: number
  apeIndex: number
  mobility: number // 1–10 scale
}
BetaResult
export interface BetaResult {
  sequence: string[] // hold IDs
  explanations: string[]
}

import { generateBetaSequence } from "@/lib/betaRules"

export async function POST(req: Request) {
  const body = await req.json()

  // Validate input
  if (!body) {
    return Response.json({ error: "Invalid input" }, { status: 400 })
  }

  const result = generateBetaSequence(body)

  return Response.json(result)
}
