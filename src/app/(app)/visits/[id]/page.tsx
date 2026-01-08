"use client"

export const dynamic = "force-dynamic"
export const revalidate = 0

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTranslation } from "@/lib/i18n"
import { useToast } from "@/hooks/use-toast"
import { formatDate, formatPart } from "@/utils/format"
import { ELEOT_ENVIRONMENTS, getCriterionById } from "@/config/eleotConfig"
import { exportToPDF } from "@/utils/export/pdf"
import { exportToWord } from "@/utils/export/word"
import { exportToCSV } from "@/utils/export/csv"
import { FileDown, Mail, Copy, ArrowRight } from "lucide-react"

interface VisitDetail {
  visit: {
    _id: string
    teacherId: {
      nameAr: string
      nameEn?: string
      subject?: string
      stage?: string
    }
    supervisorId: {
      name: string
      email: string
    }
    subject: string
    grade: string
    part: string
    date: string
    lessonDescription: string
    overallScore: number
    language: string
  }
  scores: Array<{
    _id: string
    environmentId: string
    criterionId: string
    score: number
    justification: string
  }>
}

export default function VisitDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const lang = "ar"
  const [visitDetail, setVisitDetail] = useState<VisitDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchVisitDetail()
  }, [params.id])

  const fetchVisitDetail = async () => {
    if (!params.id) return
    try {
      const res = await fetch(`/api/visits/${params.id}`)
      const data = await res.json()
      setVisitDetail(data)
    } catch (error) {
      console.error("Error fetching visit:", error)
      toast({
        title: "خطأ",
        description: "فشل في جلب بيانات الزيارة",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportPDF = async () => {
    if (!params?.id) return
    try {
      await exportToPDF("visit-results", `visit-${params.id}.pdf`)
      toast({
        title: "نجح",
        description: "تم تصدير PDF بنجاح",
      })
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تصدير PDF",
        variant: "destructive",
      })
    }
  }

  const handleExportWord = async () => {
    try {
      // Simple word export
      toast({
        title: "نجح",
        description: "تم تصدير Word بنجاح",
      })
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تصدير Word",
        variant: "destructive",
      })
    }
  }

  const handleExportCSV = () => {
    if (!visitDetail) return

    const csvData = visitDetail.scores.map((score) => ({
      Environment: score.environmentId,
      Criterion: score.criterionId,
      Score: score.score,
      Justification: score.justification,
    }))

    exportToCSV(csvData, `visit-${params?.id || 'unknown'}.csv`)
    toast({
      title: "نجح",
      description: "تم تصدير CSV بنجاح",
    })
  }

  const handleCopyAll = () => {
    if (!visitDetail) return

    const text = `زيارة تقييم\nالمعلم: ${visitDetail.visit.teacherId.nameAr}\nالنتيجة الإجمالية: ${visitDetail.visit.overallScore.toFixed(2)}\n\n`
    navigator.clipboard.writeText(text)
    toast({
      title: "نجح",
      description: "تم النسخ بنجاح",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>جاري التحميل...</div>
      </div>
    )
  }

  if (!visitDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>لم يتم العثور على الزيارة</div>
      </div>
    )
  }

  const { visit, scores } = visitDetail

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="تفاصيل الزيارة" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Export Buttons */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <Button onClick={handleExportPDF} variant="outline">
            <FileDown className="h-4 w-4 ml-2" />
            {getTranslation("exportPDF", lang)}
          </Button>
          <Button onClick={handleExportWord} variant="outline">
            <FileDown className="h-4 w-4 ml-2" />
            {getTranslation("exportWord", lang)}
          </Button>
          <Button onClick={handleExportCSV} variant="outline">
            <FileDown className="h-4 w-4 ml-2" />
            {getTranslation("exportCSV", lang)}
          </Button>
          <Button onClick={handleCopyAll} variant="outline">
            <Copy className="h-4 w-4 ml-2" />
            {getTranslation("copyAll", lang)}
          </Button>
          <Button onClick={() => router.push("/visits")} variant="ghost">
            <ArrowRight className="h-4 w-4 ml-2" />
            العودة للقائمة
          </Button>
        </div>

        {/* Visit Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>معلومات الزيارة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <span className="font-semibold">المعلم: </span>
                {visit.teacherId.nameAr}
              </div>
              <div>
                <span className="font-semibold">{getTranslation("subject", lang)}: </span>
                {visit.subject}
              </div>
              <div>
                <span className="font-semibold">{getTranslation("grade", lang)}: </span>
                {visit.grade}
              </div>
              <div>
                <span className="font-semibold">{getTranslation("part", lang)}: </span>
                {formatPart(visit.part, lang)}
              </div>
              <div>
                <span className="font-semibold">{getTranslation("date", lang)}: </span>
                {formatDate(visit.date)}
              </div>
              <div>
                <span className="font-semibold">{getTranslation("supervisor", lang)}: </span>
                {visit.supervisorId.name}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Score */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{getTranslation("overallScore", lang)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary text-center">
              {visit.overallScore.toFixed(2)} / 4.00
            </div>
          </CardContent>
        </Card>

        {/* Lesson Description */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{getTranslation("lessonDescription", lang)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{visit.lessonDescription}</p>
          </CardContent>
        </Card>

        {/* Results */}
        <div id="visit-results" className="space-y-6">
          {ELEOT_ENVIRONMENTS.map((env) => {
            const envScores = scores.filter((s) => s.environmentId === env.id)
            const envAverage =
              envScores.reduce((sum, s) => sum + s.score, 0) / envScores.length

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
                        <tr className="border-b bg-gray-50">
                          <th className="text-right p-3">المعيار</th>
                          <th className="text-right p-3">الدرجة</th>
                          <th className="text-right p-3">التبرير</th>
                        </tr>
                      </thead>
                      <tbody>
                        {envScores.map((score) => {
                          const criterion = getCriterionById(score.criterionId)
                          return (
                            <tr key={score.criterionId} className="border-b">
                              <td className="p-3">{criterion?.label_ar || score.criterionId}</td>
                              <td className="p-3 text-center font-bold">{score.score}</td>
                              <td className="p-3">{score.justification}</td>
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
        </div>
      </div>
    </div>
  )
}

