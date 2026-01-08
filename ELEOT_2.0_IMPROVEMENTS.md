# ELEOT 2.0 Scoring Improvements - Technical Summary

## Overview
This document summarizes the improvements made to the ELEOT 2.0 scoring system to ensure clarifications materially affect scores and improve evaluation quality.

## Key Files Modified

1. **`src/config/eleotConfig.ts`**
   - Updated all rubric labels to match exact ELEOT 2.0 specifications
   - Fixed criterion counts: A1-A4, B1-B5, C1-C4, D1-D4, E1-E4, F1-F4, G1-G3 (28 total)
   - Improved Arabic translations to match professional educational terminology

2. **`src/config/clarificationQuestions.ts`**
   - Expanded from 12 to 28 clarification questions (one per criterion)
   - Added comprehensive evidence patterns for all criteria
   - Improved dynamic question filtering based on lesson description

3. **`src/utils/aiService.ts`**
   - Enhanced `calculateScore()` to make clarifications materially affect scores:
     - "yes" forces at least 3, can upgrade to 4 with strong evidence
     - "no" caps at 2, can downgrade to 1 with negative evidence
     - "unclear" no longer forces 2; uses text-based scoring only
   - Added debug logging for anchor decisions

4. **`src/app/api/ai-evaluate/route.ts`**
   - Improved response normalization from clarification answers to yes/no/unclear
   - Added comprehensive debug logging (route hits, normalized responses, per-criterion anchors, before/after scores)
   - Enhanced justification generation with evidence snippets
   - Added `extractEvidenceSnippets()` helper function

## New Scoring/Anchor Behavior (10 Bullet Points)

1. **"yes" responses (anchor = 4):**
   - Force minimum score of 3 (prevents AI from unfairly giving 1/2 when observer confirms presence)
   - Can upgrade to 4 if strong evidence exists (points >= 7, quality strong, quantity/frequency high)
   - Example: F2="yes" with strong evidence → score 4; F2="yes" with weak evidence → score 3

2. **"no" responses (anchor = 1):**
   - Cap maximum score at 2 (prevents AI from inflating to 3/4 from vague text)
   - Can downgrade to 1 if strong negative evidence exists (negative phrases found, low points, no term hits)
   - Example: F2="no" with negative evidence → score 1; F2="no" with neutral text → score 2

3. **"unclear" responses (anchor = 2):**
   - No anchor constraint applied (unlike previous version that forced score 2)
   - Uses text-based scoring only (allows AI to score 1-4 based on evidence)
   - Example: F2="unclear" with strong evidence → score 4; F2="unclear" with no evidence → score 1

4. **Response normalization:**
   - Question answer values (e.g., "yes_equal", "no_unequal", "too_easy") are normalized to "yes"/"no"/"unclear"
   - Mapping happens in `route.ts` before passing to `calculateScore()`
   - Supports both Arabic and English answer values

5. **Evidence-based scoring:**
   - Relevance: Direct match to criterion concepts (term hits)
   - Quality: Strong/moderate/weak indicators
   - Quantity: Whole class/some students/few
   - Frequency: Repeated occurrences
   - Negative evidence: Explicit absence or contradiction

6. **Conservative thresholds:**
   - Score 4 requires: points >= 7 (strong evidence across multiple factors)
   - Score 3 requires: points >= 5 (moderate evidence)
   - Score 2 requires: points >= 2 (weak evidence)
   - Score 1: points < 2 or explicit negative evidence

7. **Justification improvements:**
   - Includes concrete evidence snippets from observation text when available
   - Explicitly states "Not enough observable evidence" when evidence is missing
   - References clarification answers when provided
   - Focuses on learner behaviors, not teacher intentions

8. **Debug logging:**
   - Route hits logged with timestamp
   - Normalized responses object logged
   - Per-criterion anchor decisions logged (original score → final score)
   - Enabled via `AI_DEBUG=1` or `NODE_ENV=development`

