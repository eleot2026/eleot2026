"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ELEOT_ENVIRONMENTS, getCriterionById } from "@/config/eleotConfig"
import { evaluateLesson, type EvaluationResult } from "@/utils/evaluation"
import { getTranslation } from "@/lib/i18n"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface Teacher {
  _id: string
  nameAr: string
  nameEn?: string
}

export default function EvaluationPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const lang = "ar"

  // Build badge value (set NEXT_PUBLIC_BUILD_SHA in Vercel)
  const buildSha = process.env.NEXT_PUBLIC_BUILD_SHA ?? "dev"

  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [selectedTeacherId, setSelectedTeacherId] = useState("")
  const [subject, setSubject] = useState("")
  const [grade, setGrade] = useState("")
  const [part, setPart] = useState<"start" | "middle" | "end">("start")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [lessonDescription, setLessonDescription] = useState("")
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null)
  const [isEvaluating, setIsEvaluating] = useState(false)

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      const res = await fetch("/api/teachers")
      const data = await res.json()
      setTeachers(data)
    } catch (error) {
      console.error("Error fetching teachers:", error)
    }
  }

  const handleEvaluate = async () => {
    if (!selectedTeacherId || !lessonDescription.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال بيانات المعلم ووصف الحصة",
        variant: "destructive",
      })
      return
    }

    setIsEvaluating(true)
    try {
      // NOTE: This is still client-side evaluation.
      // If you want to use the server API (/api/ai-evaluate), tell me and I’ll provide a patch.
      const result = evaluateLesson(lessonDescription, lang)
      setEvaluationResult(result)

      // Save to database
      const visitData = {
        teacherId: selectedTeacherId,
        subject,
        grade,
        part,
        date: new Date(date),
        lessonDescription,
        overallScore: result.overallScore,
        language: lang,
        scores: result.scores,
      }

      const res = await fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(visitData),
      })

      if (res.ok) {
        toast({
          title: "نجح",
          description: "تم التقييم وحفظ البيانات بنجاح",
        })
      } else {
        toast({
          title: "تنبيه",
          description: "تم التقييم لكن لم يتم حفظ الزيارة",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء التقييم",
        variant: "destructive",
      })
    } finally {
      setIsEvaluating(false)
    }
  }

  const handleClear = () => {
    setSelectedTeacherId("")
    setSubject("")
    setGrade("")
    setPart("start")
    setDate(new Date().toISOString().split("T")[0])
    setLessonDescription("")
    setEvaluationResult(null)
  }

  // Keep if you need it later (currently unused)
  // const selectedTeacher = teachers.find((t) => t._id === selectedTeacherId)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={getTranslation("evaluation", lang)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Administrative Data */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{getTranslation("administrativeData", lang)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>{getTranslation("teacher", lang)}</Label>
                <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المعلم" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher._id} value={teacher._id}>
                        {teacher.nameAr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{getTranslation("subject", lang)}</Label>
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>{getTranslation("grade", lang)}</Label>
                <Input value={grade} onChange={(e) => setGrade(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>{getTranslation("part", lang)}</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={part === "start" ? "default" : "outline"}
                    onClick={() => setPart("start")}
                    className="flex-1"
                  >
                    {getTranslation("start", lang)}
                  </Button>
                  <Button
                    type="button"
                    variant={part === "middle" ? "default" : "outline"}
                    onClick={() => setPart("middle")}
                    className="flex-1"
                  >
                    {getTranslation("middle", lang)}
                  </Button>
                  <Button
                    type="button"
                    variant={part === "end" ? "default" : "outline"}
                    onClick={() => setPart("end")}
                    className="flex-1"
                  >
                    {getTranslation("end", lang)}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{getTranslation("supervisor", lang)}</Label>
                <Input value={session?.user?.name || ""} disabled />
              </div>

              <div className="space-y-2">
                <Label>{getTranslation("date", lang)}</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ELEOT Environments */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{getTranslation("eleotEnvironments", lang)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {ELEOT_ENVIRONMENTS.map((env) => (
                <Button
                  key={env.id}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <span className="text-2xl font-bold">{env.id}</span>
                  <span className="text-xs mt-1 text-center">{env.label_ar}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lesson Description */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{getTranslation("lessonDescription", lang)}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={lessonDescription}
              onChange={(e) => setLessonDescription(e.target.value)}
              rows={6}
              placeholder="أدخل وصف الحصة هنا..."
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 mb-6">
          <Button onClick={handleEvaluate} disabled={isEvaluating} size="lg">
            {isEvaluating ? "جاري التقييم..." : getTranslation("aiEvaluation", lang)}
          </Button>
          <Button variant="outline" onClick={handleClear} size="lg">
            {getTranslation("clearAll", lang)}
          </Button>
        </div>

        {/* Results */}
        {evaluationResult && (
          <div className="space-y-6">
            {/* Overall Score */}
            <Card>
              <CardHeader>
                <CardTitle>{getTranslation("overallScore", lang)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary text-center">
                  {evaluationResult.overallScore.toFixed(2)} / 4.00
                </div>
              </CardContent>
            </Card>

            {/* Environment Scores */}
            {ELEOT_ENVIRONMENTS.map((env) => {
              const envScores = evaluationResult.scores.filter((s) => s.environmentId === env.id)
              const envAverage = envScores.reduce((sum, s) => sum + s.score, 0) / envScores.length

              return (
                <Card key={env.id}>
                  <CardHeader>
                    <CardTitle>
                      {env.id} - {env.label_ar} (المتوسط: {envAverage.toFixed(2)})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-right p-2">المعيار</th>
                            <th className="text-right p-2">الدرجة</th>
                            <th className="text-right p-2">التبرير</th>
                          </tr>
                        </thead>
                        <tbody>
                          {envScores.map((score) => {
                            const criterion = getCriterionById(score.criterionId)
                            return (
                              <tr key={score.criterionId} className="border-b">
                                <td className="p-2">{criterion?.label_ar || score.criterionId}</td>
                                <td className="p-2 text-center font-bold">{score.score}</td>
                                <td className="p-2">{score.justification}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>{getTranslation("recommendations", lang)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">{getTranslation("strengths", lang)}</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {evaluationResult.strengths.map((strength, idx) => {
                      const criterion = getCriterionById(strength.criterionId)
                      return (
                        <li key={idx}>
                          {criterion?.label_ar || strength.criterionId} (الدرجة: {strength.score})
                        </li>
                      )
                    })}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">{getTranslation("weaknesses", lang)}</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {evaluationResult.weaknesses.map((weakness, idx) => {
                      const criterion = getCriterionById(weakness.criterionId)
                      return (
                        <li key={idx}>
                          {criterion?.label_ar || weakness.criterionId} (الدرجة: {weakness.score})
                        </li>
                      )
                    })}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">{getTranslation("improvements", lang)}</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {evaluationResult.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Build badge (debug) */}
      <div
        style={{
          position: "fixed",
          bottom: 12,
          right: 12,
          zIndex: 9999,
          padding: "6px 10px",
          borderRadius: 10,
          fontSize: 12,
          background: "#111",
          color: "#fff",
          opacity: 0.85,
          direction: "ltr",
        }}
      >
        BUILD: {buildSha}
      </div>
    </div>
  )
}
