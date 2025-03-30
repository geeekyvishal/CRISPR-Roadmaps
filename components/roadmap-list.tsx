"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Calendar, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import type { Roadmap } from "@/lib/types"
import { getRoadmaps } from "@/lib/storage"

export function RoadmapList() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const router = useRouter()

  useEffect(() => {
    const loadedRoadmaps = getRoadmaps()
    setRoadmaps(loadedRoadmaps)
  }, [])

  const handleViewRoadmap = (id: string) => {
    router.push(`/roadmap/${id}`)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  if (roadmaps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-24 h-24 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-purple-600 dark:text-purple-300"
          >
            <path d="M12 2v8"></path>
            <path d="m4.93 10.93 1.41 1.41"></path>
            <path d="M2 18h2"></path>
            <path d="M20 18h2"></path>
            <path d="m19.07 10.93-1.41 1.41"></path>
            <path d="M22 22H2"></path>
            <path d="m16 6-4 4-4-4"></path>
            <path d="M16 18a4 4 0 0 0-8 0"></path>
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">No roadmaps yet</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
          Create your first CRISPR roadmap to start mapping out learning paths
        </p>
        <Button
          onClick={() => router.push("/create")}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          Create Your First Roadmap
        </Button>
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {roadmaps.map((roadmap) => (
        <motion.div key={roadmap.id} variants={item}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-800">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
              <CardTitle className="text-xl text-purple-800 dark:text-purple-300">{roadmap.title}</CardTitle>
              <CardDescription>{roadmap.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Created {new Date(roadmap.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <User className="mr-2 h-4 w-4" />
                <span>{roadmap.author}</span>
              </div>
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10">
              <Button
                onClick={() => handleViewRoadmap(roadmap.id)}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 group"
              >
                <Eye className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                View Roadmap
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}

