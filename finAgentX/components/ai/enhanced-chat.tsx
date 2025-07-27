"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Mic, Brain, MicOff, Volume2, VolumeX, BarChart3, Sparkles, AlertCircle, Database } from "lucide-react"
import { useAIChat } from "@/hooks/use-ai-chat"
import { SmartVisualGenerator } from "./smart-visual-generator"
import { AIVisualParser } from "@/lib/ai-visual-parser"
import { cn } from "@/lib/utils"

interface EnhancedMessage {
  id: string
  role: "user" | "assistant"
  content: string
  visualData?: any[]
  timestamp: Date
}

interface EnhancedChatProps {
  className?: string
}

export function EnhancedChat({ className }: EnhancedChatProps) {
  const {
    messages: baseMessages,
    input,
    handleInputChange,
    handleSubmit,
    sendMessage,
    isLoading,
    error,
    stop,
  } = useAIChat()

  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isGeneratingVisuals, setIsGeneratingVisuals] = useState(false)
  const [debugMode, setDebugMode] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  // Enhanced message processing with better accuracy
  const enhancedMessages = useMemo(() => {
    return baseMessages.map((msg): EnhancedMessage => {
      let visualData: any[] = []

      if (msg.role === "assistant" && msg.content) {
        try {
          // Use improved AI parser for better accuracy
          visualData = AIVisualParser.parseResponseForVisuals(msg.content)

          if (debugMode) {
            console.log("Message content:", msg.content.substring(0, 200))
            console.log("Generated visuals:", visualData)
          }
        } catch (error) {
          console.error("Error parsing visuals:", error)
        }
      }

      return {
        ...msg,
        timestamp: new Date(),
        visualData: visualData.length > 0 ? visualData : undefined,
      }
    })
  }, [baseMessages, debugMode])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [enhancedMessages, scrollToBottom])

  // Visual generation timing
  useEffect(() => {
    if (isLoading) {
      setIsGeneratingVisuals(true)
    } else {
      const timer = setTimeout(() => {
        setIsGeneratingVisuals(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

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

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }, [])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [])

  const speakText = useCallback((text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)

      speechSynthesis.speak(utterance)
    }
  }, [])

  const stopSpeaking = useCallback(() => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [])

  // Data-driven quick actions with specific financial queries
  const quickActions = [
    "Show me my biggest portfolio leakages with exact amounts",
    "Which debt should I pay off first and calculate the savings",
    "How much more do I need to invest for my retirement goal?",
    "What's my exact tax saving opportunity this year?",
    "Which underperforming funds should I switch and to what?",
    "Calculate my emergency fund gap with specific numbers",
  ]

  return (
    <div className={cn("space-y-4", className)}>
      {/* Enhanced AI Status with Data Access Indicator */}
      <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-full mr-3">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 flex items-center">
                  Enhanced AI Financial Advisor
                  <Database className="h-4 w-4 ml-2 text-green-600" />
                  <Sparkles className="h-4 w-4 ml-1 text-yellow-500" />
                </h3>
                <p className="text-sm text-gray-700">
                  Complete financial data access • Real-time calculations • Data-backed advice
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Database className="w-3 h-3 mr-1" />
                Full Data Access
              </Badge>
              {isGeneratingVisuals && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Sparkles className="w-3 h-3 mr-1 animate-spin" />
                  Analyzing Data
                </Badge>
              )}
              <Button variant="outline" size="sm" onClick={() => setDebugMode(!debugMode)} className="text-xs">
                {debugMode ? "Debug: ON" : "Debug: OFF"}
              </Button>
              {error && <Badge variant="destructive">Error</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="h-[700px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Data-Driven Financial Advisor
              <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800 text-xs">
                <Database className="h-3 w-3 mr-1" />
                Real Financial Data
              </Badge>
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
            {enhancedMessages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[90%] ${message.role === "user" ? "" : "w-full"}`}>
                  <div
                    className={`rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white ml-auto max-w-[85%]"
                        : "bg-white border shadow-sm text-gray-900"
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
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          <Database className="h-3 w-3 mr-1" />
                          Data-Backed Response
                        </Badge>
                        {message.visualData && message.visualData.length > 0 ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            {message.visualData.length} Chart{message.visualData.length > 1 ? "s" : ""}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Text Response
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Enhanced Visual Components */}
                  {message.role === "assistant" && message.visualData && (
                    <SmartVisualGenerator responseText={message.content} visualData={message.visualData} />
                  )}
                </div>
              </div>
            ))}

            {(isLoading || isGeneratingVisuals) && (
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
                    <span className="text-sm text-gray-600 ml-2">
                      {isLoading
                        ? "AI is analyzing your complete financial data..."
                        : "Generating data-driven charts..."}
                    </span>
                    {isGeneratingVisuals && <Sparkles className="h-4 w-4 text-yellow-500 animate-spin ml-2" />}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Quick Actions with Data-Driven Queries */}
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2 flex items-center">
              <Database className="h-4 w-4 mr-1 text-green-600" />
              Ask specific questions for data-backed answers with proof:
            </div>
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
              placeholder="Ask specific questions about your finances - I have all your data!"
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
