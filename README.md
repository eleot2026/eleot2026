# ELEOT 2026 - Smart Observation Tool

نظام أداة المراقبة الذكية (ELEOT) - نسخة محسّنة ومستقرة

## التقنيات المستخدمة

- Next.js 14+ (App Router)
- TypeScript
- TailwindCSS + shadcn/ui
- MongoDB + Mongoose
- NextAuth (Email/Password + Google OAuth)
- دعم العربية/الإنجليزية مع RTL/LTR

## الإعداد والتشغيل

1. تثبيت المتطلبات:
```bash
npm install
```

2. إعداد متغيرات البيئة:
```bash
cp .env.example .env
# قم بتعديل .env وإضافة القيم المطلوبة
```

3. تشغيل المشروع:
```bash
npm run dev
```

4. تشغيل seed script لإضافة بيانات تجريبية:
```bash
npm run seed
```

## البنية

- `src/app/(auth)/login` - صفحة تسجيل الدخول
- `src/app/(app)/evaluation` - صفحة التقييم
- `src/app/(app)/visits` - قائمة الزيارات
- `src/app/(app)/training` - صفحة التدريب
- `src/app/(app)/reports` - صفحة التقارير
- `src/app/(app)/settings` - صفحة الإعدادات

