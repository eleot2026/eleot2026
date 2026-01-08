export interface ClarificationQuestion {
  id: string
  criterionId: string // Which criterion this question relates to
  environmentId: string
  question_ar: string
  question_en: string
  options: Array<{
    value: string
    label_ar: string
    label_en: string
  }>
}

export const CLARIFICATION_QUESTIONS: ClarificationQuestion[] = [
  // Environment A: Equitable Learning
  {
    id: "A1_differentiated",
    criterionId: "A1",
    environmentId: "A",
    question_ar: "هل شارك الطلاب في أنشطة تعلم متمايزة تلبي احتياجاتهم المختلفة؟",
    question_en: "Did learners engage in differentiated learning activities that met their different needs?",
    options: [
      { value: "yes_differentiated", label_ar: "نعم، كانت الأنشطة متمايزة", label_en: "Yes, activities were differentiated" },
      { value: "no_same_activities", label_ar: "لا، نفس الأنشطة للجميع", label_en: "No, same activities for all" },
      { value: "unclear", label_ar: "غير واضح", label_en: "Unclear" },
    ],
  },
  {
    id: "A2_access",
    criterionId: "A2",
    environmentId: "A",
    question_ar: "هل تمكن جميع الطلاب من الوصول إلى التكنولوجيا/الموارد أو الدعم الفردي من المعلم بشكل متساو؟",
    question_en: "Did all students have equal access to technology/resources or individual support from the teacher?",
    options: [
      { value: "yes_equal", label_ar: "نعم، متساو للجميع", label_en: "Yes, equal for all" },
      { value: "no_unequal", label_ar: "لا، غير متساو", label_en: "No, unequal" },
      { value: "unclear", label_ar: "غير واضح", label_en: "Unclear" },
    ],
  },
  {
    id: "A3_fair",
    criterionId: "A3",
    environmentId: "A",
    question_ar: "هل كانت معاملة المعلم للطلاب عادلة وواضحة ومتسقة مع الجميع؟",
    question_en: "Was the teacher's treatment of students fair, clear, and consistent with everyone?",
    options: [
      { value: "yes_fair", label_ar: "نعم، عادلة ومتسقة", label_en: "Yes, fair and consistent" },
      { value: "no_inconsistent", label_ar: "لا، غير متسقة", label_en: "No, inconsistent" },
      { value: "unclear", label_ar: "غير واضح", label_en: "Unclear" },
    ],
  },
  {
    id: "A4_respect",
    criterionId: "A4",
    environmentId: "A",
    question_ar: "هل أظهر المعلم والطلاب احتراماً وتعاطفاً مع الاختلافات بين الطلاب (ثقافية، قدرات، خلفيات)؟",
    question_en: "Did the teacher and students show respect and empathy for differences among students (cultural, abilities, backgrounds)?",
    options: [
      { value: "yes_respect", label_ar: "نعم، كان هناك احترام واضح", label_en: "Yes, clear respect" },
      { value: "no_not_clear", label_ar: "لا، لم يكن واضحاً", label_en: "No, not clear" },
      { value: "unclear", label_ar: "غير واضح", label_en: "Unclear" },
    ],
  },
  // Environment B: High Expectations
  {
    id: "B1_articulate_expectations",
    criterionId: "B1",
    environmentId: "B",
    question_ar: "هل كان الطلاب قادرين على التعبير عن التوقعات العالية (أهدافهم أو توقعات المعلم)؟",
    question_en: "Were learners able to articulate the high expectations (their goals or teacher's expectations)?",
    options: [
      { value: "yes_articulated", label_ar: "نعم، عبروا عن التوقعات", label_en: "Yes, articulated expectations" },
      { value: "no_not_articulated", label_ar: "لا، لم يعبروا", label_en: "No, did not articulate" },
      { value: "unclear", label_ar: "غير واضح", label_en: "Unclear" },
    ],
  },
  {
    id: "B2_challenge",
    criterionId: "B2",
    environmentId: "B",
    question_ar: "هل كانت الأنشطة صعبة ولكن قابلة للتحقيق (ليست سهلة جداً ولا صعبة جداً)؟",
    question_en: "Were the activities challenging but attainable (not too easy and not too difficult)?",
    options: [
      { value: "yes_challenging", label_ar: "نعم، صعبة وقابلة للتحقيق", label_en: "Yes, challenging and attainable" },
      { value: "too_easy", label_ar: "سهلة جداً", label_en: "Too easy" },
      { value: "too_difficult", label_ar: "صعبة جداً", label_en: "Too difficult" },
      { value: "unclear", label_ar: "غير واضح", label_en: "Unclear" },
    ],
  },
  {
    id: "B3_quality_work",
    criterionId: "B3",
    environmentId: "B",
    question_ar: "هل أظهر الطلاب أو وصفوا عملاً عالي الجودة (معايير، أمثلة، روبريك)؟",
    question_en: "Did learners demonstrate or describe high quality work (standards, exemplars, rubrics)?",
    options: [
      { value: "yes_quality", label_ar: "نعم، أظهروا عملاً عالي الجودة", label_en: "Yes, demonstrated quality work" },
      { value: "no_low_quality", label_ar: "لا، الجودة منخفضة", label_en: "No, low quality" },
      { value: "unclear", label_ar: "غير واضح", label_en: "Unclear" },
    ],
  },
  {
    id: "B4_higher_order",
    criterionId: "B4",
    environmentId: "B",
    question_ar: "هل شارك الطلاب في مهام تتطلب تفكيراً عالي المستوى (تحليل، تطبيق، تقييم، تركيب)؟",
    question_en: "Did learners engage in tasks requiring higher order thinking (analyzing, applying, evaluating, synthesizing)?",
    options: [
      { value: "yes_higher_order", label_ar: "نعم، تفكير عالي المستوى", label_en: "Yes, higher order thinking" },
      { value: "no_lower_order", label_ar: "لا، تفكير منخفض المستوى", label_en: "No, lower order thinking" },
      { value: "unclear", label_ar: "غير واضح", label_en: "Unclear" },
    ],
  },
  {
    id: "B5_self_directed",
    criterionId: "B5",
    environmentId: "B",
    question_ar: "هل تحمل الطلاب المسؤولية وكانوا موجهين ذاتياً في تعلمهم (خيارات، قرارات، تخطيط)؟",
    question_en: "Did learners take responsibility and were self-directed in their learning (choices, decisions, planning)?",
    options: [
      { value: "yes_self_directed", label_ar: "نعم، موجهون ذاتياً", label_en: "Yes, self-directed" },
      { value: "no_teacher_directed", label_ar: "لا، موجهون من المعلم فقط", label_en: "No, teacher-directed only" },
      { value: "unclear", label_ar: "غير واضح", label_en: "Unclear" },
    ],
  },
  // Environment C: Supportive Learning
  {
    id: "C1_community",
    criterionId: "C1",
    environmentId: "C",
    question_ar: "هل أظهر الطلاب إحساساً بالمجتمع إيجابياً ومتماسكاً وهادفاً (تعاون، دعم، هدف مشترك)؟",
    question_en: "Did learners demonstrate a positive, cohesive, purposeful sense of community (cooperation, support, shared purpose)?",
    options: [
      { value: "yes_community", label_ar: "نعم، مجتمع قوي", label_en: "Yes, strong community" },
      { value: "no_weak_community", label_ar: "لا، مجتمع ضعيف", label_en: "No, weak community" },
      { value: "unclear", label_ar: "غير واضح", label_en: "Unclear" },
    ],
  },
  {
    id: "C2_risk_taking",
    criterionId: "C2",
    environmentId: "C",
    question_ar: "هل كان الطلاب يشعرون بالأمان لطرح أسئلة أو مشاركة أفكار غير مؤكدة دون خوف من الخطأ؟",
    question_en: "Did learners take risks in learning without fear of negative feedback?",
    options: [
      { value: "yes_safe", label_ar: "نعم، كانوا يشعرون بالأمان", label_en: "Yes, felt safe" },
      { value: "no_not_safe", label_ar: "لا، كانوا خائفين", label_en: "No, were afraid" },
      { value: "unclear", label_ar: "غير واضح", label_en: "Unclear" },
    ],
  },
  {
    id: "C3_support",
    criterionId: "C3",
    environmentId: "C",
    question_ar: "هل دعم المعلم والأقران والموارد الطلاب لفهم المحتوى وإنجاز المهام؟",
    question_en: "Were learners supported by teacher, peers, and/or resources to understand content and accomplish tasks?",
    options: [
      { value: "yes_supported", label_ar: "نعم، كان هناك دعم واضح", label_en: "Yes, clear support" },
      { value: "no_no_support", label_ar: "لا، لم يكن هناك دعم", label_en: "No support" },
      { value: "unclear", label_ar: "غير واضح", label_en: "Unclear" },
    ],
  },
  {
    id: "C4_teacher_relationship",
    criterionId: "C4",
    environmentId: "C",
    question_ar: "هل أظهر الطلاب علاقة ودية وداعمة مع المعلم (احترام متبادل، ثقة، تفاعل إيجابي)؟",
    question_en: "Did learners demonstrate a congenial and supportive relationship with their teacher (mutual respect, trust, positive interaction)?",
    options: [
      { value: "yes_positive", label_ar: "نعم، علاقة إيجابية", label_en: "Yes, positive relationship" },
      { value: "no_negative", label_ar: "لا، علاقة سلبية", label_en: "No, negative relationship" },
      { value: "unclear", label_ar: "غير واضح", label_en: "Unclear" },
    ],
  },
  // Environment D: Active Learning
  {
    id: "D1_discussions",
    criterionId: "D1",
    environmentId: "D",
    question_ar: "هل سادت مناقشات/حوارات/تبادلات الطلاب مع بعضهم البعض ومع المعلم (الطلاب يتحدثون أكثر من المعلم)؟",
    question_en: "Did learners' discussions/dialogues/exchanges with each other and the teacher predominate (learners speaking more than teacher)?",
    options: [
      { value: "yes_predominate", label_ar: "نعم، مناقشات الطلاب سائدة", label_en: "Yes, learner discussions predominate" },
      { value: "no_teacher_talks", label_ar: "لا، المعلم يتحدث أكثر", label_en: "No, teacher talks more" },
      { value: "unclear", label_ar: "غير واضح", label_en: "Unclear" },
    ],
  },
  {
    id: "D2_real_life",
    criterionId: "D2",
    environmentId: "D",
    question_ar: "هل ربط الطلاب المحتوى بتجارب الحياة الواقعية (أمثلة، تطبيقات، مواقف حقيقية)؟",
    question_en: "Did learners make connections from content to real-life experiences (examples, applications, real situations)?",
    options: [
      { value: "yes_connected", label_ar: "نعم، ربطوا بالمحياة الواقعية", label_en: "Yes, connected to real life" },
      { value: "no_no_connection", label_ar: "لا، لا يوجد ربط", label_en: "No connection" },
      { value: "unclear", label_ar: "غير واضح", label_en: "Unclear" },
    ],
  },
  {
    id: "D3_active_engagement",
    criterionId: "D3",
    environmentId: "D",
    question_ar: "هل كان الطلاب مشاركين بنشاط في الأنشطة (مناقشة، عمل، تفاعل) وليسوا مجرد مستمعين؟",
    question_en: "Were learners actively engaged in learning activities (discussion, work, interaction) and not just listeners?",
    options: [
      { value: "yes_active", label_ar: "نعم، كانوا نشطين", label_en: "Yes, were active" },
      { value: "no_passive", label_ar: "لا، كانوا مستمعين فقط", label_en: "No, just listeners" },
      { value: "unclear", label_ar: "غير واضح", label_en: "Unclear" },
    ],
  },
  {
    id: "D4_collaboration",
    criterionId: "D4",
    environmentId: "D",
    question_ar: "هل كان العمل الجماعي تعاونياً حقيقياً (مسؤولية مشتركة، تنسيق) أم مجرد طلاب يعملون بالقرب من بعضهم البعض؟",
    question_en: "Was group work true collaboration (shared responsibility, coordination) or just students working near each other?",
    options: [
      { value: "true_collaboration", label_ar: "تعاون حقيقي", label_en: "True collaboration" },
      { value: "proximity_only", label_ar: "عمل بالقرب فقط", label_en: "Proximity only" },
      { value: "unclear", label_ar: "غير واضح", label_en: "Unclear" },
    ],
  },
  // Environment E: Progress Monitoring & Feedback
  {
    id: "E1_monitoring",
    criterionId: "E1",
    environmentId: "E",
    question_ar: "هل كان الطلاب يراقبون تقدمهم بأنفسهم (سجلات، مخططات، محافظ) أو لديهم آليات للمراقبة؟",
    question_en: "Were learners monitoring their own progress (records, charts, portfolios) or have mechanisms for monitoring?",
    options: [
      { value: "yes_monitoring", label_ar: "نعم، كانوا يراقبون", label_en: "Yes, were monitoring" },
      { value: "no_not_monitoring", label_ar: "لا، لم يكونوا يراقبون", label_en: "No, not monitoring" },
      { value: "unclear", label_ar: "غير واضح", label_en: "Unclear" },
    ],
  },
  {
    id: "E2_feedback",
    criterionId: "E2",
    environmentId: "E",
    question_ar: "هل تلقى الطلاب واستجابوا للتغذية الراجعة من المعلم/الأقران/موارد أخرى لتحسين الفهم؟",
    question_en: "Did learners receive and respond to feedback from teachers/peers/other resources to improve understanding?",
    options: [
      { value: "yes_feedback", label_ar: "نعم، تلقوا واستجابوا للتغذية الراجعة", label_en: "Yes, received and responded to feedback" },
      { value: "no_no_feedback", label_ar: "لا، لم يتلقوا تغذية راجعة", label_en: "No feedback received" },
      { value: "unclear", label_ar: "غير واضح", label_en: "Unclear" },
    ],
  },
  {
    id: "E3_demonstrating",
    criterionId: "E3",
    environmentId: "E",
    question_ar: "هل أظهر الطلاب فهمهم للمحتوى (شرح، تطبيق، إجابة على أسئلة، تعبير شفهي)؟",
    question_en: "Did learners demonstrate and/or verbalize understanding of the lesson/content (explanation, application, answering questions)?",
    options: [
      { value: "yes_demonstrated", label_ar: "نعم، أظهروا الفهم", label_en: "Yes, demonstrated understanding" },
      { value: "no_did_not_demonstrate", label_ar: "لا، لم يظهروا الفهم", label_en: "No, did not demonstrate" },
      { value: "unclear", label_ar: "غير واضح", label_en: "Unclear" },
    ],
  },
  {
    id: "E4_assessment",
    criterionId: "E4",
    environmentId: "E",
    question_ar: "هل فهم الطلاب أو كانوا قادرين على شرح كيفية تقييم عملهم (معايير، روبريك، طرق التقييم)؟",
    question_en: "Did learners understand and/or were able to explain how their work is assessed (criteria, rubrics, assessment methods)?",
    options: [
      { value: "yes_understood", label_ar: "نعم، فهموا التقييم", label_en: "Yes, understood assessment" },
      { value: "no_not_understood", label_ar: "لا، لم يفهموا", label_en: "No, did not understand" },
      { value: "unclear", label_ar: "غير واضح", label_en: "Unclear" },
    ],
  },
  // Environment F: Well-Managed Learning
  {
    id: "F1_respectful",
    criterionId: "F1",
    environmentId: "F",
    question_ar: "هل كان التفاعل بين الطلاب والمعلم محترماً ولطيفاً (احترام، لطف، تفاعل إيجابي)؟",
    question_en: "Did learners speak and interact respectfully with teacher(s) and each other (respect, kindness, positive interaction)?",
    options: [
      { value: "yes_respectful", label_ar: "نعم، كان محترماً", label_en: "Yes, respectful" },
      { value: "no_not_respectful", label_ar: "لا، لم يكن محترماً", label_en: "No, not respectful" },
      { value: "unclear", label_ar: "غير واضح", label_en: "Unclear" },
    ],
  },
  {
    id: "F2_rules",
    criterionId: "F2",
    environmentId: "F",
    question_ar: "هل أظهر الطلاب معرفة و/أو اتبعوا قواعد الفصل وتوقعات السلوك وعملوا بشكل جيد مع الآخرين؟",
    question_en: "Did learners demonstrate knowledge of and/or follow classroom rules and behavioral expectations and work well with others?",
    options: [
      { value: "yes_followed_rules", label_ar: "نعم، اتبعوا القواعد", label_en: "Yes, followed rules" },
      { value: "no_did_not_follow", label_ar: "لا، لم يتبعوا", label_en: "No, did not follow" },
      { value: "unclear", label_ar: "غير واضح", label_en: "Unclear" },
    ],
  },
  {
    id: "F3_transitions",
    criterionId: "F3",
    environmentId: "F",
    question_ar: "هل كانت الانتقالات بين الأنشطة سلسة وفعالة بدون فوضى أو إضاعة وقت؟",
    question_en: "Did learners transition smoothly and efficiently from one activity to another without chaos or wasted time?",
    options: [
      { value: "yes_smooth", label_ar: "نعم، كانت سلسة", label_en: "Yes, smooth" },
      { value: "no_chaotic", label_ar: "لا، كانت فوضوية", label_en: "No, chaotic" },
      { value: "unclear", label_ar: "غير واضح", label_en: "Unclear" },
    ],
  },
  {
    id: "F4_time",
    criterionId: "F4",
    environmentId: "F",
    question_ar: "هل استخدم الطلاب وقت الفصل بشكل هادف مع الحد الأدنى من الوقت الضائع أو الاضطرابات؟",
    question_en: "Did learners use class time purposefully with minimal wasted time or disruptions?",
    options: [
      { value: "yes_purposeful", label_ar: "نعم، استخدام هادف للوقت", label_en: "Yes, purposeful use of time" },
      { value: "no_wasted_time", label_ar: "لا، وقت ضائع", label_en: "No, wasted time" },
      { value: "unclear", label_ar: "غير واضح", label_en: "Unclear" },
    ],
  },
  // Environment G: Digital Learning
  {
    id: "G1_info",
    criterionId: "G1",
    environmentId: "G",
    question_ar: "هل استخدم الطلاب أدوات/تكنولوجيا رقمية لجمع وتقييم واستخدام المعلومات للتعلم؟",
    question_en: "Did learners use digital tools/technology to gather, evaluate, and/or use information for learning?",
    options: [
      { value: "yes_used_digital_tools", label_ar: "نعم، استخدموا أدوات رقمية", label_en: "Yes, used digital tools" },
      { value: "no_did_not_use", label_ar: "لا، لم يستخدموا", label_en: "No, did not use" },
      { value: "unclear", label_ar: "غير واضح", label_en: "Unclear" },
    ],
  },
  {
    id: "G2_problem_solving",
    criterionId: "G2",
    environmentId: "G",
    question_ar: "هل استخدم الطلاب أدوات/تكنولوجيا رقمية لإجراء البحوث وحل المشكلات و/أو إنشاء أعمال أصلية للتعلم؟",
    question_en: "Did learners use digital tools/technology to conduct research, solve problems, and/or create original works for learning?",
    options: [
      { value: "yes_used", label_ar: "نعم، استخدموا", label_en: "Yes, used" },
      { value: "no_did_not_use", label_ar: "لا، لم يستخدموا", label_en: "No, did not use" },
      { value: "unclear", label_ar: "غير واضح", label_en: "Unclear" },
    ],
  },
  {
    id: "G3_communication",
    criterionId: "G3",
    environmentId: "G",
    question_ar: "هل استخدم الطلاب أدوات/تكنولوجيا رقمية للتواصل و/أو العمل التعاوني للتعلم؟",
    question_en: "Did learners use digital tools/technology to communicate and/or work collaboratively for learning?",
    options: [
      { value: "yes_used", label_ar: "نعم، استخدموا", label_en: "Yes, used" },
      { value: "no_did_not_use", label_ar: "لا، لم يستخدموا", label_en: "No, did not use" },
      { value: "unclear", label_ar: "غير واضح", label_en: "Unclear" },
    ],
  },
]

