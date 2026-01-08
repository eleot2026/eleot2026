"use client"

import { Header } from "@/components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getTranslation } from "@/lib/i18n"
import { FileText, Download } from "lucide-react"

export default function TrainingPage() {
  const lang = "ar"

  const trainingFiles = [
    {
      id: 1,
      title: "دليل استخدام أداة ELEOT",
      description: "دليل شامل لاستخدام أداة المراقبة الذكية",
      type: "PDF",
    },
    {
      id: 2,
      title: "مثال على تقييم كامل",
      description: "مثال عملي على تقييم حصة دراسية",
      type: "PDF",
    },
    {
      id: 3,
      title: "معايير التقييم",
      description: "شرح تفصيلي لجميع معايير التقييم",
      type: "PDF",
    },
  ]

  const handleOpenFile = (fileId: number) => {
    // TODO: Implement file opening logic
    alert(`فتح الملف ${fileId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={getTranslation("training", lang)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">تدريب على أداة الملاحظة ELEOT</h2>
          <p className="text-gray-600">
            يمكنك الاطلاع على الملفات التدريبية التالية لفهم كيفية استخدام الأداة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainingFiles.map((file) => (
            <Card key={file.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <FileText className="h-8 w-8 text-primary" />
                  <span className="text-sm text-gray-500">{file.type}</span>
                </div>
                <CardTitle className="mt-4">{file.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{file.description}</p>
                <div className="flex gap-2">
                  <Button onClick={() => handleOpenFile(file.id)} className="flex-1">
                    فتح
                  </Button>
                  <Button variant="outline" onClick={() => handleOpenFile(file.id)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

