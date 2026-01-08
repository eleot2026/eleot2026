import mongoose, { Schema, Document, Model } from "mongoose"

export interface IVisitEnvScore extends Document {
  visitId: mongoose.Types.ObjectId
  environmentId: string
  criterionId: string
  score: number
  justification: string
  createdAt: Date
}

const VisitEnvScoreSchema: Schema = new Schema(
  {
    visitId: {
      type: Schema.Types.ObjectId,
      ref: "Visit",
      required: true,
    },
    environmentId: {
      type: String,
      required: true,
    },
    criterionId: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    justification: {
      type: String,
      required: true,
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

VisitEnvScoreSchema.index({ visitId: 1, environmentId: 1, criterionId: 1 }, { unique: true })

const VisitEnvScore: Model<IVisitEnvScore> =
  mongoose.models.VisitEnvScore || mongoose.model<IVisitEnvScore>("VisitEnvScore", VisitEnvScoreSchema)

export default VisitEnvScore

