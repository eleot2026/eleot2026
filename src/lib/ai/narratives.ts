import type { Criterion } from "@/config/eleotConfig"
import type { EvidenceResult } from "@/lib/ai/evidenceEngine"

type Language = "ar" | "en"

type NarrativeSet = {
  withEvidence: string[]
  withoutEvidence: string[]
  improvement: string[]
}

const pickVariant = (criterionId: string, options: string[]) => {
  if (options.length === 1) return options[0]
  const sum = Array.from(criterionId).reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return options[sum % options.length]
}

const JUSTIFICATION_MAP: Record<string, Record<Language, NarrativeSet>> = {
  D1: {
    ar: {
      withEvidence: [
        "ظهر حوار أكاديمي بين المتعلمين {snippet}، وهو مؤشر على نقاش يقوده الطلاب.",
        "يوضح الوصف تبادل أفكار بين المتعلمين {snippet}، مما يدعم معيار النقاش الطلابي.",
      ],
      withoutEvidence: [
        "الوصف لا يوضح نقاشاً بين المتعلمين؛ ابحث عن تبادل الآراء أو عرض الحلول أو تغذية راجعة بين الأقران.",
        "لا يظهر تواصل طلابي واضح؛ يحتاج المعيار إلى دلائل على حوار المتعلمين أو مناقشة جماعية.",
      ],
      improvement: [
        "فعّل نقاشاً منظماً مثل فكر-زاوج-شارك، وقدّم عبارات مساعدة للطلاب للرد على زملائهم.",
        "صمّم بروتوكولات نقاش مع أدوار محددة وتغذية راجعة بين الأقران لتوثيق الحوار الطلابي.",
      ],
    },
    en: {
      withEvidence: [
        "Learner-to-learner discussion is evident {snippet}, supporting student-led discourse.",
        "The description shows idea exchange among learners {snippet}, aligning with student discussion.",
      ],
      withoutEvidence: [
        "The description does not show learner discussion; look for turn-and-talk, peer feedback, or students sharing solutions.",
        "No clear student discourse is described; evidence should include peer exchange or group dialogue.",
      ],
      improvement: [
        "Use structured talk routines (Think-Pair-Share) and sentence stems so students respond to peers.",
        "Plan discussion protocols with roles and peer feedback to capture student-led dialogue.",
      ],
    },
  },
  D2: {
    ar: {
      withEvidence: [
        "تظهر مشاركة نشطة للمتعلمين {snippet}، ما يشير إلى انخراط فعلي في التعلم.",
        "يوضح الوصف أن المتعلمين كانوا نشطين {snippet}، وهو دليل على مشاركة مستمرة.",
      ],
      withoutEvidence: [
        "لا توجد مؤشرات واضحة على مشاركة نشطة؛ يُفضّل وصف أنشطة عملية أو حركة الطلاب.",
        "الانخراط النشط غير ظاهر في الوصف؛ نحتاج لأدلة على مشاركة المتعلمين عملياً.",
      ],
      improvement: [
        "أضف أنشطة عملية ومحطات تعلم تتطلب مشاركة كل طالب واستجابات مرئية.",
        "استخدم مهام حركية أو لعب أدوار لرفع مستوى الانخراط النشط للمتعلمين.",
      ],
    },
    en: {
      withEvidence: [
        "Active engagement is visible {snippet}, indicating sustained learner participation.",
        "Learners appear actively involved {snippet}, which supports this criterion.",
      ],
      withoutEvidence: [
        "Active participation is not described; include hands-on tasks or movement-based activities.",
        "The lesson lacks clear signs of active engagement; note how learners interact and participate.",
      ],
      improvement: [
        "Add hands-on tasks or stations that require visible student responses.",
        "Use movement-based activities or role-play to raise active engagement.",
      ],
    },
  },
  D3: {
    ar: {
      withEvidence: [
        "ظهر الاستقصاء من خلال أسئلة المتعلمين {snippet}، مما يعكس تعلمًا مبنيًا على البحث.",
        "يشير الوصف إلى استكشاف أو بحث {snippet}، وهو دليل على الاستقصاء.",
      ],
      withoutEvidence: [
        "لا يظهر استقصاء أو بحث يقوده المتعلم؛ يجب إبراز أسئلة الطلاب أو خطوات التحقيق.",
        "الأدلة على الاستقصاء غير واضحة؛ يُفضل ذكر كيف طرح الطلاب أسئلة وبحثوا عن إجابات.",
      ],
      improvement: [
        "ادمج أسئلة استقصائية واطلب من الطلاب صياغة فرضيات ومشاركة النتائج.",
        "قدّم مهام بحث قصيرة تُلزم الطلاب بالاستكشاف وجمع الأدلة.",
      ],
    },
    en: {
      withEvidence: [
        "Inquiry is evident through learner questioning {snippet}, reflecting investigative learning.",
        "The description points to exploration or investigation {snippet}, supporting inquiry.",
      ],
      withoutEvidence: [
        "Inquiry is not evident; describe student questions, investigations, or research steps.",
        "Evidence of inquiry is unclear; highlight how learners explored or tested ideas.",
      ],
      improvement: [
        "Embed inquiry prompts and require students to generate questions and share findings.",
        "Use short investigations that ask learners to gather evidence and explain results.",
      ],
    },
  },
  D4: {
    ar: {
      withEvidence: [
        "التعاون بين المتعلمين واضح {snippet}، وهذا ينسجم مع العمل التعاوني.",
        "الطلاب عملوا بشكل تعاوني {snippet}، وهو دليل على بناء مشترك للتعلم.",
      ],
      withoutEvidence: [
        "لا يظهر تعاون حقيقي بين الطلاب؛ يحتاج المعيار إلى أدوار مشتركة أو منتج جماعي.",
        "الأدلة على التعاون غير واضحة؛ يُفضل وصف مهام جماعية ومسؤوليات مشتركة.",
      ],
      improvement: [
        "صمّم مهام جماعية بأدوار محددة ومنتج مشترك مع متابعة مساهمة كل طالب.",
        "فعّل تعاوناً رقمياً أو حضورياً مع بروتوكولات مشاركة واضحة وتغذية راجعة بين الأقران.",
      ],
    },
    en: {
      withEvidence: [
        "Collaboration among learners is clear {snippet}, aligning with shared learning tasks.",
        "Learners worked together {snippet}, showing collaborative construction of ideas.",
      ],
      withoutEvidence: [
        "Collaboration is not evident; look for shared roles, joint products, or peer support.",
        "The description lacks clear evidence of teamwork; describe how learners coordinate tasks.",
      ],
      improvement: [
        "Design group tasks with defined roles and a shared product to document collaboration.",
        "Use peer-review or co-creation routines so students rely on one another.",
      ],
    },
  },
  F1: {
    ar: {
      withEvidence: [
        "تنظيم المتعلمين واضح {snippet}، ما يشير إلى وجود روتين وأدوار محددة.",
        "يظهر التزام الطلاب بالإجراءات {snippet}، وهو دليل على بيئة منظمة.",
      ],
      withoutEvidence: [
        "لا توجد مؤشرات كافية على تنظيم الصف؛ يلزم وصف الروتين والأدوار بوضوح.",
        "الروتينات غير مذكورة؛ يحتاج المعيار إلى أدلة على إجراءات ثابتة وتنظيم المجموعات.",
      ],
      improvement: [
        "ضع إجراءات مكتوبة وأدواراً ثابتة للمجموعات مع تدريب عليها في بداية الحصة.",
        "استخدم قوائم تحقق وروتينات انتقال لضمان تنظيم عمل الطلاب.",
      ],
    },
    en: {
      withEvidence: [
        "Learner organization is visible {snippet}, suggesting clear routines and roles.",
        "Students followed procedures {snippet}, indicating an orderly environment.",
      ],
      withoutEvidence: [
        "Organization is unclear; describe routines, roles, or procedures that structure student work.",
        "The lesson lacks evidence of classroom routines; note how groups are organized.",
      ],
      improvement: [
        "Post procedures and roles, and rehearse routines at the start of the lesson.",
        "Use checklists and structured transitions to keep students organized.",
      ],
    },
  },
  F2: {
    ar: {
      withEvidence: [
        "ظهرت إشارات إلى سلامة الحركة {snippet}، مما يعكس بيئة آمنة للمتعلمين.",
        "بيئة الصف تبدو آمنة {snippet}، وهو مؤشر على إدارة فعالة للمساحة.",
      ],
      withoutEvidence: [
        "السلامة غير موصوفة بوضوح؛ أضف تفاصيل عن المسارات والحركة الآمنة.",
        "لا توجد أدلة كافية على سلامة البيئة؛ يحتاج المعيار إلى وصف لإدارة المساحة.",
      ],
      improvement: [
        "حدد مسارات الحركة بوضوح وذكّر الطلاب بقواعد السلامة أثناء التنقل.",
        "قسّم المساحة ونظّم الحركة لتقليل الازدحام وضمان الأمان.",
      ],
    },
    en: {
      withEvidence: [
        "Safe movement is indicated {snippet}, reflecting a secure learning space.",
        "The classroom environment appears safe {snippet}, showing effective space management.",
      ],
      withoutEvidence: [
        "Safety is not described; add evidence of clear pathways and safe movement.",
        "There is little evidence of a safe environment; describe how space is managed.",
      ],
      improvement: [
        "Define clear movement pathways and review safety expectations.",
        "Organize space and routines to reduce congestion and ensure safety.",
      ],
    },
  },
  F3: {
    ar: {
      withEvidence: [
        "تُظهر الحصة انتقالات سلسة وإدارة وقت {snippet}، مما يشير إلى وقت تعلم فعال.",
        "الوقت استُثمر بكفاءة {snippet}، وهو دليل على سلاسة الانتقالات.",
      ],
      withoutEvidence: [
        "لا توجد أدلة واضحة على سلاسة الانتقالات أو إدارة الوقت؛ يُفضّل ذكر مؤقتات أو توقيتات.",
        "الوصف لا يوضح كيف تم الانتقال بين الأنشطة؛ اذكر سرعة الانتقال واستثمار الوقت.",
      ],
      improvement: [
        "استخدم مؤقتاً مرئياً وحدد زمن كل نشاط لتقليل الهدر.",
        "صمّم روتين انتقال واضح مع إشارات صوتية أو بصرية للحفاظ على وقت التعلم.",
      ],
    },
    en: {
      withEvidence: [
        "Transitions and time use appear smooth {snippet}, supporting effective time on task.",
        "Time is managed efficiently {snippet}, indicating orderly transitions.",
      ],
      withoutEvidence: [
        "Smooth transitions are not evident; note timing, pacing, or use of timers.",
        "The description does not show how activities transitioned; include pacing details.",
      ],
      improvement: [
        "Timebox segments with visible timers to reduce downtime.",
        "Use consistent transition cues to keep students on task.",
      ],
    },
  },
  F4: {
    ar: {
      withEvidence: [
        "توقعات السلوك تبدو واضحة {snippet}، مما يعكس ضبطاً فعالاً للصف.",
        "التزام الطلاب بالقواعد ظاهر {snippet}، وهو دليل على وضوح التوقعات.",
      ],
      withoutEvidence: [
        "لا تظهر دلائل على قواعد أو توقعات واضحة؛ يحتاج المعيار إلى ذكر الانضباط أو الروتين.",
        "الوصف لا يوضح كيف تم ضبط السلوك؛ أضف مؤشرات على القواعد والتوقعات.",
      ],
      improvement: [
        "شارك الطلاب في صياغة قواعد الصف ودرّبهم على تطبيقها باستمرار.",
        "استخدم روتينات ثابتة وتعزيزاً إيجابياً للحفاظ على توقعات واضحة.",
      ],
    },
    en: {
      withEvidence: [
        "Behavior expectations are clear {snippet}, indicating effective classroom norms.",
        "Students followed rules {snippet}, showing clear expectations.",
      ],
      withoutEvidence: [
        "Clear expectations are not evident; describe rules, routines, or behavior norms.",
        "The lesson lacks evidence of behavior expectations; highlight how norms were reinforced.",
      ],
      improvement: [
        "Co-create norms with students and reinforce them consistently.",
        "Use explicit routines and positive reinforcement to maintain expectations.",
      ],
    },
  },
  G1: {
    ar: {
      withEvidence: [
        "استخدام التقنية ظاهر {snippet}، مما يشير إلى وصول الطلاب للأدوات الرقمية.",
        "تظهر مشاركة الطلاب للتقنية {snippet}، وهو مؤشر على توظيف الموارد الرقمية.",
      ],
      withoutEvidence: [
        "لا توجد أدلة كافية على استخدام التقنية؛ يحتاج المعيار إلى ذكر أجهزة أو موارد رقمية.",
        "الوصف لا يوضح وصول الطلاب للتقنية؛ أضف تفاصيل عن الأجهزة المستخدمة.",
      ],
      improvement: [
        "ضمن وصول كل طالب للأجهزة عبر التناوب أو العمل الثنائي لتحقيق الهدف التعليمي.",
        "خطط لاستخدام موارد رقمية محددة تخدم نواتج التعلم.",
      ],
    },
    en: {
      withEvidence: [
        "Technology use is evident {snippet}, indicating learner access to digital tools.",
        "Students used devices {snippet}, showing technology integration.",
      ],
      withoutEvidence: [
        "Technology use is not described; include devices or digital resources used by learners.",
        "The lesson lacks evidence of learner access to technology; add specifics on tools.",
      ],
      improvement: [
        "Ensure device access via rotation or pairing tied to learning goals.",
        "Plan explicit digital resource use that supports the objective.",
      ],
    },
  },
  G2: {
    ar: {
      withEvidence: [
        "استخدام أدوات رقمية للتعلم واضح {snippet}، مما يعكس تعلماً قائماً على التقنية.",
        "نشاط رقمي تفاعلي مذكور {snippet}، وهو دليل على توظيف أدوات تعلم رقمية.",
      ],
      withoutEvidence: [
        "لا توجد دلائل على أدوات رقمية للتعلم؛ يجب ذكر منصات أو أنشطة رقمية محددة.",
        "الوصف لا يوضح توظيف أدوات رقمية؛ أضف مثالاً على اختبار أو محاكاة رقمية.",
      ],
      improvement: [
        "وظّف أدوات مثل الاختبارات الرقمية أو المحاكاة مع مخرجات تعلم واضحة.",
        "اختر منصة تعلم تفاعلية تتطلب استجابة من الطلاب وتوثيق نواتجهم.",
      ],
    },
    en: {
      withEvidence: [
        "Digital learning tools are evident {snippet}, indicating purposeful technology use.",
        "An interactive digital activity is described {snippet}, supporting this criterion.",
      ],
      withoutEvidence: [
        "Digital learning tools are not evident; cite a platform, quiz, or simulation.",
        "The lesson lacks clear digital tool use; add a concrete example of a learning tool.",
      ],
      improvement: [
        "Use digital quizzes or simulations with clear student outputs.",
        "Select an interactive platform that requires learner responses and artifacts.",
      ],
    },
  },
  G3: {
    ar: {
      withEvidence: [
        "ظهر تعاون رقمي بين المتعلمين {snippet}، مما يدعم العمل المشترك عبر التقنية.",
        "المتعلمون شاركوا رقميًا {snippet}، وهو دليل على التعاون عبر الأدوات الرقمية.",
      ],
      withoutEvidence: [
        "لا توجد أدلة على تعاون رقمي؛ يُفضل ذكر مستندات مشتركة أو مراجعة أقران رقمية.",
        "الوصف لا يوضح مشاركة رقمية بين الطلاب؛ أضف مؤشرات على عمل تعاوني عبر الإنترنت.",
      ],
      improvement: [
        "استخدم مستندات مشتركة مع بروتوكول واضح لمراجعة الأقران وتوزيع الأدوار.",
        "فعّل غرفاً فرعية أو لوحات تعاونية رقمية لتوثيق العمل المشترك.",
      ],
    },
    en: {
      withEvidence: [
        "Digital collaboration is evident {snippet}, supporting shared work online.",
        "Learners collaborated digitally {snippet}, showing joint production.",
      ],
      withoutEvidence: [
        "Digital collaboration is not evident; cite shared docs or online peer review.",
        "The description lacks online collaboration details; include evidence of shared work.",
      ],
      improvement: [
        "Use shared documents with clear peer-review protocols and roles.",
        "Enable breakout rooms or collaborative boards to capture joint work.",
      ],
    },
  },
}

