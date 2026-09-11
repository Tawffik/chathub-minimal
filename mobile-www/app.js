(function () {
  const MODELS = [
    { id: 'openai:gpt-4o-mini', label: 'OpenAI · GPT-4o mini', provider: 'openai', model: 'gpt-4o-mini' },
    { id: 'openai:gpt-4o', label: 'OpenAI · GPT-4o', provider: 'openai', model: 'gpt-4o' },
    { id: 'anthropic:claude-3-5-sonnet-latest', label: 'Claude 3.5 Sonnet', provider: 'anthropic', model: 'claude-3-5-sonnet-latest' },
    { id: 'anthropic:claude-3-5-haiku-latest', label: 'Claude 3.5 Haiku', provider: 'anthropic', model: 'claude-3-5-haiku-latest' },
    { id: 'gemini:gemini-1.5-flash', label: 'Gemini 1.5 Flash', provider: 'gemini', model: 'gemini-1.5-flash' },
    { id: 'gemini:gemini-1.5-pro', label: 'Gemini 1.5 Pro', provider: 'gemini', model: 'gemini-1.5-pro' },
    { id: 'openrouter:auto', label: 'OpenRouter · Auto', provider: 'openrouter', model: 'openrouter/auto' },
    { id: 'openrouter:claude', label: 'OpenRouter · Claude', provider: 'openrouter', model: 'anthropic/claude-3.5-sonnet' },
  ];

  const $ = (id) => document.getElementById(id);
  const messagesEl = $('messages');
  const inputEl = $('input');
  const modelSelect = $('modelSelect');
  const settingsModal = $('settingsModal');

  const state = {
    messages: [],
    busy: false,
  };

  function loadKeys() {
    try {
      return JSON.parse(localStorage.getItem('chm_keys') || '{}');
    } catch {
      return {};
    }
  }

  function saveKeys(keys) {
    localStorage.setItem('chm_keys', JSON.stringify(keys));
  }

  function currentModel() {
    return MODELS.find((m) => m.id === modelSelect.value) || MODELS[0];
  }

  function addMessage(role, text, extraClass) {
    const div = document.createElement('div');
    div.className = 'msg ' + role + (extraClass ? ' ' + extraClass : '');
    if (role === 'bot' || role === 'user') {
      const meta = document.createElement('span');
      meta.className = 'meta';
      meta.textContent = role === 'user' ? 'أنت' : currentModel().label;
      div.appendChild(meta);
    }
    div.appendChild(document.createTextNode(text));
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function showWelcome() {
    messagesEl.innerHTML = '';
    addMessage(
      'system',
      'ChatHub Minimal جاهز.\nPremium مفتوح · مفيش Lemon Squeezy.\nافتح الإعدادات ⚙ وحط API key عشان تبدأ.'
    );
  }

  function fillModels() {
    modelSelect.innerHTML = '';
    MODELS.forEach((m) => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = m.label;
      modelSelect.appendChild(opt);
    });
    const saved = localStorage.getItem('chm_model');
    if (saved && MODELS.some((m) => m.id === saved)) modelSelect.value = saved;
  }

  function openSettings() {
    const keys = loadKeys();
    $('keyOpenAI').value = keys.openai || '';
    $('keyAnthropic').value = keys.anthropic || '';
    $('keyGemini').value = keys.gemini || '';
    $('keyOpenRouter').value = keys.openrouter || '';
    settingsModal.classList.remove('hidden');
  }

  function closeSettings() {
    settingsModal.classList.add('hidden');
  }

  async function callOpenAI(model, messages, apiKey) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
      body: JSON.stringify({
        model,
        messages: messages.map((m) => ({ role: m.role === 'bot' ? 'assistant' : m.role, content: m.content })),
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || JSON.stringify(data));
    return data.choices?.[0]?.message?.content || '';
  }

  async function callAnthropic(model, messages, apiKey) {
    const system = messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n');
    const msgs = messages
      .filter((m) => m.role === 'user' || m.role === 'bot')
      .map((m) => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.content }));
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 2048,
        system: system || undefined,
        messages: msgs,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || JSON.stringify(data));
    return (data.content || []).map((c) => c.text || '').join('');
  }

  async function callGemini(model, messages, apiKey) {
    const contents = messages
      .filter((m) => m.role === 'user' || m.role === 'bot')
      .map((m) => ({
        role: m.role === 'bot' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));
    const url =
      'https://generativelanguage.googleapis.com/v1beta/models/' +
      encodeURIComponent(model) +
      ':generateContent?key=' +
      encodeURIComponent(apiKey);
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || JSON.stringify(data));
    return data.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '';
  }

  async function callOpenRouter(model, messages, apiKey) {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
        'HTTP-Referer': 'https://github.com/Tawffik/chathub-minimal',
        'X-Title': 'ChatHub Minimal',
      },
      body: JSON.stringify({
        model,
        messages: messages.map((m) => ({ role: m.role === 'bot' ? 'assistant' : m.role, content: m.content })),
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || JSON.stringify(data));
    return data.choices?.[0]?.message?.content || '';
  }

  async function send() {
    const text = (inputEl.value || '').trim();
    if (!text || state.busy) return;

    const m = currentModel();
    const keys = loadKeys();
    const keyMap = {
      openai: keys.openai,
      anthropic: keys.anthropic,
      gemini: keys.gemini,
      openrouter: keys.openrouter,
    };
    const apiKey = keyMap[m.provider];
    if (!apiKey) {
      addMessage('system', 'مفيش API key لـ ' + m.provider + '. افتح الإعدادات ⚙ وأضفه.', 'error');
      openSettings();
      return;
    }

    state.messages.push({ role: 'user', content: text });
    addMessage('user', text);
    inputEl.value = '';
    state.busy = true;
    $('btnSend').disabled = true;

    const pending = addMessage('bot', '...');
    try {
      let reply = '';
      if (m.provider === 'openai') reply = await callOpenAI(m.model, state.messages, apiKey);
      else if (m.provider === 'anthropic') reply = await callAnthropic(m.model, state.messages, apiKey);
      else if (m.provider === 'gemini') reply = await callGemini(m.model, state.messages, apiKey);
      else if (m.provider === 'openrouter') reply = await callOpenRouter(m.model, state.messages, apiKey);
      else throw new Error('Unknown provider');

      pending.textContent = '';
      const meta = document.createElement('span');
      meta.className = 'meta';
      meta.textContent = m.label;
      pending.appendChild(meta);
      pending.appendChild(document.createTextNode(reply || '(رد فاضي)'));
      state.messages.push({ role: 'bot', content: reply });
    } catch (err) {
      pending.classList.add('error');
      pending.textContent = 'خطأ: ' + (err && err.message ? err.message : String(err));
    } finally {
      state.busy = false;
      $('btnSend').disabled = false;
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  }

  // Wire UI
  fillModels();
  showWelcome();

  $('btnSettings').onclick = openSettings;
  $('btnCloseSettings').onclick = closeSettings;
  $('btnSaveKeys').onclick = function () {
    saveKeys({
      openai: $('keyOpenAI').value.trim(),
      anthropic: $('keyAnthropic').value.trim(),
      gemini: $('keyGemini').value.trim(),
      openrouter: $('keyOpenRouter').value.trim(),
    });
    closeSettings();
    addMessage('system', 'تم حفظ المفاتيح على الجهاز.');
  };
  $('btnNew').onclick = function () {
    state.messages = [];
    showWelcome();
  };
  modelSelect.onchange = function () {
    localStorage.setItem('chm_model', modelSelect.value);
  };
  $('btnSend').onclick = send;
  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });
  settingsModal.addEventListener('click', function (e) {
    if (e.target === settingsModal) closeSettings();
  });
})();
