export const DEBUG_SAMPLE_PAYLOADS = [
  {
    id: "rich-evidence",
    description: "Rich evidence across D/F/G",
    body: {
      lessonDescription:
        "بدأ الدرس بنشاط فكر زاوج شارك حيث ناقش الطلاب أفكارهم وعرضوا حلولهم. خلال محطات التعلم عملوا في مجموعات وتبادلوا الأدوار. الانتقال بين الأنشطة كان انتقال سلس مع مؤقت مرئي وإدارة وقت دقيقة. استخدم الطلاب أجهزة لوحية مع اختبار رقمي عبر كاهوت، ثم شاركوا في مستند مشترك لمراجعة الأقران. في النهاية، التزموا بقواعد الصف وتوقعات السلوك.",
      selectedEnvironments: ["D", "F", "G"],
      language: "ar",
    },
  },
  {
    id: "low-evidence",
    description: "Low evidence, mostly teacher-centered",
    body: {
      lessonDescription:
        "قام المعلم بشرح الدرس وقدم أمثلة على السبورة. الطلاب استمعوا للشرح ثم كتبوا الملاحظات الفردية. لم تُذكر أنشطة تفاعلية أو استخدام أدوات رقمية.",
      selectedEnvironments: ["D", "F", "G"],
      language: "ar",
    },
  },
  {
    id: "mixed-evidence-clarifications",
    description: "Medium evidence plus clarifications to test anchors",
    body: {
      lessonDescription:
        "شارك بعض الطلاب في مناقشة قصيرة ثم انتقلوا إلى مهمة جماعية بسيطة. كان الانتقال مقبولاً لكن الوقت لم يكن منظمًا طوال الحصة. استخدم الطلاب منصة تعلم مرة واحدة دون تفاصيل إضافية.",
      selectedEnvironments: ["D", "F", "G"],
      language: "ar",
      clarifications: {
        skipped: false,
        answers: {
          D1: "yes",
          F3: "no",
          G2: "yes",
        },
      },
    },
  },
  {
    id: "rich-dfg-expanded",
    description: "Expanded D/F/G evidence with roles, routines, and digital collaboration",
    body: {
      lessonDescription:
        "في مجموعات تعاونية وزّع الطلاب الأدوار بين قائد المجموعة والمتحدث والمقرر، وأنتجوا منتجًا جماعيًا. أثناء الانتقال تم استخدام مؤقت مرئي وتوقعات السلوك كانت واضحة. استخدم الطلاب كاهوت لاختبار رقمي ثم شاركوا في مستند مشترك لمراجعة الأقران.",
      selectedEnvironments: ["D", "F", "G"],
      language: "ar",
    },
  },
  {
    id: "too-short",
    description: "Short description to trigger debug no-hits reason",
    body: {
      lessonDescription: "...",
      selectedEnvironments: ["D", "F", "G"],
      language: "ar",
    },
  },
]
