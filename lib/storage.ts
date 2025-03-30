import type { Roadmap } from "./types"

const STORAGE_KEY = "crispr-roadmaps"

export function getRoadmaps(): Roadmap[] {
  if (typeof window === "undefined") return []

  const storedData = localStorage.getItem(STORAGE_KEY)
  if (!storedData) return []

  try {
    return JSON.parse(storedData)
  } catch (error) {
    console.error("Failed to parse roadmaps from localStorage:", error)
    return []
  }
}

export function getRoadmap(id: string): Roadmap | null {
  const roadmaps = getRoadmaps()
  return roadmaps.find((roadmap) => roadmap.id === id) || null
}

export function createRoadmap(roadmap: Roadmap): void {
  const roadmaps = getRoadmaps()
  const updatedRoadmaps = [...roadmaps, roadmap]

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRoadmaps))
}

export function updateRoadmap(updatedRoadmap: Roadmap): void {
  const roadmaps = getRoadmaps()
  const updatedRoadmaps = roadmaps.map((roadmap) => (roadmap.id === updatedRoadmap.id ? updatedRoadmap : roadmap))

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRoadmaps))
}

export function deleteRoadmap(id: string): void {
  const roadmaps = getRoadmaps()
  const updatedRoadmaps = roadmaps.filter((roadmap) => roadmap.id !== id)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRoadmaps))
}

