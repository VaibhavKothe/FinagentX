"use client"

import type React from "react"
import { useChat } from "ai/react"
import { useState } from "react"

export function useAIChat() {
  const [isThinking, setIsThinking] = useState(false)

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    isLoading,
    error,
    reload,
    stop,
    append,
  } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: "Hello! How can I help you today?",
      },
    ],
    onFinish: () => {
      setIsThinking(false)
    },
    onError: (error) => {
      console.error("Chat error:", error)
      setIsThinking(false)
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsThinking(true)
    originalHandleSubmit(e)
  }

  const sendMessage = async (message: string) => {
    if (!message.trim()) return

    setIsThinking(true)
    try {
      await append({
        role: "user",
        content: message,
      })
    } catch (error) {
      console.error("Send message error:", error)
      setIsThinking(false)
    }
  }

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    sendMessage,
    isLoading: isLoading || isThinking,
    error,
    reload,
    stop,
    isThinking,
  }
}
