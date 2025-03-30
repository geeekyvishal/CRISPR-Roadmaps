"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import ReactFlow, { Background, Controls, MiniMap, type Node, type Edge } from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Youtube, FileText, ExternalLink, Trash2 } from "lucide-react"
import type { Roadmap, RoadmapNode } from "@/lib/types"
import { getRoadmap, deleteRoadmap } from "@/lib/storage"
import { CustomNode } from "@/components/custom-node"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Register custom node types
const nodeTypes = {
  customNode: CustomNode,
}

// export default function RoadmapView({ params }: { params: { id: string } }) {
//   const router = useRouter()
//   const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
//   const [nodes, setNodes] = useState<Node[]>([])
//   const [edges, setEdges] = useState<Edge[]>([])
//   const [selectedNode, setSelectedNode] = useState<Node | null>(null)
//   const reactFlowWrapper = useRef<HTMLDivElement>(null)

//   const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
//   const [password, setPassword] = useState("")
//   const [passwordError, setPasswordError] = useState(false)
//   const [actionType, setActionType] = useState<"edit" | "delete">("edit")

//   useEffect(() => {
//     const loadedRoadmap = getRoadmap(params.id)
//     if (loadedRoadmap) {
//       setRoadmap(loadedRoadmap)

//       // Convert stored nodes to ReactFlow format
//       const flowNodes = loadedRoadmap.nodes.map((node: RoadmapNode) => ({
//         id: node.id,
//         type: "customNode",
//         position: node.position,
//         data: {
//           label: node.title,
//           description: node.description,
//           resourceType: node.resourceType,
//           resourceUrl: node.resourceUrl,
//           content: node.content,
//         },
//       }))

//       setNodes(flowNodes)
//       setEdges(loadedRoadmap.edges)
//     } else {
//       router.push("/")
//     }
//   }, [params.id, router])

//   const onNodeClick = (_: React.MouseEvent, node: Node) => {
//     setSelectedNode(node)
//   }

//   const getYoutubeEmbedUrl = (url: string) => {
//     if (!url) return null

//     const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
//     const match = url.match(regExp)

//     if (match && match[2].length === 11) {
//       return `https://www.youtube.com/embed/${match[2]}`
//     }

//     return null
//   }


export default function RoadmapView({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState(false)
  const [actionType, setActionType] = useState<"edit" | "delete">("edit")

  useEffect(() => {
    const fetchRoadmap = async () => {
      const resolvedParams = await params; // ✅ Await params before using it
      const loadedRoadmap = getRoadmap(resolvedParams.id)
      
      if (loadedRoadmap) {
        setRoadmap(loadedRoadmap)

        // Convert stored nodes to ReactFlow format
        const flowNodes = loadedRoadmap.nodes.map((node: RoadmapNode) => ({
          id: node.id,
          type: "customNode",
          position: node.position,
          data: {
            label: node.title,
            description: node.description,
            resourceType: node.resourceType,
            resourceUrl: node.resourceUrl,
            content: node.content,
          },
        }))

        setNodes(flowNodes)
        setEdges(loadedRoadmap.edges)
      } else {
        router.push("/")
      }
    }

    fetchRoadmap()
  }, [params, router]) //Include params in the dependency array




  const handleEditClick = () => {
    setActionType("edit")
    setPassword("")
    setPasswordError(false)
    setIsPasswordDialogOpen(true)
  }

  const handleDeleteClick = () => {
    setActionType("delete")
    setPassword("")
    setPasswordError(false)
    setIsPasswordDialogOpen(true)
  }

  const handlePasswordSubmit = () => {
    if (password !== "Harshu1234") {
      setPasswordError(true)
      return
    }

    if (actionType === "edit") {
      params.then(resolvedParams => router.push(`/roadmap/${resolvedParams.id}/edit`))
    } else if (actionType === "delete") {
      params.then(resolvedParams => deleteRoadmap(resolvedParams.id))
      toast({
        title: "Roadmap deleted",
        description: "The roadmap has been deleted successfully.",
      })
      router.push("/")
    }

    setIsPasswordDialogOpen(false)
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  function onNodeClick(_: React.MouseEvent, node: Node): void {
    setSelectedNode(node)
  }
  function getYoutubeEmbedUrl(resourceUrl: string): string | undefined {
    if (!resourceUrl) return undefined;

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = resourceUrl.match(regExp);

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }

    return undefined;
  }
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
      <div className="border-b border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-900 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="mr-4 hover:bg-purple-100 dark:hover:bg-purple-900/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Roadmaps
          </Button>
          <div>
            <h1 className="text-xl font-bold text-purple-800 dark:text-purple-300">{roadmap.title}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Created by {roadmap.author} • {new Date(roadmap.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={handleEditClick}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Roadmap
          </Button>

          <Button variant="destructive" onClick={handleDeleteClick}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
        >
          <Background />
          <Controls />
          <MiniMap nodeStrokeColor="#6366f1" nodeColor="#c4b5fd" />
        </ReactFlow>
      </div>

      <Sheet open={!!selectedNode} onOpenChange={(open) => !open && setSelectedNode(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-xl text-purple-800 dark:text-purple-300">{selectedNode?.data.label}</SheetTitle>
            <SheetDescription>{selectedNode?.data.description}</SheetDescription>
          </SheetHeader>

          {selectedNode && (
            <div className="py-6 space-y-6">
              {selectedNode.data.resourceType === "youtube" && selectedNode.data.resourceUrl && (
                <div className="space-y-2">
                  <div className="flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">
                    <Youtube className="h-4 w-4 mr-2" />
                    Video Resource
                  </div>
                  <div className="aspect-video rounded-md overflow-hidden border border-purple-200 dark:border-purple-800">
                    <iframe
                      width="100%"
                      height="100%"
                      src={getYoutubeEmbedUrl(selectedNode.data.resourceUrl) || ""}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {selectedNode.data.resourceType === "article" && selectedNode.data.resourceUrl && (
                <div className="space-y-2">
                  <div className="flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">
                    <FileText className="h-4 w-4 mr-2" />
                    Article Resource
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-purple-200 dark:border-purple-800"
                    onClick={() => window.open(selectedNode.data.resourceUrl, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Article
                  </Button>
                </div>
              )}

              {selectedNode.data.content && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Detailed Information</h3>
                  <div className="prose dark:prose-invert max-w-none">
                    {selectedNode.data.content.split("\n").map((paragraph: string, i: number) => (
                      <p key={i} className="text-gray-700 dark:text-gray-300">
                      {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <SheetFooter>
            <Button onClick={() => setSelectedNode(null)}>Close</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{actionType === "edit" ? "Edit Roadmap" : "Delete Roadmap"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please enter the password to {actionType === "edit" ? "edit" : "delete"} this roadmap.
            </p>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setPasswordError(false)
                }}
                className={passwordError ? "border-red-500" : ""}
              />
              {passwordError && <p className="text-sm text-red-500">Incorrect password</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePasswordSubmit}>{actionType === "edit" ? "Edit" : "Delete"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}