export const getQuestionsForEnvironments = (environmentIds: string[]): ClarificationQuestion[] => {
  return CLARIFICATION_QUESTIONS.filter((q) => environmentIds.includes(q.environmentId))
}

export const getQuestionById = (id: string): ClarificationQuestion | undefined => {
  return CLARIFICATION_QUESTIONS.find((q) => q.id === id)
}

/**
 * Intelligently determine which clarification questions are needed
 * based on missing evidence in the lesson description
 * 
 * @param lessonDescription - The lesson description text
 * @param selectedEnvironments - Selected environment IDs
 * @param language - Language code ("ar" | "en")
 * @returns Array of clarification questions that are needed
 */
export const getNeededClarificationQuestions = (
  lessonDescription: string,
  selectedEnvironments: string[],
  language: "ar" | "en" = "ar"
): ClarificationQuestion[] => {
  if (!lessonDescription || lessonDescription.trim().length < 20) {
    // If description is too short, show all questions for selected environments
    return getQuestionsForEnvironments(selectedEnvironments)
  }

  const descLower = lessonDescription.toLowerCase()
  const neededQuestions: ClarificationQuestion[] = []

  // Get all questions for selected environments
  const allQuestions = getQuestionsForEnvironments(selectedEnvironments)

  // Analyze each question's criterion to see if evidence is missing
  for (const question of allQuestions) {
    const criterionId = question.criterionId
    const hasEvidence = checkCriterionEvidence(criterionId, descLower, language)

    // If evidence is weak or missing, add this question
    if (!hasEvidence) {
      neededQuestions.push(question)
    }
  }

  // If no questions are needed (all criteria have evidence), return empty array
  // This allows the modal to show "No clarifications needed" or skip directly
  return neededQuestions
}

