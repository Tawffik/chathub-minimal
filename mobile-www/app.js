(function () {
  /**
   * التبويبات تفتح المواقع الرسمية داخل التطبيق (WebView).
   * المستخدم يسجّل دخول بحسابه — بدون API key.
   * لا يوجد تجاوز لاشتراكات Anthropic/OpenAI.
   */
  var SITES = [
    { id: 'home', label: 'الرئيسية', url: null },
    { id: 'claude', label: 'Claude', url: 'https://claude.ai/' },
    { id: 'chatgpt', label: 'ChatGPT', url: 'https://chatgpt.com/' },
    { id: 'gemini', label: 'Gemini', url: 'https://gemini.google.com/' },
    { id: 'grok', label: 'Grok', url: 'https://grok.x.ai/' },
    { id: 'perplexity', label: 'Perplexity', url: 'https://www.perplexity.ai/' },
  ];

  var tabsEl = document.getElementById('tabs');

  function isNativeApp() {
    return !!(window.AndroidBridge && typeof window.AndroidBridge.openUrl === 'function');
  }

  function openSite(site) {
    if (!site.url) {
      showHome();
      return;
    }
    // In the Android app, ask native layer to load the URL in the main WebView
    if (isNativeApp()) {
      window.AndroidBridge.openUrl(site.url);
      return;
    }
    // Fallback in browser: navigate
    window.location.href = site.url;
  }

  function showHome() {
    document.querySelectorAll('.tab').forEach(function (t) {
      t.classList.toggle('active', t.getAttribute('data-id') === 'home');
    });
    if (isNativeApp() && window.AndroidBridge.openHome) {
      window.AndroidBridge.openHome();
    }
  }

  SITES.forEach(function (site) {
    var btn = document.createElement('button');
    btn.className = 'tab' + (site.id === 'home' ? ' active' : '');
    btn.textContent = site.label;
    btn.setAttribute('data-id', site.id);
    btn.onclick = function () {
      document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
      btn.classList.add('active');
      openSite(site);
    };
    tabsEl.appendChild(btn);
  });
})();
