# ChatHub Minimal — Android APK

## تحميل الـ APK

1. افتح: https://github.com/Tawffik/chathub-minimal/releases
2. نزّل أحدث ملف `.apk`
3. على الموبايل: اسمح بتثبيت من مصادر غير معروفة
4. ثبّت الـ APK

البناء يتم تلقائيًا مع كل push على `main` عبر GitHub Actions.

## ماذا يوجد في الـ APK؟

- نفس تعديلات Premium المفتوحة (بدون Lemon Squeezy)
- واجهة ChatHub من مجلد `dist`
- تشغيل داخل WebView

## مهم للاستخدام على الموبايل

| الميزة | في الـ APK | في Kiwi + Extension |
|--------|-----------|---------------------|
| Premium مفتوح | نعم | نعم |
| بدون تتبع | نعم | نعم |
| Claude/ChatGPT بجلسة الموقع | محدود (WebView) | أفضل |
| API keys (Claude API / OpenAI…) | يعمل | يعمل |

**للتجربة الأقوى على الموبايل:** استخدم Kiwi Browser + مجلد `dist` من الريبو.
**للتطبيق كأيقونة APK:** نزّل من Releases واستخدم API keys من الإعدادات.

## بناء يدوي

```bash
yarn install && yarn build
mkdir -p android-app/app/src/main/assets/www
cp -r dist/* android-app/app/src/main/assets/www/
cd android-app && ./gradlew assembleDebug
```

الـ APK يظهر في:
`android-app/app/build/outputs/apk/debug/`
