"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import ReactFlow, { Background, Controls, MiniMap, type Node, type Edge } from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
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
const nodeTypes = { customNode: CustomNode }

export default function RoadmapView() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState(false)
  const [actionType, setActionType] = useState<"edit" | "delete">("edit")

  // Load from localStorage on mount
  useEffect(() => {
    if (!id) return router.push("/")
    const loaded = getRoadmap(id)
    if (!loaded) return router.push("/")
    setRoadmap(loaded)

    const flowNodes = loaded.nodes.map((n: RoadmapNode) => ({
      id: n.id,
      type: "customNode",
      position: n.position,
      data: n,
    }))
    setNodes(flowNodes)
    setEdges(loaded.edges)
  }, [id, router])

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

  const handlePasswordSubmit = async () => {
    if (password !== "Harshu1234") {
      setPasswordError(true)
      return
    }
    if (!id) return

    if (actionType === "edit") {
      router.push(`/roadmap/${id}/edit`)
    } else {
      await deleteRoadmap(id)
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

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
      {/* Header */}
      <div className="border-b border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-900 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.push("/")} className="mr-4 hover:bg-purple-100 dark:hover:bg-purple-900/20">
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
          <Button onClick={handleEditClick} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
            <Edit className="h-4 w-4 mr-2" /> Edit Roadmap
          </Button>
          <Button variant="destructive" onClick={handleDeleteClick}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      </div>

      {/* Flow Canvas */}
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={(_, node) => setSelectedNode(node)}
          nodeTypes={nodeTypes}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable
        >
          <Background />
          <Controls />
          <MiniMap nodeStrokeColor="#6366f1" nodeColor="#c4b5fd" />
        </ReactFlow>
      </div>

      {/* Node Details */}
      <Sheet open={!!selectedNode} onOpenChange={(open) => !open && setSelectedNode(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-xl text-purple-800 dark:text-purple-300">{selectedNode?.data.title}</SheetTitle>
            <SheetDescription>{selectedNode?.data.description}</SheetDescription>
          </SheetHeader>
          {/* ... You can render more details here ... */}
          <SheetFooter>
            <Button onClick={() => setSelectedNode(null)}>Close</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Password Dialog */}
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
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>Cancel</Button>
            <Button onClick={handlePasswordSubmit}>{actionType === "edit" ? "Edit" : "Delete"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}
