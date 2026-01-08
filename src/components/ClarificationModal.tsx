"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  getQuestionsForEnvironments,
  getNeededClarificationQuestions,
  type ClarificationQuestion,
} from "@/config/clarificationQuestions"
import { getTranslation } from "@/lib/i18n"
import { AlertCircle } from "lucide-react"

interface ClarificationModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (answers: Record<string, string>) => void
  onSkip: () => void
  selectedEnvironments: string[]
  language: "ar" | "en"
  lessonDescription?: string // Optional: if provided, only show questions for criteria with missing evidence
}

export const ClarificationModal = ({
  open,
  onClose,
  onSubmit,
  onSkip,
  selectedEnvironments,
  language,
  lessonDescription,
}: ClarificationModalProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  
  // Intelligently determine which questions are needed based on lesson description
  const questions = lessonDescription
    ? getNeededClarificationQuestions(lessonDescription, selectedEnvironments, language)
    : getQuestionsForEnvironments(selectedEnvironments)

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = () => {
    onSubmit(answers)
    setAnswers({})
  }

  const handleSkip = () => {
    onSkip()
    setAnswers({})
  }

  const allAnswered = questions.every((q) => answers[q.id])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir={language === "ar" ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            {language === "ar" ? "أسئلة توضيحية" : "Clarification Questions"}
          </DialogTitle>
          <DialogDescription>
            {questions.length === 0
              ? language === "ar"
                ? "وصف الحصة يحتوي على معلومات كافية. لا توجد أسئلة توضيحية مطلوبة."
                : "The lesson description contains sufficient information. No clarification questions are needed."
              : language === "ar"
              ? `لضمان دقة التقييم، يرجى الإجابة على ${questions.length} سؤال توضيحي:`
              : `To ensure evaluation accuracy, please answer ${questions.length} clarification question${questions.length > 1 ? "s" : ""}:`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {questions.length === 0 ? (
            <div className="p-6 text-center border rounded-lg bg-green-50">
              <p className="text-gray-700">
                {language === "ar"
                  ? "✓ وصف الحصة كافٍ ولا يحتاج إلى أسئلة توضيحية إضافية."
                  : "✓ Lesson description is sufficient and does not require additional clarification questions."}
              </p>
            </div>
          ) : (
            questions.map((question, index) => (
            <div key={question.id} className="space-y-3 p-4 border rounded-lg bg-yellow-50/50">
              <div className="space-y-1">
                <Label className="text-base font-semibold">
                  {index + 1}. {language === "ar" ? question.question_ar : question.question_en}
                </Label>
                {question.criterionId && (
                  <p className="text-sm text-gray-600">
                    {language === "ar" ? "المعيار:" : "Criterion:"} {question.criterionId}
                  </p>
                )}
              </div>

              <RadioGroup
                value={answers[question.id] || ""}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
              >
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                      <Label
                        htmlFor={`${question.id}-${option.value}`}
                        className="font-normal cursor-pointer flex-1"
                      >
                        {language === "ar" ? option.label_ar : option.label_en}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
            ))
          )}
        </div>

        <div className="flex gap-4 justify-end mt-6 pt-4 border-t">
          <Button variant="outline" onClick={handleSkip}>
            {language === "ar" ? "تخطي" : "Skip"}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={questions.length > 0 && !allAnswered}
          >
            {language === "ar" ? questions.length === 0 ? "متابعة" : "إرسال" : questions.length === 0 ? "Continue" : "Submit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


