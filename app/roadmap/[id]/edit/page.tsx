"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  type Node,
  type Connection,
  Panel,
} from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { ArrowLeft, Plus, Save, Trash2, LinkIcon, ExternalLink } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import type { Roadmap, RoadmapNode } from "@/lib/types"
import { getRoadmap, updateRoadmap } from "@/lib/storage"
import { CustomNode } from "@/components/custom-node"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Register custom node types
const nodeTypes = {
  customNode: CustomNode,
}

export default function RoadmapEditor({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false)
  const [isAddEdgeOpen, setIsAddEdgeOpen] = useState(false)
  const [newNodeData, setNewNodeData] = useState({
    title: "",
    description: "",
    resourceType: "youtube",
    resourceUrl: "",
    content: "",
  })
  const [sourceNode, setSourceNode] = useState("")
  const [targetNode, setTargetNode] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)

  useEffect(() => {
    const loadedRoadmap = getRoadmap(params.id)
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
  }, [params.id, router])

  const onConnect = (params: Connection) => {
    setEdges((eds) =>
      addEdge(
        {
          ...params,
          type: "smoothstep",
          animated: true,
          style: { stroke: "#6366f1", strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#6366f1",
          },
        },
        eds,
      ),
    )
  }

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }

  const handleAddNode = () => {
    if (!newNodeData.title) return

    const newNode = {
      id: uuidv4(),
      type: "customNode",
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
      data: {
        label: newNodeData.title,
        description: newNodeData.description,
        resourceType: newNodeData.resourceType,
        resourceUrl: newNodeData.resourceUrl,
        content: newNodeData.content,
      },
    }

    setNodes((nds) => nds.concat(newNode))
    setNewNodeData({
      title: "",
      description: "",
      resourceType: "youtube",
      resourceUrl: "",
      content: "",
    })
    setIsAddNodeOpen(false)
  }

  const handleAddEdge = () => {
    if (!sourceNode || !targetNode || sourceNode === targetNode) return

    const newEdge = {
      id: `e${sourceNode}-${targetNode}`,
      source: sourceNode,
      target: targetNode,
      type: "smoothstep",
      animated: true,
      style: { stroke: "#6366f1", strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#6366f1",
      },
    }

    setEdges((eds) => addEdge(newEdge, eds))
    setSourceNode("")
    setTargetNode("")
    setIsAddEdgeOpen(false)
  }

  const handleDeleteNode = () => {
    if (!selectedNode) return

    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id))
    setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id))
    setSelectedNode(null)
  }

  const handleUpdateNode = (updatedData: any) => {
    if (!selectedNode) return

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...updatedData,
            },
          }
        }
        return node
      }),
    )

    // Update the selected node reference
    setSelectedNode({
      ...selectedNode,
      data: {
        ...selectedNode.data,
        ...updatedData,
      },
    })
  }

  const handleSaveRoadmap = () => {
    if (!roadmap) return

    setIsSaving(true)

    // Convert ReactFlow nodes to storage format
    const roadmapNodes = nodes.map((node) => ({
      id: node.id,
      title: node.data.label,
      description: node.data.description,
      resourceType: node.data.resourceType,
      resourceUrl: node.data.resourceUrl,
      content: node.data.content,
      position: node.position,
    }))

    const updatedRoadmap = {
      ...roadmap,
      nodes: roadmapNodes,
      edges: edges,
      updatedAt: new Date().toISOString(),
    }

    updateRoadmap(updatedRoadmap)

    toast({
      title: "Roadmap saved",
      description: "Your roadmap has been saved successfully.",
    })

    setIsSaving(false)
  }

  const handleFinishEditing = () => {
    handleSaveRoadmap()
    router.push(`/roadmap/${params.id}`)
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
      <div className="border-b border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-900 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="mr-4 hover:bg-purple-100 dark:hover:bg-purple-900/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold text-purple-800 dark:text-purple-300 truncate max-w-md">
            Editing: {roadmap.title}
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleSaveRoadmap}
            className="border-purple-200 dark:border-purple-800"
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>

          <Button
            onClick={handleFinishEditing}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            Finish Editing
          </Button>
        </div>
      </div>

      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap nodeStrokeColor="#6366f1" nodeColor="#c4b5fd" />

          <Panel position="top-right" className="space-x-2">
            <Dialog open={isAddNodeOpen} onOpenChange={setIsAddNodeOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Node
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Node</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Node Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., CRISPR Basics"
                      value={newNodeData.title}
                      onChange={(e) => setNewNodeData({ ...newNodeData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Short Description</Label>
                    <Input
                      id="description"
                      placeholder="Brief description of this topic"
                      value={newNodeData.description}
                      onChange={(e) => setNewNodeData({ ...newNodeData, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resourceType">Resource Type</Label>
                    <select
                      id="resourceType"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newNodeData.resourceType}
                      onChange={(e) => setNewNodeData({ ...newNodeData, resourceType: e.target.value })}
                    >
                      <option value="youtube">YouTube Video</option>
                      <option value="article">Article/Website</option>
                      <option value="text">Text Content Only</option>
                    </select>
                  </div>
                  {newNodeData.resourceType !== "text" && (
                    <div className="space-y-2">
                      <Label htmlFor="resourceUrl">Resource URL</Label>
                      <Input
                        id="resourceUrl"
                        placeholder={newNodeData.resourceType === "youtube" ? "YouTube video URL" : "Article URL"}
                        value={newNodeData.resourceUrl}
                        onChange={(e) => setNewNodeData({ ...newNodeData, resourceUrl: e.target.value })}
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="content">Detailed Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Detailed information about this topic"
                      className="min-h-[100px]"
                      value={newNodeData.content}
                      onChange={(e) => setNewNodeData({ ...newNodeData, content: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddNodeOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleAddNode}>
                    Add Node
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddEdgeOpen} onOpenChange={setIsAddEdgeOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-purple-200 dark:border-purple-800">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Connect Nodes
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Connect Nodes</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="sourceNode">Source Node</Label>
                    <select
                      id="sourceNode"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={sourceNode}
                      onChange={(e) => setSourceNode(e.target.value)}
                    >
                      <option value="">Select source node</option>
                      {nodes.map((node) => (
                        <option key={node.id} value={node.id}>
                          {node.data.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetNode">Target Node</Label>
                    <select
                      id="targetNode"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={targetNode}
                      onChange={(e) => setTargetNode(e.target.value)}
                    >
                      <option value="">Select target node</option>
                      {nodes.map((node) => (
                        <option key={node.id} value={node.id}>
                          {node.data.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddEdgeOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleAddEdge}>
                    Connect Nodes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Panel>
        </ReactFlow>
      </div>

      <Sheet open={!!selectedNode} onOpenChange={(open) => !open && setSelectedNode(null)}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Node Details</SheetTitle>
            <SheetDescription>View and edit node information</SheetDescription>
          </SheetHeader>

          {selectedNode && (
            <div className="py-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={selectedNode.data.label}
                  onChange={(e) => handleUpdateNode({ label: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={selectedNode.data.description || ""}
                  onChange={(e) => handleUpdateNode({ description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-resourceType">Resource Type</Label>
                <select
                  id="edit-resourceType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedNode.data.resourceType || "youtube"}
                  onChange={(e) => handleUpdateNode({ resourceType: e.target.value })}
                >
                  <option value="youtube">YouTube Video</option>
                  <option value="article">Article/Website</option>
                  <option value="text">Text Content Only</option>
                </select>
              </div>

              {selectedNode.data.resourceType !== "text" && (
                <div className="space-y-2">
                  <Label htmlFor="edit-resourceUrl">Resource URL</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="edit-resourceUrl"
                      value={selectedNode.data.resourceUrl || ""}
                      onChange={(e) => handleUpdateNode({ resourceUrl: e.target.value })}
                      className="flex-1"
                    />
                    {selectedNode.data.resourceUrl && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => window.open(selectedNode.data.resourceUrl, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="edit-content">Detailed Content</Label>
                <Textarea
                  id="edit-content"
                  value={selectedNode.data.content || ""}
                  onChange={(e) => handleUpdateNode({ content: e.target.value })}
                  className="min-h-[150px]"
                />
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="destructive" onClick={handleDeleteNode} className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Node
                </Button>
              </div>
            </div>
          )}

          <SheetFooter>
            <Button onClick={() => setSelectedNode(null)}>Close</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Toaster />
    </div>
  )
}