9. **Deterministic rule engine:**
   - `clarificationRules.ts` applies hard bounds AFTER AI evaluation
   - Provides audit trail of score adjustments
   - Ensures scores respect factual clarifications

10. **Backward compatibility:**
   - Old visits without clarifications still load correctly
   - API returns both new professional format and legacy format
   - No breaking changes to existing UI components

## Test Cases

### Test Case 1: F2="no" should cap <= 2
**Input:**
- Lesson description: "Students were engaged in the lesson. The teacher provided clear instructions."
- Selected environments: ["F"]
- Clarification answer: F2_following_rules = "no_did_not_follow"

**Expected:**
- Normalized response: `{ F2: "no" }`
- Score calculation: Text-based score might be 3, but anchor caps it at 2
- Final score: 2 (capped by "no" response)
- Justification: Should mention clarification answer and cap reason

### Test Case 2: D3="yes" should raise >= 3
**Input:**
- Lesson description: "Students worked on a project together."
- Selected environments: ["D"]
- Clarification answer: D3_active_engagement = "yes_active"

**Expected:**
- Normalized response: `{ D3: "yes" }`
- Score calculation: Text-based score might be 2, but anchor forces at least 3
- Final score: 3 (forced by "yes" response)
- Justification: Should mention clarification answer and minimum score reason

### Test Case 3: G1="yes" with strong evidence → 4
**Input:**
- Lesson description: "All students used tablets to research information about the topic. They gathered data from multiple sources and evaluated the credibility of websites. Throughout the lesson, students actively used digital tools to complete their assignments."
- Selected environments: ["G"]
- Clarification answer: G1_digital_tools_info = "yes_used_digital_tools"

**Expected:**
- Normalized response: `{ G1: "yes" }`
- Score calculation: 
  - Text evidence: points >= 7 (strong quality, high quantity, high frequency)
  - Anchor: "yes" (4)
  - Final score: 4 (strong evidence + yes confirmation)
- Justification: Should include evidence snippets about students using digital tools

## How to Test Locally

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Enable debug logging:**
   ```bash
   export AI_DEBUG=1
   npm run dev
   ```

3. **Test URLs:**
   - Evaluation page: `http://localhost:3000/evaluation`
   - API endpoint: `http://localhost:3000/api/ai-evaluate`
   - Debug MongoDB: `http://localhost:3000/api/debug/mongo`

4. **Curl commands for testing:**

   ```bash
   # Test AI evaluation with clarifications
   curl -X POST http://localhost:3000/api/ai-evaluate \
     -H "Content-Type: application/json" \
     -d '{
       "lessonDescription": "Students actively participated in group discussions. They collaborated to solve problems and shared their ideas with each other.",
       "selectedEnvironments": ["D", "F"],
       "language": "en",
       "clarifications": {
         "skipped": false,
         "answers": {
           "D4_collaboration": "true_collaboration",
           "F2_following_rules": "no_did_not_follow"
         }
       }
     }'
   ```

   ```bash
   # Test without clarifications
   curl -X POST http://localhost:3000/api/ai-evaluate \
     -H "Content-Type: application/json" \
     -d '{
       "lessonDescription": "Students used tablets to research information. They gathered data and evaluated sources.",
       "selectedEnvironments": ["G"],
       "language": "en",
       "clarifications": {
         "skipped": true,
         "answers": {}
       }
     }'
   ```

## Verification Checklist

- [x] All 28 criteria have clarification questions
- [x] Response normalization maps all answer values correctly
- [x] "yes" responses force at least 3, can upgrade to 4
- [x] "no" responses cap at 2, can downgrade to 1
- [x] "unclear" responses don't force a score
- [x] Evidence snippets included in justifications
- [x] Debug logging added for all key steps
- [x] Backward compatibility maintained
- [x] No linting errors
- [x] Bilingual support (AR/EN) maintained

## Next Steps

1. Test with real lesson descriptions and clarification answers
2. Monitor debug logs to verify anchor decisions
3. Collect feedback on justification quality
4. Consider expanding `clarificationRules.ts` to cover all criteria (optional enhancement)

