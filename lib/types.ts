export interface RoadmapNode {
  id: string
  title: string
  description?: string
  resourceType: "youtube" | "article" | "text"
  resourceUrl?: string
  content?: string
  position: {
    x: number
    y: number
  }
}

export interface Roadmap {
  id: string
  title: string
  description: string
  author: string
  nodes: RoadmapNode[]
  edges: any[]
  createdAt: string
  updatedAt: string
}

