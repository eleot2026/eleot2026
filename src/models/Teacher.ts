import mongoose, { Schema, Document, Model } from "mongoose"

export interface ITeacher extends Document {
  nameAr: string
  nameEn?: string
  subject?: string
  stage?: string
  isActive: boolean
  createdAt: Date
}

const TeacherSchema: Schema = new Schema(
  {
    nameAr: {
      type: String,
      required: true,
    },
    nameEn: {
      type: String,
    },
    subject: {
      type: String,
    },
    stage: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

const Teacher: Model<ITeacher> = mongoose.models.Teacher || mongoose.model<ITeacher>("Teacher", TeacherSchema)

export default Teacher

