"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function LoadingAnimation() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 30)

    return () => clearInterval(interval)
  }, [])

  const dnaStrandVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const nucleotideVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  const connectingLineVariants = {
    initial: { scaleY: 0 },
    animate: {
      scaleY: 1,
      transition: {
        duration: 0.3,
        delay: 0.2,
      },
    },
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 z-50">
      <motion.div
        className="flex flex-col items-center"
        initial="initial"
        animate="animate"
        variants={dnaStrandVariants}
      >
        <motion.div
          className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          CRISPR Roadmaps
        </motion.div>

        <div className="flex space-x-4 mb-12">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <motion.div
                className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                variants={nucleotideVariants}
              />
              <motion.div
                className="w-1 h-12 bg-gradient-to-b from-purple-500 to-indigo-500 origin-top"
                variants={connectingLineVariants}
              />
              <motion.div
                className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                variants={nucleotideVariants}
              />
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 3 }}
        />
      </motion.div>
      <motion.p
        className="mt-4 text-gray-600 dark:text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        Loading your roadmaps...
      </motion.p>
    </div>
  )
}

