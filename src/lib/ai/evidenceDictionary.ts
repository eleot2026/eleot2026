type Language = "ar" | "en"

export type EvidenceDictionaryEntry = {
  strong: Record<Language, string[]>
  weak: Record<Language, string[]>
  patterns?: Partial<Record<Language, string[]>>
}

export const EVIDENCE_DICTIONARY: Record<string, EvidenceDictionaryEntry> = {
  D1: {
    strong: {
      ar: [
        "نقاش طلابي",
        "حوار طلابي",
        "تغذية راجعة بين الأقران",
        "فكر ناقش شارك",
        "عرضوا حلولهم",
        "نقاش جماعي",
        "تبادل وجهات النظر",
      ],
      en: [
        "student-led discussion",
        "peer feedback",
        "accountable talk",
        "small-group discussion",
        "share solutions",
        "student discourse",
      ],
    },
    weak: {
      ar: ["ناقشوا", "تحاوروا", "تبادلوا الآراء", "حوار", "مناقشة", "تعليقات الأقران", "عرض الأفكار"],
      en: ["students discuss", "discussion", "dialogue", "exchange ideas", "class discussion", "peer comments"],
    },
    patterns: {
      en: ["think\\s*-?pair\\s*-?share", "turn\\s*and\\s*talk", "peer\\s+feedback", "student\\s+talk"],
      ar: ["فكر\\s+زاوج\\s+شارك", "تبادلوا\\s+الآراء", "نقاش\\s+جماعي"],
    },
  },
  D2: {
    strong: {
      ar: [
        "تعلم نشط",
        "نشاط عملي",
        "محطات تعلم",
        "تعلم بالحركة",
        "لعب أدوار",
        "أنشطة تطبيقية",
        "تجارب عملية",
      ],
      en: [
        "active learning",
        "hands-on activity",
        "learning stations",
        "role play",
        "movement activity",
        "practical task",
      ],
    },
    weak: {
      ar: ["مشاركة نشطة", "تفاعلوا", "نشاط", "تحركوا", "شاركوا", "تجربة", "ممارسة"],
      en: ["participated actively", "engaged", "interactive activity", "students moved", "participation", "practice"],
    },
  },
  D3: {
    strong: {
      ar: ["استقصاء", "تحقيق", "صياغة فرضيات", "بحث ميداني", "تحليل بيانات", "جمع أدلة", "تجريب"],
      en: ["inquiry", "investigation", "formulated hypotheses", "data analysis", "research task", "gather evidence"],
    },
    weak: {
      ar: ["يسألون", "أسئلة", "استكشاف", "بحث", "يتحققون", "تقصي", "تحقق"],
      en: ["students ask questions", "questioning", "explore", "search", "investigate", "probe"],
    },
  },
  D4: {
    strong: {
      ar: [
        "عمل تعاوني",
        "تقاسم الأدوار",
        "حل جماعي",
        "بناء مشترك",
        "تعلّم تعاوني",
        "منتج جماعي",
        "قائد المجموعة",
      ],
      en: [
        "collaborative group",
        "shared roles",
        "teamwork",
        "co-constructed",
        "peer tutoring",
        "group product",
      ],
    },
    weak: {
      ar: ["تعاون", "عملوا معاً", "مجموعة", "زملاء", "شراكة", "عمل جماعي", "تبادل الأدوار"],
      en: ["collaborate", "worked together", "group work", "pairs", "team", "shared task"],
    },
    patterns: {
      ar: ["تبادل(?:وا)?\\s+الادوار", "قائد\\s+المجموعه", "منتج\\s+جماعي"],
      en: ["shared\\s+roles", "group\\s+product", "peer\\s+tutoring"],
    },
  },
  F1: {
    strong: {
      ar: [
        "أدوار واضحة",
        "روتين ثابت",
        "إجراءات الصف",
        "تنظيم المجموعات",
        "مسؤوليات محددة",
        "قواعد العمل",
        "تنظيم الأدوار",
      ],
      en: [
        "clear roles",
        "classroom routines",
        "procedures",
        "organized groups",
        "assigned responsibilities",
        "structured routine",
      ],
    },
    weak: {
      ar: ["منظمون", "يعرفون الأدوار", "إجراءات", "انضباط", "تنظيم", "مسؤوليات", "أدوار"],
      en: ["organized", "students know roles", "routines", "procedures", "structure", "roles"],
    },
    patterns: {
      ar: ["ادوار\\s+واضحه", "روتين\\s+ثابت", "اجراءات\\s+الصف"],
      en: ["clear\\s+roles", "classroom\\s+procedures", "routine(s)?\\s+in\\s+place"],
    },
  },
  F2: {
    strong: {
      ar: ["بيئة آمنة", "مسارات واضحة", "حركة آمنة", "إدارة مساحة", "سلامة أثناء الحركة", "تنقل آمن"],
      en: ["safe environment", "clear pathways", "safe movement", "managed space", "physical safety", "safe transitions"],
    },
    weak: {
      ar: ["آمن", "سلامة", "حركة منظمة", "مساحة الصف", "هدوء", "تنظيم الحركة"],
      en: ["safe", "safety", "orderly movement", "classroom space", "calm", "managed movement"],
    },
  },
  F3: {
    strong: {
      ar: ["انتقال سلس", "إدارة وقت", "مؤقت مرئي", "بدون هدر", "استمرارية العمل", "وقت تعلّم فعال"],
      en: ["smooth transition", "time on task", "visible timer", "no wasted time", "quick transitions", "efficient pacing"],
    },
    weak: {
      ar: ["انتقال", "وقت الحصة", "سلاسة", "إدارة الوقت", "استثمار الوقت", "تنظيم الوقت"],
      en: ["transition", "time management", "efficient time", "kept pace", "moved quickly", "on task"],
    },
    patterns: {
      en: ["time\\s*on\\s*task", "transition(ed)?\\s+smoothly", "exit\\s+tickets?", "(visible|clear)\\s+timer"],
      ar: ["انتقال\\s+سلس", "اداره\\s+وقت", "(مؤقت|تايمر)\\s+(مرئي|ظاهر)"],
    },
  },
  F4: {
    strong: {
      ar: [
        "توقعات واضحة",
        "قواعد الصف",
        "روتين الانضباط",
        "سلوك إيجابي",
        "التزموا بالتعليمات",
        "توقعات السلوك",
      ],
      en: [
        "clear expectations",
        "class norms",
        "behavior expectations",
        "positive behavior routines",
        "students followed rules",
      ],
    },
    weak: {
      ar: ["قواعد", "توقعات", "انضباط", "نظام", "التزموا", "سلوك"],
      en: ["rules", "expectations", "discipline", "norms", "followed directions", "behavior"],
    },
    patterns: {
      ar: ["توقعات\\s+السلوك", "قواعد\\s+الصف"],
      en: ["behavior\\s+expectations", "class\\s+rules"],
    },
  },
  G1: {
    strong: {
      ar: ["أجهزة لوحية", "أجهزة حاسوب", "استخدام التقنية", "الوصول للإنترنت", "مصادر رقمية", "أجهزة ذكية"],
      en: ["tablets", "laptops", "used technology", "internet access", "digital resources", "devices"],
    },
    weak: {
      ar: ["أجهزة", "تقنية", "رقمي", "حاسوب", "منصة", "تطبيق"],
      en: ["devices", "technology", "digital", "platform", "online", "app"],
    },
  },
  G2: {
    strong: {
      ar: ["اختبار رقمي", "محاكاة", "منصة تعلم", "نشاط رقمي تفاعلي", "تطبيق تعليمي", "تعلم رقمي"],
      en: ["digital quiz", "simulation", "learning platform", "interactive activity", "educational app", "digital learning"],
    },
    weak: {
      ar: ["كاهوت", "فورمز", "أداة رقمية", "تعلم رقمي", "نشاط عبر الإنترنت", "اختبار إلكتروني"],
      en: ["kahoot", "forms", "digital tool", "online activity", "interactive tool", "online quiz"],
    },
    patterns: {
      en: ["kahoot", "google\\s+forms?", "quiz(izz)?", "near-?pod", "interactive\\s+quiz"],
      ar: ["كاهوت", "فورمز", "اختبار\\s+رقمي", "محاكاه", "منصه\\s+تعلم"],
    },
  },
  G3: {
    strong: {
      ar: [
        "مستند مشترك",
        "تعاون رقمي",
        "مراجعة الأقران رقميا",
        "لوحة تفاعلية مشتركة",
        "عمل تعاوني رقمي",
      ],
      en: ["shared document", "digital collaboration", "online peer review", "collaborative board", "shared workspace"],
    },
    weak: {
      ar: ["تعاون عبر الإنترنت", "مشاركة ملف", "غرفة فرعية", "مستند جماعي", "مجموعة رقمية"],
      en: ["collaborative online", "shared file", "breakout room", "group online", "shared document"],
    },
    patterns: {
      en: ["shared\\s+doc(ument)?", "breakout\\s+rooms?", "padlet", "jamboard", "shared\\s+workspace"],
      ar: ["(مستند|وثيقه)\\s+(مشترك|تعاوني)", "غرف\\s+فرعيه", "بادلت", "جام\\s+بورد"],
    },
  },
}
