export type Language = "ar" | "en"

export const DEFAULT_LANGUAGE: Language = "ar"

export const translations = {
  ar: {
    login: "تسجيل الدخول",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    loginWithGoogle: "تسجيل الدخول بحساب Google",
    loginWithEmail: "تسجيل الدخول بالبريد الإلكتروني",
    evaluation: "التقييم",
    visits: "الزيارات",
    training: "التدريب",
    reports: "التقارير",
    settings: "الإعدادات",
    logout: "تسجيل الخروج",
    teacher: "المعلم",
    subject: "المادة",
    grade: "الصف",
    part: "الجزء",
    supervisor: "المشرف",
    date: "التاريخ",
    lessonDescription: "وصف الحصة",
    aiEvaluation: "تقييم آلي",
    clearAll: "مسح الكل",
    overallScore: "النتيجة الإجمالية",
    recommendations: "التوصيات",
    strengths: "نقاط القوة",
    weaknesses: "نقاط الضعف",
    improvements: "اقتراحات التحسين",
    view: "عرض",
    delete: "حذف",
    exportPDF: "تصدير PDF",
    exportWord: "تصدير Word",
    exportCSV: "تصدير CSV",
    sendEmail: "إرسال بريد إلكتروني",
    copyAll: "نسخ الكل",
    start: "البداية",
    middle: "المنتصف",
    end: "النهاية",
    administrativeData: "البيانات الإدارية",
    eleotEnvironments: "بيئات ELEOT",
    results: "النتائج",
    save: "حفظ",
    cancel: "إلغاء",
    actions: "الإجراءات",
    visitNumber: "رقم الزيارة",
    filter: "تصفية",
    filterByTeacher: "تصفية حسب المعلم",
    filterByDate: "تصفية حسب التاريخ",
    filterBySubject: "تصفية حسب المادة",
    filterByGrade: "تصفية حسب الصف",
    totalVisits: "عدد الزيارات",
    averageScore: "متوسط الدرجة",
    highestEnvironment: "أعلى بيئة",
    lowestEnvironment: "أقل بيئة",
    comparison: "المقارنة",
    exportReport: "تصدير التقرير",
  },
  en: {
    login: "Login",
    email: "Email",
    password: "Password",
    loginWithGoogle: "Login with Google",
    loginWithEmail: "Login with Email",
    evaluation: "Evaluation",
    visits: "Visits",
    training: "Training",
    reports: "Reports",
    settings: "Settings",
    logout: "Logout",
    teacher: "Teacher",
    subject: "Subject",
    grade: "Grade",
    part: "Part",
    supervisor: "Supervisor",
    date: "Date",
    lessonDescription: "Lesson Description",
    aiEvaluation: "AI Evaluation",
    clearAll: "Clear All",
    overallScore: "Overall Score",
    recommendations: "Recommendations",
    strengths: "Strengths",
    weaknesses: "Weaknesses",
    improvements: "Improvement Suggestions",
    view: "View",
    delete: "Delete",
    exportPDF: "Export PDF",
    exportWord: "Export Word",
    exportCSV: "Export CSV",
    sendEmail: "Send Email",
    copyAll: "Copy All",
    start: "Start",
    middle: "Middle",
    end: "End",
    administrativeData: "Administrative Data",
    eleotEnvironments: "ELEOT Environments",
    results: "Results",
    save: "Save",
    cancel: "Cancel",
    actions: "Actions",
    visitNumber: "Visit Number",
    filter: "Filter",
    filterByTeacher: "Filter by Teacher",
    filterByDate: "Filter by Date",
    filterBySubject: "Filter by Subject",
    filterByGrade: "Filter by Grade",
    totalVisits: "Total Visits",
    averageScore: "Average Score",
    highestEnvironment: "Highest Environment",
    lowestEnvironment: "Lowest Environment",
    comparison: "Comparison",
    exportReport: "Export Report",
  },
}

export const getTranslation = (key: string, lang: Language = DEFAULT_LANGUAGE): string => {
  return translations[lang][key as keyof typeof translations.ar] || key
}

export const getDir = (lang: Language): "rtl" | "ltr" => {
  return lang === "ar" ? "rtl" : "ltr"
}

export function formatDate(
  dateInput: string | number | Date,
  locale: string = "ar-SA"
) {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput)

  // تنسيق واضح ومناسب للتقارير
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)
}

