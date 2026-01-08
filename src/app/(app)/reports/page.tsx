"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getTranslation, formatDate } from "@/lib/i18n"
import { useToast } from "@/hooks/use-toast"
import { exportToCSV } from "@/utils/export/csv"
import { FileDown } from "lucide-react"
import { formatPart } from "@/utils/format"
import { ELEOT_ENVIRONMENTS } from "@/config/eleotConfig"

interface Teacher {
  _id: string
  nameAr: string
}

interface VisitReport {
  _id: string
  teacherId: {
    nameAr: string
  }
  subject: string
  grade: string
  part: string
  date: string
  overallScore: number
  scores: Array<{
    environmentId: string
    criterionId: string
    score: number
  }>
}

export default function ReportsPage() {
  const { toast } = useToast()
  const lang = "ar"
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [selectedTeacherId, setSelectedTeacherId] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [subject, setSubject] = useState("")
  const [grade, setGrade] = useState("")
  const [reports, setReports] = useState<VisitReport[]>([])
  const [isLoading, setIsLoading] = useState(false)

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

  const handleFilter = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedTeacherId) params.append("teacherId", selectedTeacherId)
      if (startDate) params.append("startDate", startDate)
      if (endDate) params.append("endDate", endDate)
      if (subject) params.append("subject", subject)
      if (grade) params.append("grade", grade)

      const res = await fetch(`/api/reports?${params.toString()}`)
      const data = await res.json()
      setReports(data)
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في جلب التقارير",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    const csvData = reports.map((report) => ({
      المعلم: report.teacherId.nameAr,
      المادة: report.subject,
      الصف: report.grade,
      الجزء: formatPart(report.part, lang),
      التاريخ: formatDate(report.date),
      "النتيجة الإجمالية": report.overallScore.toFixed(2),
    }))

    exportToCSV(csvData, "reports.csv")
    toast({
      title: "نجح",
      description: "تم تصدير التقرير بنجاح",
    })
  }

  // Calculate KPIs
  const totalVisits = reports.length
  const averageScore =
    reports.length > 0
      ? reports.reduce((sum, r) => sum + r.overallScore, 0) / reports.length
      : 0

  const environmentScores: Record<string, number[]> = {}
  ELEOT_ENVIRONMENTS.forEach((env) => {
    environmentScores[env.id] = []
  })

  reports.forEach((report) => {
    report.scores.forEach((score) => {
      if (environmentScores[score.environmentId]) {
        environmentScores[score.environmentId].push(score.score)
      }
    })
  })

  const environmentAverages: Record<string, number> = {}
  Object.keys(environmentScores).forEach((envId) => {
    const scores = environmentScores[envId]
    environmentAverages[envId] =
      scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0
  })

  const highestEnv =
    Object.keys(environmentAverages).length > 0
      ? Object.keys(environmentAverages).reduce((a, b) =>
          environmentAverages[a] > environmentAverages[b] ? a : b
        )
      : null

  const lowestEnv =
    Object.keys(environmentAverages).length > 0
      ? Object.keys(environmentAverages).reduce((a, b) =>
          environmentAverages[a] < environmentAverages[b] ? a : b
        )
      : null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={getTranslation("reports", lang)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{getTranslation("filter", lang)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>{getTranslation("filterByTeacher", lang)}</Label>
                <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
                  <SelectTrigger>
                    <SelectValue placeholder="جميع المعلمين" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">جميع المعلمين</SelectItem>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher._id} value={teacher._id}>
                        {teacher.nameAr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{getTranslation("filterByDate", lang)} - من</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>{getTranslation("filterByDate", lang)} - إلى</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>{getTranslation("filterBySubject", lang)}</Label>
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>{getTranslation("filterByGrade", lang)}</Label>
                <Input value={grade} onChange={(e) => setGrade(e.target.value)} />
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <Button onClick={handleFilter} disabled={isLoading}>
                {isLoading ? "جاري التحميل..." : getTranslation("filter", lang)}
              </Button>
              {reports.length > 0 && (
                <Button onClick={handleExport} variant="outline">
                  <FileDown className="h-4 w-4 ml-2" />
                  {getTranslation("exportReport", lang)}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* KPIs */}
        {reports.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{getTranslation("totalVisits", lang)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{totalVisits}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{getTranslation("averageScore", lang)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{averageScore.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{getTranslation("highestEnvironment", lang)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {highestEnv ? `${highestEnv} (${environmentAverages[highestEnv].toFixed(2)})` : "-"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{getTranslation("lowestEnvironment", lang)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {lowestEnv ? `${lowestEnv} (${environmentAverages[lowestEnv].toFixed(2)})` : "-"}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reports Table */}
        {reports.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>التقرير التفصيلي</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-right p-3">المعلم</th>
                      <th className="text-right p-3">{getTranslation("subject", lang)}</th>
                      <th className="text-right p-3">{getTranslation("grade", lang)}</th>
                      <th className="text-right p-3">{getTranslation("part", lang)}</th>
                      <th className="text-right p-3">{getTranslation("date", lang)}</th>
                      <th className="text-right p-3">{getTranslation("overallScore", lang)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr key={report._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{report.teacherId.nameAr}</td>
                        <td className="p-3">{report.subject}</td>
                        <td className="p-3">{report.grade}</td>
                        <td className="p-3">{formatPart(report.part, lang)}</td>
                        <td className="p-3">{formatDate(report.date)}</td>
                        <td className="p-3 text-center font-bold">{report.overallScore.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {reports.length === 0 && !isLoading && (
          <Card>
            <CardContent className="text-center py-8 text-gray-500">
              لا توجد تقارير. استخدم الفلاتر للبحث عن التقارير.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