/**
 * Check if there is sufficient evidence for a criterion in the description
 * Returns true if evidence is found, false if evidence is missing/weak
 */
function checkCriterionEvidence(
  criterionId: string,
  descLower: string,
  language: "ar" | "en"
): boolean {
  const isArabic = language === "ar"

  // Evidence patterns for each criterion (focused on learner behaviors)
  const evidencePatterns: Record<string, string[]> = {
    A1: isArabic
      ? ["الطلاب يشاركون في أنشطة مختلفة", "أنشطة متمايزة", "مستويات مختلفة", "يعملون في مجموعات", "أنشطة تلبي احتياجات"]
      : ["students participate in different activities", "differentiated activities", "various levels", "working in groups", "activities meet needs"],
    A2: isArabic
      ? ["الطلاب وصلوا", "جميع الطلاب يستخدمون", "كل الطلاب يصلون", "الطلاب يصلون إلى", "الطلاب يستخدمون التكنولوجيا", "متساو", "وصلوا جميعاً"]
      : ["students access", "all students use", "every student reaches", "students reach", "students use technology", "equal", "all accessed"],
    A3: isArabic
      ? ["الطلاب يتبعون", "الطلاب يفهمون", "الطلاب يطبقون القواعد", "معاملة متساوية", "الطلاب يعرفون", "عادل", "متسق"]
      : ["students follow", "students understand", "students apply rules", "equal treatment", "students know", "fair", "consistent"],
    A4: isArabic
      ? ["الطلاب يظهرون احترام", "الطلاب يسألون عن", "الطلاب يساعدون", "الطلاب يتفهمون", "الطلاب يقدرون", "احترام", "تعاطف"]
      : ["students show respect", "students ask about", "students help", "students understand", "students appreciate", "respect", "empathy"],
    B1: isArabic
      ? ["الطلاب يسعون", "الطلاب يحددون أهداف", "الطلاب يطمحون", "الطلاب يتحدون أنفسهم", "الطلاب يعبرون عن التوقعات"]
      : ["students strive", "students set goals", "students aspire", "students challenge themselves", "students articulate expectations"],
    B2: isArabic
      ? ["الطلاب يشاركون في أنشطة صعبة", "الطلاب يحلون", "الطلاب يتحدون", "الطلاب ينجزون", "صعبة", "قابلة للتحقيق", "تحدي"]
      : ["students participate in challenging", "students solve", "students tackle", "students complete", "challenging", "achievable", "challenge"],
    B3: isArabic
      ? ["الطلاب يظهرون عملاً عالي الجودة", "الطلاب يصفون معايير", "الطلاب يستخدمون روبريك", "جودة عالية", "معايير"]
      : ["students demonstrate quality work", "students describe standards", "students use rubrics", "high quality", "standards"],
    B4: isArabic
      ? ["الطلاب يحللون", "الطلاب يطبقون", "الطلاب يقيمون", "الطلاب يركبون", "الطلاب يفكرون نقدياً", "تفكير عالي المستوى"]
      : ["students analyze", "students apply", "students evaluate", "students synthesize", "students think critically", "higher order thinking"],
    B5: isArabic
      ? ["الطلاب يتحملون المسؤولية", "الطلاب يختارون", "الطلاب يخططون", "الطلاب يقررون", "موجهون ذاتياً"]
      : ["students take responsibility", "students choose", "students plan", "students decide", "self-directed"],
    C1: isArabic
      ? ["الطلاب يتعاونون", "الطلاب يدعمون بعضهم", "الطلاب يعملون معاً", "مجتمع إيجابي", "هدف مشترك"]
      : ["students cooperate", "students support each other", "students work together", "positive community", "shared purpose"],
    C2: isArabic
      ? ["الطلاب يسألون", "الطلاب يشاركون أفكار", "الطلاب يجربون", "الطلاب لا يخافون", "الطلاب يخطئون", "أمان", "أسئلة"]
      : ["students ask", "students share ideas", "students try", "students don't fear", "students make mistakes", "safe", "questions"],
    C3: isArabic
      ? ["الطلاب يساعدون", "الطلاب يدعمون", "الطلاب يشجعون", "الطلاب يشرحون", "دعم", "مساعدة"]
      : ["students help", "students support", "students encourage", "students explain", "support", "help"],
    C4: isArabic
      ? ["الطلاب يحترمون المعلم", "الطلاب يثقون", "الطلاب يتفاعلون إيجابياً", "علاقة ودية", "ثقة"]
      : ["students respect teacher", "students trust", "students interact positively", "congenial relationship", "trust"],
    D1: isArabic
      ? ["الطلاب يناقشون", "الطلاب يحاورون", "الطلاب يتبادلون", "الطلاب يتحدثون أكثر", "مناقشات سائدة"]
      : ["students discuss", "students dialogue", "students exchange", "students speak more", "discussions predominate"],
    D2: isArabic
      ? ["الطلاب يربطون", "الطلاب يطبقون على الحياة", "الطلاب يستخدمون أمثلة واقعية", "تجارب حقيقية", "حياة واقعية"]
      : ["students connect", "students apply to life", "students use real examples", "real experiences", "real life"],
    D3: isArabic
      ? ["الطلاب يشاركون بنشاط", "الطلاب يتفاعلون", "الطلاب يعملون", "الطلاب يتحركون", "مشاركة نشطة", "تفاعل"]
      : ["students actively participate", "students interact", "students work", "students move", "active participation", "interaction"],
    D4: isArabic
      ? ["الطلاب يتعاونون", "الطلاب يعملون معاً", "الطلاب ينسقون", "الطلاب يشاركون", "تعاون", "عمل جماعي"]
      : ["students collaborate", "students work together", "students coordinate", "students share", "collaboration", "group work"],
    E1: isArabic
      ? ["الطلاب يراقبون تقدمهم", "الطلاب يستخدمون سجلات", "الطلاب يستخدمون مخططات", "مراقبة ذاتية", "تتبع التقدم"]
      : ["students monitor progress", "students use records", "students use charts", "self-monitoring", "track progress"],
    E2: isArabic
      ? ["الطلاب يتلقون ملاحظات", "الطلاب يستمعون للتغذية الراجعة", "الطلاب يستجيبون", "ملاحظات", "تغذية راجعة"]
      : ["students receive feedback", "students listen to feedback", "students respond", "feedback", "comments"],
    E3: isArabic
      ? ["الطلاب يظهرون الفهم", "الطلاب يشرحون", "الطلاب يطبقون", "الطلاب يجيبون على أسئلة", "فهم واضح"]
      : ["students demonstrate understanding", "students explain", "students apply", "students answer questions", "clear understanding"],
    E4: isArabic
      ? ["الطلاب يفهمون التقييم", "الطلاب يعرفون المعايير", "الطلاب يشرحون كيفية التقييم", "معايير التقييم"]
      : ["students understand assessment", "students know criteria", "students explain how assessed", "assessment criteria"],
    F1: isArabic
      ? ["الطلاب محترمون", "الطلاب لطيفون", "الطلاب يتفاعلون باحترام", "احترام", "لطيف"]
      : ["students respectful", "students polite", "students interact respectfully", "respectful", "polite"],
    F2: isArabic
      ? ["الطلاب يتبعون القواعد", "الطلاب يعرفون التوقعات", "الطلاب يطبقون", "قواعد", "توقعات", "واضحة"]
      : ["students follow rules", "students know expectations", "students apply", "rules", "expectations", "clear"],
    F3: isArabic
      ? ["الطلاب ينتقلون بسلاسة", "الطلاب يستخدمون الوقت بفعالية", "الطلاب يعملون بسرعة", "انتقالات سلسة", "فعال"]
      : ["students transition smoothly", "students use time effectively", "students work quickly", "smooth transitions", "efficient"],
    F4: isArabic
      ? ["الطلاب يستخدمون الوقت بفعالية", "الطلاب منظمون في الوقت", "وقت هادف", "لا وقت ضائع"]
      : ["students use time effectively", "students time-organized", "purposeful time", "no wasted time"],
    G1: isArabic
      ? ["الطلاب يستخدمون التكنولوجيا", "الطلاب يستخدمون الأجهزة", "الطلاب يجمعون معلومات", "تكنولوجيا", "رقمي", "أجهزة"]
      : ["students use technology", "students use devices", "students gather information", "technology", "digital", "devices"],
    G2: isArabic
      ? ["الطلاب يبحثون", "الطلاب يحلون مشكلات", "الطلاب ينشئون محتوى", "بحوث", "حل مشكلات", "إبداع"]
      : ["students research", "students solve problems", "students create content", "research", "problem solving", "creativity"],
    G3: isArabic
      ? ["الطلاب يتواصلون رقمياً", "الطلاب يتعاونون رقمياً", "الطلاب يشاركون ملفات", "تواصل رقمي", "تعاون رقمي"]
      : ["students communicate digitally", "students collaborate digitally", "students share files", "digital communication", "digital collaboration"],
  }

  const patterns = evidencePatterns[criterionId] || []
  
  // Check if any pattern is found in the description
  for (const pattern of patterns) {
    if (descLower.includes(pattern.toLowerCase())) {
      return true // Evidence found
    }
  }

  // No evidence found - question is needed
  return false
}


