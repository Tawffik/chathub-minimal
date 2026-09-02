# تشغيل ChatHub بأمان (بدون ثغرات CI/CD)

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
1. افتح Chrome/Edge → `chrome://extensions`
2. فعّل **Developer mode**
3. اضغط **Load unpacked**
4. اختار مجلد `dist`

## ملاحظات أمان (مقابل الثغرات السابقة)
- لا تستخدم Gemini CLI أو Claude Code داخل GitHub Actions على هذا الريبو
- لا تضع ملفات `.gemini/.env` أو `AGENTS.md` في الريبو
- الصلاحيات محدودة (storage فقط)
- تم إيقاف Sentry و Plausible → مفيش ميتا داتا بتتبعت
- معظم console.debug/log اتشالوا

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
