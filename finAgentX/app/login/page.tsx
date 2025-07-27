"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Shield, Smartphone, Clock, CheckCircle, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [step, setStep] = useState(1)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [passcode, setPasscode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handlePhoneSubmit = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setStep(2)
    }, 1500)
  }

  const handlePasscodeSubmit = () => {
    setIsLoading(true)
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false)
      setStep(3)
      // Redirect to dashboard after success
      setTimeout(() => {
        router.push("/")
      }, 2000)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header - SINGLE LOGO ONLY */}
        <div className="text-center mb-8">
          <div className="bg-blue-600 p-4 rounded-2xl mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FinAgentX</h1>
          <p className="text-gray-600">Secure access to your financial data</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-600" />
              Secure Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Fi Registered Mobile Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <Button onClick={handlePhoneSubmit} disabled={!phoneNumber.trim() || isLoading} className="w-full">
                  {isLoading ? "Verifying..." : "Send Passcode"}
                </Button>
                <div className="text-xs text-gray-500 text-center">
                  Make sure this number is registered with your Fi account
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Smartphone className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">Check your Fi app for the passcode sent to</p>
                  <p className="font-medium">{phoneNumber}</p>
                </div>
                <div>
                  <Label htmlFor="passcode">Enter Passcode from Fi App</Label>
                  <Input
                    id="passcode"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    maxLength={6}
                  />
                </div>
                <Button onClick={handlePasscodeSubmit} disabled={passcode.length !== 6 || isLoading} className="w-full">
                  {isLoading ? "Authenticating..." : "Verify & Login"}
                </Button>
                <Button variant="outline" onClick={() => setStep(1)} className="w-full">
                  Change Number
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <h3 className="font-medium text-green-800">Authentication Successful!</h3>
                <p className="text-sm text-gray-600">Redirecting to your dashboard...</p>
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-600">Session expires in 30 minutes</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Info */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm text-gray-700">Bank-grade Security</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                256-bit SSL
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-2">Your data is encrypted and never stored on our servers</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
