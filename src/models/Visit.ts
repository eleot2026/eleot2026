import mongoose, { Schema, Document, Model } from "mongoose"

export interface ClarificationData {
  version: string
  skipped: boolean
  answers: Record<string, string>
  submittedAt: Date
}

export interface IVisit extends Document {
  teacherId?: mongoose.Types.ObjectId
  teacherName?: string // Manual text input
  supervisorId: mongoose.Types.ObjectId
  subject: string
  grade: string
  part: string[] // Multi-select: ["start", "middle", "end"]
  date: Date
  lessonDescription: string
  overallScore: number
  language: "ar" | "en"
  selectedEnvironments: string[] // Array of environment IDs (A-G)
  clarifications?: ClarificationData
  auditAdjustments?: Array<{
    criterionId: string
    originalScore: number
    adjustedScore: number
    reason: string
    timestamp: Date
  }>
  createdAt: Date
}

const VisitSchema: Schema = new Schema(
  {
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: false, // Made optional for manual input
    },
    teacherName: {
      type: String,
      required: false, // Manual text input
    },
    supervisorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
    part: {
      type: [String],
      enum: ["start", "middle", "end"],
      required: true,
      default: ["start"],
    },
    date: {
      type: Date,
      required: true,
    },
    lessonDescription: {
      type: String,
      required: true,
    },
    overallScore: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    language: {
      type: String,
      enum: ["ar", "en"],
      default: "ar",
    },
    selectedEnvironments: {
      type: [String],
      required: false,
      default: [],
    },
    clarifications: {
      version: { type: String, default: "v1" },
      skipped: { type: Boolean, default: false },
      answers: { type: Schema.Types.Mixed, default: {} },
      submittedAt: { type: Date, default: Date.now },
    },
    auditAdjustments: [
      {
        criterionId: String,
        originalScore: Number,
        adjustedScore: Number,
        reason: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

const Visit: Model<IVisit> = mongoose.models.Visit || mongoose.model<IVisit>("Visit", VisitSchema)

export default Visit