const buildSnippetText = (snippet: string | undefined, language: Language) => {
  if (snippet && snippet.length > 0) {
    return language === "ar" ? `مثل: "${snippet}"` : `e.g., "${snippet}"`
  }
  return language === "ar" ? "كما ورد في الوصف" : "as described in the lesson"
}

const fallbackJustification = (
  criterionText: string,
  hasEvidence: boolean,
  language: Language
) => {
  if (hasEvidence) {
    return language === "ar"
      ? `ظهرت مؤشرات على "${criterionText}" في الوصف، لكن يلزم توضيح سلوك المتعلمين بشكل أدق.`
      : `There are indicators of "${criterionText}" in the description, but learner actions need clearer evidence.`
  }
  return language === "ar"
    ? `الوصف لا يوضح أدلة كافية على "${criterionText}"؛ يحتاج المعيار إلى سلوكيات متعلمين محددة.`
    : `The description does not provide sufficient evidence of "${criterionText}"; specify observable learner actions.`
}

const fallbackImprovement = (criterionText: string, language: Language) =>
  language === "ar"
    ? `عزّز "${criterionText}" بخطوات عملية واضحة وأمثلة على سلوك المتعلمين.`
    : `Strengthen "${criterionText}" with concrete steps and observable learner behaviors.`

