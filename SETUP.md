# دليل الإعداد - ELEOT 2026

## المتطلبات الأساسية

- Node.js 18+ 
- MongoDB (محلي أو MongoDB Atlas)
- npm أو yarn

## خطوات الإعداد

### 1. تثبيت المتطلبات

```bash
npm install
```

### 2. إعداد متغيرات البيئة

انسخ ملف `.env.example` إلى `.env` واملأ القيم:

```bash
cp .env.example .env
```

عدّل الملف `.env` وأضف:

```env
MONGODB_URI=mongodb://localhost:27017/eleot2026
NEXTAUTH_SECRET=your-secret-key-min-32-chars-long
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. إعداد قاعدة البيانات

تأكد من تشغيل MongoDB. ثم قم بتشغيل seed script لإضافة بيانات تجريبية:

```bash
npm run seed
```

سيتم إنشاء:
- مستخدم admin: `admin@eleot.com` / `admin123`
- مستخدم supervisor: `supervisor@eleot.com` / `supervisor123`
- 5 معلمين تجريبيين

### 4. تشغيل المشروع

```bash
npm run dev
```

افتح المتصفح على: http://localhost:3000

## البنية الأساسية

```
Eleot2026/
├── src/
│   ├── app/              # صفحات Next.js (App Router)
│   │   ├── (app)/        # صفحات محمية (تتطلب تسجيل دخول)
│   │   ├── (auth)/       # صفحات المصادقة
│   │   └── api/          # API Routes
│   ├── components/       # مكونات React
│   ├── lib/              # مكتبات ومرافق
│   ├── models/           # نماذج MongoDB
│   ├── config/           # ملفات التكوين
│   └── utils/            # دوال مساعدة
```

## الصفحات الرئيسية

- `/login` - تسجيل الدخول
- `/evaluation` - صفحة التقييم (الصفحة الرئيسية)
- `/visits` - قائمة الزيارات
- `/visits/[id]` - تفاصيل زيارة
- `/training` - صفحة التدريب
- `/reports` - صفحة التقارير
- `/settings` - صفحة الإعدادات

## المهام المتاحة

- `npm run dev` - تشغيل المشروع في وضع التطوير
- `npm run build` - بناء المشروع للإنتاج
- `npm run start` - تشغيل المشروع بعد البناء
- `npm run seed` - إضافة بيانات تجريبية
- `npm run lint` - فحص الأخطاء

## ملاحظات مهمة

1. تأكد من إعداد Google OAuth إذا أردت استخدام تسجيل الدخول بحساب Google
2. في الإنتاج، غيّر `NEXTAUTH_SECRET` إلى قيمة عشوائية قوية (32+ حرف)
3. تأكد من إعداد MongoDB Atlas أو MongoDB محلي قبل التشغيل

