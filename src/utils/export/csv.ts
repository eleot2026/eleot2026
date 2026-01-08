"use client"

export const exportToCSV = (data: any[], filename: string = "report.csv") => {
  if (data.length === 0) {
    return
  }

  const headers = Object.keys(data[0])
  const csvRows = []

  // Add headers
  csvRows.push(headers.join(","))

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header]
      if (value === null || value === undefined) {
        return ""
      }
      const stringValue = String(value).replace(/"/g, '""')
      return `"${stringValue}"`
    })
    csvRows.push(values.join(","))
  }

  const csvContent = csvRows.join("\n")
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

