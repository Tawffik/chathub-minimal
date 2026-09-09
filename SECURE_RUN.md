# تشغيل ChatHub Minimal بأمان (بدون ميتا داتا أو تتبع)

## التغييرات اللي اتعملت في النسخة دي
- تم تعطيل Sentry بالكامل
- تم تعطيل تتبع التثبيت (Plausible + chathub.gg)
- تم تقليل الـ console.debug
- مفيش أي phone-home غير ضروري

## 1. تثبيت المتطلبات
- Node.js 18+
- Yarn (corepack enable)

## 2. تثبيت الحزم
```bash
corepack enable
yarn install
```

## 3. البناء
```bash
yarn build
```

## 4. تحميل الإضافة في المتصفح
1. افتح Chrome/Edge → `chrome://extensions` أو `edge://extensions`
2. فعّل **Developer mode**
3. اضغط **Load unpacked**
4. اختار مجلد `dist`

## ملاحظات أمان
- الصلاحيات محدودة قدر الإمكان
- مفيش إرسال ميتا داتا لسيرفرات خارجية عند التثبيت
- معظم اللوجز اتشالت
- البوتات المجانية (ChatGPT Web / Claude Web / Gemini / Grok ...) بتشتغل على جلسة المتصفح بتاعتك

## لو هتعمل CI خاص بيك
استخدم workflow بسيط من غير أدوات AI:
```yaml
name: Build
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 1
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: corepack enable && yarn install --immutable
      - run: yarn build
```
