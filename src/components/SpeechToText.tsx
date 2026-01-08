"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SpeechToTextProps {
  onTranscript: (text: string) => void
  language: "ar" | "en"
  disabled?: boolean
}

export const SpeechToText = ({ onTranscript, language, disabled }: SpeechToTextProps) => {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      setIsSupported(true)
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = language === "ar" ? "ar-SA" : "en-US"

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let transcript = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript
        }
        onTranscript(transcript)
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
        toast({
          title: language === "ar" ? "خطأ" : "Error",
          description:
            language === "ar"
              ? "حدث خطأ في التعرف على الصوت"
              : "An error occurred in speech recognition",
          variant: "destructive",
        })
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    } else {
      setIsSupported(false)
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [language, onTranscript, toast])

  const handleToggle = () => {
    if (!isSupported) {
      toast({
        title: language === "ar" ? "غير مدعوم" : "Not Supported",
        description:
          language === "ar"
            ? "المتصفح لا يدعم التعرف على الصوت"
            : "Browser does not support speech recognition",
        variant: "destructive",
      })
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current?.start()
        setIsListening(true)
      } catch (error) {
        console.error("Error starting recognition:", error)
        toast({
          title: language === "ar" ? "خطأ" : "Error",
          description:
            language === "ar"
              ? "فشل في بدء التعرف على الصوت"
              : "Failed to start speech recognition",
          variant: "destructive",
        })
      }
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <Button
      type="button"
      variant={isListening ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={disabled}
      className={`rounded-full ${isListening ? "bg-green-500 hover:bg-green-600" : ""}`}
    >
      {isListening ? (
        <>
          <MicOff className="h-4 w-4 ml-2" />
          {language === "ar" ? "إيقاف" : "Stop"}
        </>
      ) : (
        <>
          <Mic className="h-4 w-4 ml-2" />
          {language === "ar" ? "تسجيل" : "Record"}
        </>
      )}
    </Button>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onresult: (event: SpeechRecognitionEvent) => void
  onerror: (event: SpeechRecognitionErrorEvent) => void
  onend: () => void
}

interface SpeechRecognitionEvent {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  length: number
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionErrorEvent {
  error: string
}

