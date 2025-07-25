import type { Roadmap } from "./types"
// import type { Roadmap } from "./types"


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

export async function createRoadmap(roadmap: Roadmap): Promise<void> {
  const roadmaps = getRoadmaps()
  const updatedRoadmaps = [...roadmaps, roadmap]

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRoadmaps))


  try {
    await fetch('/api/save-document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roadmap),
    });
  } catch (error) {
    console.error("Failed to sync roadmap to DB:", error);
  }
}

export async function updateRoadmap(updatedRoadmap: Roadmap): Promise<void> {
  const roadmaps = getRoadmaps();
  const updatedRoadmaps = roadmaps.map((roadmap) =>
    roadmap.id === updatedRoadmap.id ? updatedRoadmap : roadmap
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRoadmaps));

  try {
    await fetch('/api/update-document', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedRoadmap),
    });
  } catch (error) {
    console.error("Failed to update roadmap in DB:", error);
  }
}

export async function deleteRoadmap(id: string): Promise<void> {
  const roadmaps = getRoadmaps();
  const updatedRoadmaps = roadmaps.filter((roadmap) => roadmap.id !== id);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRoadmaps));

  try {
    await fetch(`/api/delete-document?id=${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error("Failed to delete roadmap from DB:", error);
  }
}

