import connectDB from "../lib/db"
import User from "../models/User"
import Teacher from "../models/Teacher"
import bcrypt from "bcryptjs"

async function seed() {
  try {
    await connectDB()
    console.log("Connected to MongoDB")

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await User.deleteMany({})
    // await Teacher.deleteMany({})

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10)
    const admin = await User.findOneAndUpdate(
      { email: "admin@eleot.com" },
      {
        name: "مدير النظام",
        email: "admin@eleot.com",
        passwordHash: adminPassword,
        role: "admin",
      },
      { upsert: true, new: true }
    )
    console.log("Admin user created/updated:", admin.email)

    // Create supervisor user
    const supervisorPassword = await bcrypt.hash("supervisor123", 10)
    const supervisor = await User.findOneAndUpdate(
      { email: "supervisor@eleot.com" },
      {
        name: "مشرف تقييم",
        email: "supervisor@eleot.com",
        passwordHash: supervisorPassword,
        role: "supervisor",
      },
      { upsert: true, new: true }
    )
    console.log("Supervisor user created/updated:", supervisor.email)

    // Create sample teachers
    const teachers = [
      {
        nameAr: "أحمد محمد علي",
        nameEn: "Ahmed Mohammed Ali",
        subject: "الرياضيات",
        stage: "الثانوي",
        isActive: true,
      },
      {
        nameAr: "فاطمة إبراهيم",
        nameEn: "Fatima Ibrahim",
        subject: "العلوم",
        stage: "المتوسط",
        isActive: true,
      },
      {
        nameAr: "خالد عبدالله",
        nameEn: "Khalid Abdullah",
        subject: "اللغة العربية",
        stage: "الابتدائي",
        isActive: true,
      },
      {
        nameAr: "سارة حسن",
        nameEn: "Sara Hassan",
        subject: "اللغة الإنجليزية",
        stage: "الثانوي",
        isActive: true,
      },
      {
        nameAr: "محمد سالم",
        nameEn: "Mohammed Salem",
        subject: "التاريخ",
        stage: "المتوسط",
        isActive: true,
      },
    ]

    for (const teacherData of teachers) {
      const teacher = await Teacher.findOneAndUpdate(
        { nameAr: teacherData.nameAr },
        teacherData,
        { upsert: true, new: true }
      )
      console.log("Teacher created/updated:", teacher.nameAr)
    }

    console.log("Seed completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seed()

