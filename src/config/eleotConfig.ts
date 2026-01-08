export interface Criterion {
  id: string
  code: string
  label_ar: string
  label_en: string
  description_ar?: string
  description_en?: string
}

export interface Environment {
  id: string
  key: string
  label_ar: string
  label_en: string
  arName: string
  enName: string
  badgeStyle?: string
  criteria: Criterion[]
}

export const ELEOT_SECTIONS: Environment[] = [
  {
    id: "A",
    key: "A",
    label_ar: "التعلم العادل",
    label_en: "Equitable Learning",
    arName: "التعلم العادل",
    enName: "Equitable Learning",
    badgeStyle: "bg-blue-500",
    criteria: [
      {
        id: "A1",
        code: "A1",
        label_ar: "المتعلمون يشاركون في فرص وأنشطة تعلم متمايزة تلبي احتياجاتهم",
        label_en: "Learners engage in differentiated learning opportunities and/or activities that meet their needs",
      },
      {
        id: "A2",
        code: "A2",
        label_ar: "المتعلمون لديهم وصول متساو إلى مناقشات الفصل والأنشطة والموارد والتكنولوجيا والدعم",
        label_en: "Learners have equal access to classroom discussions, activities, resources, technology, and support",
      },
      {
        id: "A3",
        code: "A3",
        label_ar: "المتعلمون يُعاملون بطريقة عادلة وواضحة ومتسقة",
        label_en: "Learners are treated in a fair, clear and consistent manner",
      },
      {
        id: "A4",
        code: "A4",
        label_ar: "المتعلمون يظهرون و/أو لديهم فرص لتطوير التعاطف/الاحترام/التقدير للاختلافات في القدرات والمواهب والخلفيات والثقافات و/أو الخصائص والظروف والتصرفات البشرية الأخرى",
        label_en: "Learners demonstrate and/or have opportunities to develop empathy/respect/appreciation for differences in abilities, aptitudes, backgrounds, cultures, and/or other human characteristics, conditions and dispositions",
      },
    ],
  },
  {
    id: "B",
    key: "B",
    label_ar: "التوقعات العالية",
    label_en: "High Expectations",
    arName: "التوقعات العالية",
    enName: "High Expectations",
    badgeStyle: "bg-green-500",
    criteria: [
      {
        id: "B1",
        code: "B1",
        label_ar: "المتعلمون يسعون للوفاء أو قادرون على التعبير عن التوقعات العالية التي وضعوها بأنفسهم و/أو المعلم",
        label_en: "Learners strive to meet or are able to articulate the high expectations established by themselves and/or the teacher",
      },
      {
        id: "B2",
        code: "B2",
        label_ar: "المتعلمون يشاركون في أنشطة وتعلم صعب ولكن قابل للتحقيق",
        label_en: "Learners engage in activities and learning that are challenging but attainable",
      },
      {
        id: "B3",
        code: "B3",
        label_ar: "المتعلمون يظهرون و/أو قادرون على وصف عمل عالي الجودة",
        label_en: "Learners demonstrate and/or are able to describe high quality work",
      },
      {
        id: "B4",
        code: "B4",
        label_ar: "المتعلمون يشاركون في عمل أكاديمي صارم ومناقشات و/أو مهام تتطلب استخدام التفكير عالي المستوى (مثل: التحليل، التطبيق، التقييم، التركيب)",
        label_en: "Learners engage in rigorous coursework, discussions, and/or tasks that require the use of higher order thinking (e.g., analyzing, applying, evaluating, synthesizing)",
      },
      {
        id: "B5",
        code: "B5",
        label_ar: "المتعلمون يتحملون المسؤولية ويكونون موجهين ذاتياً في تعلمهم",
        label_en: "Learners take responsibility for and are self-directed in their learning",
      },
    ],
  },
  {
    id: "C",
    key: "C",
    label_ar: "التعلم الداعم",
    label_en: "Supportive Learning",
    arName: "التعلم الداعم",
    enName: "Supportive Learning",
    badgeStyle: "bg-purple-500",
    criteria: [
      {
        id: "C1",
        code: "C1",
        label_ar: "المتعلمون يظهرون إحساساً بالمجتمع إيجابياً ومتماسكاً ومشاركاً وهادفاً",
        label_en: "Learners demonstrate a sense of community that is positive, cohesive, engaged, and purposeful",
      },
      {
        id: "C2",
        code: "C2",
        label_ar: "المتعلمون يخاطرون في التعلم (بدون خوف من ردود فعل سلبية)",
        label_en: "Learners take risks in learning (without fear of negative feedback)",
      },
      {
        id: "C3",
        code: "C3",
        label_ar: "المتعلمون مدعومون من المعلم وأقرانهم و/أو موارد أخرى لفهم المحتوى وإنجاز المهام",
        label_en: "Learners are supported by the teacher, their peers and/or other resources to understand content and accomplish tasks",
      },
      {
        id: "C4",
        code: "C4",
        label_ar: "المتعلمون يظهرون علاقة ودية وداعمة مع معلمهم",
        label_en: "Learners demonstrate a congenial and supportive relationship with their teacher",
      },
    ],
  },
  {
    id: "D",
    key: "D",
    label_ar: "التعلم النشط",
    label_en: "Active Learning",
    arName: "التعلم النشط",
    enName: "Active Learning",
    badgeStyle: "bg-yellow-500",
    criteria: [
      {
        id: "D1",
        code: "D1",
        label_ar: "مناقشات/حوارات/تبادلات المتعلمين مع بعضهم البعض ومع المعلم تسود",
        label_en: "Learners' discussions/dialogues/exchanges with each other and the teacher predominate",
      },
      {
        id: "D2",
        code: "D2",
        label_ar: "المتعلمون يربطون المحتوى بتجارب الحياة الواقعية",
        label_en: "Learners make connections from content to real-life experiences",
      },
      {
        id: "D3",
        code: "D3",
        label_ar: "المتعلمون مشاركون بنشاط في أنشطة التعلم",
        label_en: "Learners are actively engaged in the learning activities",
      },
      {
        id: "D4",
        code: "D4",
        label_ar: "المتعلمون يتعاونون مع أقرانهم لإنجاز/إكمال المشاريع والأنشطة والمهام و/أو الواجبات",
        label_en: "Learners collaborate with their peers to accomplish/complete projects, activities, tasks and/or assignments",
      },
    ],
  },
  {
    id: "E",
    key: "E",
    label_ar: "مراقبة التقدم والتغذية الراجعة",
    label_en: "Progress Monitoring & Feedback",
    arName: "مراقبة التقدم والتغذية الراجعة",
    enName: "Progress Monitoring & Feedback",
    badgeStyle: "bg-indigo-500",
    criteria: [
      {
        id: "E1",
        code: "E1",
        label_ar: "المتعلمون يراقبون تقدمهم في التعلم أو لديهم آليات يتم من خلالها مراقبة تقدمهم في التعلم",
        label_en: "Learners monitor their own learning progress or have mechanisms whereby their learning progress is monitored",
      },
      {
        id: "E2",
        code: "E2",
        label_ar: "المتعلمون يتلقون/يستجيبون للتغذية الراجعة (من المعلمين/الأقران/موارد أخرى) لتحسين الفهم و/أو المراجعة",
        label_en: "Learners receive/respond to feedback (from teachers/peers/other resources) to improve understanding and/or revise",
      },
      {
        id: "E3",
        code: "E3",
        label_ar: "المتعلمون يظهرون و/أو يعبرون شفهياً عن فهم الدرس/المحتوى",
        label_en: "Learners demonstrate and/or verbalize understanding of the lesson/content",
      },
      {
        id: "E4",
        code: "E4",
        label_ar: "المتعلمون يفهمون و/أو قادرون على شرح كيفية تقييم عملهم",
        label_en: "Learners understand and/or are able to explain how their work is assessed",
      },
    ],
  },
  {
    id: "F",
    key: "F",
    label_ar: "التعلم المدار جيداً",
    label_en: "Well-Managed Learning",
    arName: "التعلم المدار جيداً",
    enName: "Well-Managed Learning",
    badgeStyle: "bg-teal-500",
    criteria: [
      {
        id: "F1",
        code: "F1",
        label_ar: "المتعلمون يتحدثون ويتفاعلون باحترام مع المعلم(ين) ومع بعضهم البعض",
        label_en: "Learners speak and interact respectfully with teacher(s) and each other",
      },
      {
        id: "F2",
        code: "F2",
        label_ar: "المتعلمون يظهرون معرفة و/أو يتبعون قواعد الفصل وتوقعات السلوك ويعملون بشكل جيد مع الآخرين",
        label_en: "Learners demonstrate knowledge of and/or follow classroom rules and behavioral expectations and work well with others",
      },
      {
        id: "F3",
        code: "F3",
        label_ar: "المتعلمون ينتقلون بسلاسة وكفاءة من نشاط إلى آخر",
        label_en: "Learners transition smoothly and efficiently from one activity to another",
      },
      {
        id: "F4",
        code: "F4",
        label_ar: "المتعلمون يستخدمون وقت الفصل بشكل هادف مع الحد الأدنى من الوقت الضائع أو الاضطرابات",
        label_en: "Learners use class time purposefully with minimal wasted time or disruptions",
      },
    ],
  },
  {
    id: "G",
    key: "G",
    label_ar: "التعلم الرقمي",
    label_en: "Digital Learning",
    arName: "التعلم الرقمي",
    enName: "Digital Learning",
    badgeStyle: "bg-pink-500",
    criteria: [
      {
        id: "G1",
        code: "G1",
        label_ar: "المتعلمون يستخدمون أدوات/تكنولوجيا رقمية لجمع وتقييم و/أو استخدام المعلومات للتعلم",
        label_en: "Learners use digital tools/technology to gather, evaluate, and/or use information for learning",
      },
      {
        id: "G2",
        code: "G2",
        label_ar: "المتعلمون يستخدمون أدوات/تكنولوجيا رقمية لإجراء البحوث وحل المشكلات و/أو إنشاء أعمال أصلية للتعلم",
        label_en: "Learners use digital tools/technology to conduct research, solve problems, and/or create original works for learning",
      },
      {
        id: "G3",
        code: "G3",
        label_ar: "المتعلمون يستخدمون أدوات/تكنولوجيا رقمية للتواصل و/أو العمل التعاوني للتعلم",
        label_en: "Learners use digital tools/technology to communicate and/or work collaboratively for learning",
      },
    ],
  },
]

