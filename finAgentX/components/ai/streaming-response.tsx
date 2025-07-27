"use client"

import { useState, useEffect } from "react"

interface StreamingResponseProps {
  content: string
  onComplete?: () => void
}

export function StreamingResponse({ content, onComplete }: StreamingResponseProps) {
  const [displayedContent, setDisplayedContent] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent((prev) => prev + content[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, 20) // Adjust speed here

      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, content, onComplete])

  return (
    <div className="whitespace-pre-wrap">
      {displayedContent}
      {currentIndex < content.length && <span className="animate-pulse">|</span>}
    </div>
  )
}
