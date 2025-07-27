"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Mic, Brain, Zap, MicOff, Volume2, VolumeX } from "lucide-react"
import { useAIChat } from "@/hooks/use-ai-chat"
import { cn } from "@/lib/utils"

interface RealTimeChatProps {
  className?: string
}

export function RealTimeChat({ className }: RealTimeChatProps) {
  const { messages, input, handleInputChange, handleSubmit, sendMessage, isLoading, error, stop } = useAIChat()
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "en-IN"

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        sendMessage(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [sendMessage])

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)

      speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const quickActions = [
    "How's my portfolio performing?",
    "Which SIPs should I review?",
    "Show my goal progress",
    "Tax saving opportunities",
    "Market outlook today",
    "Rebalancing suggestions",
  ]

  return (
    <div className={cn("space-y-4", className)}>
      {/* AI Status */}
      <Card className="border-l-4 border-l-green-500 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <Brain className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-green-900">AI Financial Advisor</h3>
                <p className="text-sm text-green-700">Real-time analysis • Personalized advice • Voice enabled</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                Online
              </Badge>
              {error && <Badge variant="destructive">Error</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-blue-600" />
              Real-time Financial Advisor
            </div>
            <div className="flex items-center space-x-2">
              {isLoading && (
                <Button variant="outline" size="sm" onClick={stop}>
                  Stop
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={isSpeaking ? stopSpeaking : undefined}
                disabled={!isSpeaking}
              >
                {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-lg p-4 ${
                    message.role === "user" ? "bg-blue-600 text-white" : "bg-white border shadow-sm text-gray-900"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>

                  {message.role === "assistant" && (
                    <div className="mt-3 flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => speakText(message.content)}
                        disabled={isSpeaking}
                        className="text-xs bg-transparent"
                      >
                        <Volume2 className="h-3 w-3 mr-1" />
                        Listen
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border shadow-sm rounded-lg p-4 max-w-[85%]">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <span className="text-sm text-gray-600 ml-2">AI is analyzing your portfolio...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">Quick questions:</div>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => sendMessage(action)}
                  disabled={isLoading}
                  className="text-xs bg-transparent hover:bg-gray-50"
                >
                  {action}
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about your investments, goals, or get financial advice..."
              className="flex-1"
              disabled={isLoading || isListening}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={isListening ? stopListening : startListening}
              disabled={isLoading}
              className={cn(isListening && "bg-red-100 border-red-300 text-red-600")}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>

          {isListening && (
            <div className="mt-2 text-center">
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                Listening... Speak now
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