export const ELEOT_ENVIRONMENTS = ELEOT_SECTIONS

// Export environments in the required format
export const environments = ELEOT_SECTIONS.map((env) => ({
  key: env.key || env.id,
  arName: env.arName || env.label_ar,
  enName: env.enName || env.label_en,
  badgeStyle: env.badgeStyle || "bg-gray-500",
}))

// Export criteria by environment
export const criteriaByEnv: Record<string, Array<{ code: string; ar: string; en: string }>> = {}
ELEOT_SECTIONS.forEach((env) => {
  criteriaByEnv[env.key || env.id] = env.criteria.map((c) => ({
    code: c.code || c.id,
    ar: c.label_ar,
    en: c.label_en,
  }))
})

export const JUSTIFICATION_TEMPLATES: Record<string, { ar: string; en: string }> = {
  "4": {
    ar: "كان الأداء متميزاً ومتسقاً في جميع الجوانب. أظهر المعلم/الطلاب مستوى عالياً من الفهم والتطبيق.",
    en: "Performance was outstanding and consistent across all aspects. Teacher/students demonstrated high levels of understanding and application.",
  },
  "3": {
    ar: "كان الأداء جيداً ومتوافقاً مع المعايير المتوقعة. هناك بعض المجالات التي يمكن تحسينها.",
    en: "Performance was good and met expected standards. There are some areas for improvement.",
  },
  "2": {
    ar: "الأداء يحتاج إلى تحسين. بعض الجوانب موجودة ولكن تحتاج إلى مزيد من التطوير.",
    en: "Performance needs improvement. Some aspects are present but need further development.",
  },
  "1": {
    ar: "الأداء غير ملحوظ أو غير موجود. يحتاج إلى تدخل فوري.",
    en: "Performance is not observed or absent. Immediate intervention needed.",
  },
}

export const getAllCriteria = (): Criterion[] => {
  return ELEOT_SECTIONS.flatMap((env) => env.criteria)
}

export const getEnvironmentById = (id: string): Environment | undefined => {
  return ELEOT_SECTIONS.find((env) => env.id === id)
}

export const getCriterionById = (id: string): Criterion | undefined => {
  for (const env of ELEOT_SECTIONS) {
    const criterion = env.criteria.find((c) => c.id === id || c.code === id)
    if (criterion) return criterion
  }
  return undefined
}

export const getCriterionByCode = (code: string): Criterion | undefined => {
  for (const env of ELEOT_SECTIONS) {
    const criterion = env.criteria.find((c) => c.code === code || c.id === code)
    if (criterion) return criterion
  }
  return undefined
}

