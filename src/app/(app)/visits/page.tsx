"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTranslation } from "@/lib/i18n"
import { formatDate } from "@/utils/format"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { formatPart } from "@/utils/format"
import { Eye, Trash2 } from "lucide-react"

interface Visit {
  _id: string
  teacherId: {
    nameAr: string
    nameEn?: string
  }
  subject: string
  grade: string
  part: string
  date: string
  overallScore: number
  createdAt: string
}

export default function VisitsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const lang = "ar"
  const [visits, setVisits] = useState<Visit[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchVisits()
  }, [])

  const fetchVisits = async () => {
    try {
      const res = await fetch("/api/visits")
      const data = await res.json()
      setVisits(data)
    } catch (error) {
      console.error("Error fetching visits:", error)
      toast({
        title: "خطأ",
        description: "فشل في جلب الزيارات",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الزيارة؟")) {
      return
    }

    try {
      const res = await fetch(`/api/visits/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast({
          title: "نجح",
          description: "تم حذف الزيارة بنجاح",
        })
        fetchVisits()
      } else {
        throw new Error("Failed to delete")
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حذف الزيارة",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={getTranslation("visits", lang)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>قائمة الزيارات</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">جاري التحميل...</div>
            ) : visits.length === 0 ? (
              <div className="text-center py-8 text-gray-500">لا توجد زيارات</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-right p-3">المعلم</th>
                      <th className="text-right p-3">{getTranslation("visitNumber", lang)}</th>
                      <th className="text-right p-3">{getTranslation("subject", lang)}</th>
                      <th className="text-right p-3">{getTranslation("grade", lang)}</th>
                      <th className="text-right p-3">{getTranslation("part", lang)}</th>
                      <th className="text-right p-3">{getTranslation("date", lang)}</th>
                      <th className="text-right p-3">{getTranslation("overallScore", lang)}</th>
                      <th className="text-right p-3">{getTranslation("actions", lang)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.map((visit, index) => (
                      <tr key={visit._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{visit.teacherId.nameAr}</td>
                        <td className="p-3">{index + 1}</td>
                        <td className="p-3">{visit.subject}</td>
                        <td className="p-3">{visit.grade}</td>
                        <td className="p-3">{formatPart(visit.part, lang)}</td>
                        <td className="p-3">{formatDate(visit.date)}</td>
                        <td className="p-3 text-center font-bold">{visit.overallScore.toFixed(2)}</td>
                        <td className="p-3">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/visits/${visit._id}`)}
                            >
                              <Eye className="h-4 w-4 ml-1" />
                              {getTranslation("view", lang)}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(visit._id)}
                            >
                              <Trash2 className="h-4 w-4 ml-1" />
                              {getTranslation("delete", lang)}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

