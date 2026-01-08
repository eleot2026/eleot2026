"use client"

import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx"
import { saveAs } from "file-saver"

export const exportToWord = async (
  data: {
    title: string
    content: Array<{ heading?: string; text: string }>
  },
  filename: string = "report.docx"
) => {
  const children = [
    new Paragraph({
      text: data.title,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.RIGHT,
    }),
    ...data.content.flatMap((item) => [
      item.heading
        ? new Paragraph({
            text: item.heading,
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.RIGHT,
          })
        : new Paragraph(""),
      new Paragraph({
        text: item.text,
        alignment: AlignmentType.RIGHT,
      }),
    ]),
  ]

  const doc = new Document({
    sections: [
      {
        children,
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  saveAs(blob, filename)
}

