"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface Toast {
  id: string
  type: "success" | "error" | "info"
  title: string
  message: string
}

interface ToastProps {
  toast: Toast
  onRemove: (id: string) => void
}

function ToastItem({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id)
    }, 5000)

    return () => clearTimeout(timer)
  }, [toast.id, onRemove])

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  }

  const Icon = icons[toast.type]

  return (
    <div
      className={cn(
        "flex items-start p-4 rounded-lg shadow-lg border max-w-sm",
        toast.type === "success" && "bg-green-50 border-green-200",
        toast.type === "error" && "bg-red-50 border-red-200",
        toast.type === "info" && "bg-blue-50 border-blue-200",
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5 mr-3 mt-0.5",
          toast.type === "success" && "text-green-600",
          toast.type === "error" && "text-red-600",
          toast.type === "info" && "text-blue-600",
        )}
      />
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{toast.title}</h4>
        <p className="text-sm text-gray-600 mt-1">{toast.message}</p>
      </div>
      <button onClick={() => onRemove(toast.id)} className="ml-2 text-gray-400 hover:text-gray-600">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  // Make addToast available globally
  useEffect(() => {
    ;(window as any).addToast = addToast
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}