export const buildJustification = ({
  criterion,
  evidence,
  clarification,
  language,
}: {
  criterion: Criterion
  evidence: EvidenceResult
  clarification?: { positive: boolean; text: string }
  language: Language
}): string => {
  const criterionText = language === "ar" ? criterion.label_ar : criterion.label_en
  const hasEvidence = evidence.termHits > 0 || evidence.evidenceSnippets.length > 0
  const hasStrongEvidence =
    evidence.evidenceStrength === "strong" || evidence.evidenceStrength === "moderate"
  const snippet = buildSnippetText(evidence.evidenceSnippets[0], language)
  const entry = JUSTIFICATION_MAP[criterion.id]?.[language]

  let statement = ""
  if (entry) {
    const templates = hasEvidence ? entry.withEvidence : entry.withoutEvidence
    statement = pickVariant(criterion.id, templates).replace("{snippet}", snippet)
  } else {
    statement = fallbackJustification(criterionText, hasEvidence, language)
  }

  if (!hasEvidence && clarification) {
    const clarificationText =
      language === "ar"
        ? ` ملاحظة المقيّم: ${clarification.text}`
        : ` Reviewer note: ${clarification.text}`
    return `${statement}${clarificationText}`
  }

  if (hasEvidence && !hasStrongEvidence) {
    const qualifier =
      language === "ar" ? " لكن الدليل محدود." : " Evidence is limited."
    return `${statement}${qualifier}`
  }

  return statement
}

export const buildImprovement = ({
  criterion,
  language,
}: {
  criterion: Criterion
  language: Language
}): string => {
  const criterionText = language === "ar" ? criterion.label_ar : criterion.label_en
  const entry = JUSTIFICATION_MAP[criterion.id]?.[language]
  if (entry) {
    return pickVariant(criterion.id, entry.improvement)
  }
  return fallbackImprovement(criterionText, language)
}
