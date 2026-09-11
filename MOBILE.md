# ChatHub Minimal — Android (نهائي)

## ليه الإصدار القديم كان شاشة سودة؟
الإكستنشن محتاج `chrome.*` APIs. تحميل `app.html` جوه WebView بدون الإكستنشن = فشل صامت = شاشة سودة.

## الحل النهائي
تطبيق **قائم بذاته** في `mobile-www/`:
- واجهة شات تعمل فور الفتح
- موديلات: OpenAI / Claude / Gemini / OpenRouter
- API keys تتخزن محليًا
- مفيش اعتماد على Chrome extension

## تحميل الـ APK
1. https://github.com/Tawffik/chathub-minimal/actions
2. أو https://github.com/Tawffik/chathub-minimal/releases
3. نزّل `.apk` → ثبّت → افتح ⚙ وحط مفتاح

## الإكستنشن لسه موجود
للميزات الكاملة مع جلسات الويب (Claude.ai login):
```bash
yarn install && yarn build
# حمّل مجلد dist في Kiwi Browser
```
