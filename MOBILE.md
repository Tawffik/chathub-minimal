# ChatHub Minimal — Android

## الوضع الحالي (من غير API key)

التطبيق يفتح المواقع الرسمية جوه WebView:

- Claude → https://claude.ai
- ChatGPT → https://chatgpt.com
- Gemini → https://gemini.google.com
- Grok / Perplexity

تسجّل دخول **بحسابك**. الجلسة تتخزن في WebView (كوكيز).

**مفيش API key مطلوب.**

## المهم تفهمه
- التطبيق **لا** يفتح Claude Pro/API مجانًا.
- اللي بيظهر لك = نفس اللي على حسابك في المتصفح (Free أو Pro).
- لو حسابك Free على Claude، حدود Free هي اللي هتشتغل.

## التحميل
https://github.com/Tawffik/chathub-minimal/releases
أو من Actions بعد ما الـ workflow يخلّص.

## الإكستنشن (Kiwi)
للـ All-in-One جنب بعض من جلسات الويب:
```bash
yarn build
# Load dist in Kiwi
```
