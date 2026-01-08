# Minimal Patch: Rule-Driven Scoring Integration

## Analysis Summary

### 1. UI Call Location
**File**: `src/app/(app)/evaluation/page.tsx`
- **Function**: `handleClarificationSubmit` (line 116)
- **Payload Shape**:
  ```typescript
  {
    lessonDescription: string,
    selectedEnvironments: string[],
    language: "ar" | "en",
    clarifications: {
      skipped: false,
      answers: Record<string, string>  // e.g., { "A2_access": "yes_equal", "F2_following_rules": "no_followed" }
    }
  }
  ```

### 2. API Route Implementation
**File**: `src/app/api/ai-evaluate/route.ts`
- **Handler**: `POST` function (line 44)
- **Current Flow**:
  1. Receives request with `clarifications.answers`
  2. Converts answers → responses object (lines 145-201)
  3. Calls `calculateScore()` with responses (line 216)

### 3. Scoring Engine
**File**: `src/utils/aiService.ts`
- **Function**: `calculateScore()` (line 163)
- **Signature**: `calculateScore(text, criterion, language, responses)`
- **Anchor Logic**: 
  - `yes` → score ≥ 3
  - `no` → score ≤ 2
  - `unclear` → score = 2

## Issues Found

1. ✅ **FIXED**: Syntax error `importimport` → `import` in route.ts line 1
2. ✅ **FIXED**: Console.log in wrong place in aiService.ts function signature
3. ⚠️ **VERIFY**: Ensure responses object is properly passed (currently using `responses` directly)

## Minimal Patch Required

### Patch 1: Ensure responses is passed correctly

**File**: `src/app/api/ai-evaluate/route.ts` (line 216)

**Current**:
```typescript
const score = calculateScore(description, criterion, language, responses)
```

**Should be**:
```typescript
const score = calculateScore(description, criterion, language, Object.keys(responses).length > 0 ? responses : null)
```

**Reason**: Ensure we pass `null` when responses is empty object `{}` to match function signature.

### Patch 2: Add verification logging

**File**: `src/app/api/ai-evaluate/route.ts` (after line 201)

**Add**:
```typescript
// Debug: Verify responses object
console.log("[AI_EVAL] Responses built:", {
  count: Object.keys(responses).length,
  sample: Object.keys(responses).slice(0, 3).reduce((acc, key) => {
    acc[key] = responses[key];
    return acc;
  }, {} as Record<string, string>)
});
```

### Patch 3: Verify UI receives updated scores

**File**: `src/app/(app)/evaluation/page.tsx` (line 139)

**Current**:
```typescript
const result: EvaluationResponse = await response.json()
setEvaluationResult(result)
```

**Add logging**:
```typescript
const result: EvaluationResponse = await response.json()
console.log("[UI] Evaluation result received:", {
  overallScore: result.overallScore,
  scoresCount: result.scores?.length || 0,
  usedClarifications: result.usedClarifications?.length || 0
})
setEvaluationResult(result)
```

## Testing Steps

1. **Test with clarifications**:
   - Enter lesson description
   - Select environments
   - Answer clarification questions
   - Verify scores reflect responses (yes → ≥3, no → ≤2)

2. **Test without clarifications**:
   - Skip clarification modal
   - Verify scores are calculated from text only

3. **Check console logs**:
   - `[AI_EVAL] route.ts HIT` - confirms API called
   - `[AI_EVAL] Responses built` - confirms responses object created
   - `[AI_EVAL] calculateScore(...)` - confirms scoring with anchor
   - `[UI] Evaluation result received` - confirms UI got results

## Expected Behavior

- **With "yes" response**: Score should be at least 3
- **With "no" response**: Score should be at most 2
- **With "unclear" response**: Score should be exactly 2
- **Without response**: Score calculated from text evidence only

## Files Modified

1. ✅ `src/app/api/ai-evaluate/route.ts` - Fixed import, added responses conversion
2. ✅ `src/utils/aiService.ts` - Fixed function signature, added anchor logic
3. ⚠️ `src/app/(app)/evaluation/page.tsx` - No changes needed (already correct)

## Verification

Run the following to verify integration:
```bash
# Check for syntax errors
npm run build

# Check console logs when testing
# Look for [AI_EVAL] and [UI] prefixes
```

