"use client"

import { useEffect, useState } from "react"
import { RoadmapList } from "@/components/roadmap-list"
import { LoadingAnimation } from "@/components/loading-animation"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Home() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Simulate loading time for animation
    const timer = setTimeout(() => {
      setLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleCreateNew = () => {
    router.push("/create")
  }

  if (loading) {
    return <LoadingAnimation />
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center mb-12 pt-8">
          <h1 className="text-5xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-4">
            CRISPR Roadmaps
          </h1>
          <p className="text-xl md:text-2xl text-center text-gray-600 dark:text-gray-300">Let CRISPR guide you</p>
        </div>

        <div className="flex justify-end mb-6">
          <Button
            onClick={handleCreateNew}
            className="group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
          >
            <PlusCircle className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            Create New Roadmap
          </Button>
        </div>

        <RoadmapList />
      </div>
    </main>
  )
}

