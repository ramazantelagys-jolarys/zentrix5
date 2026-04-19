'use strict';

const BACKEND_URL = "http://localhost:3000/api/patients";
const DOCTOR_TOKEN = "doctor-secret";

const SYSTEM_PROMPT = `Ты медицинский AI-ассистент ДамуМед. 
Распарси текст в JSON: patientName, complaints, diagnosis, temperature, topPressure, bottomPressure, pulse, saturation.
_action всегда обязателен: "fill_form", "navigate" или "save_form". 
Верни ТОЛЬКО чистый JSON.`;

async function syncWithBackend(data, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`[Sync] Попытка ${i + 1}...`);
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": DOCTOR_TOKEN
        },
        body: JSON.stringify({
          name: data.patientName,
          diagnosis: data.diagnosis,
          vitals: {
            temp: data.temperature,
            bp: data.topPressure ? `${data.topPressure}/${data.bottomPressure}` : null
          }
        })
      });
      if (response.ok) return console.log("✅ Синхронизировано с Replit");
    } catch (e) { console.error("❌ Ошибка sync:", e.message); }
    if (i < retries - 1) await new Promise(r => setTimeout(r, 2000));
  }
}

async function queryLLM(text, apiKey) {
  if (!apiKey) throw new Error("API Key не найден в настройках!");
  
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: text }],
      response_format: { type: 'json_object' }
    })
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return JSON.parse(json.choices[0].message.content);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PROCESS_VOICE_COMMAND') {
    chrome.storage.local.get(['apiKey'], async (store) => {
      try {
        const parsed = await queryLLM(message.payload.text, store.apiKey);
        
        // 1. В бэкенд
        if (parsed.patientName) syncWithBackend(parsed);

        // 2. В страницу ДамуМед
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, {
              type: 'EXECUTE_ACTION',
              action: parsed._action,
              payload: parsed
            });
          }
        });
        sendResponse(parsed);
      } catch (err) { 
        console.error("LLM Error:", err);
        sendResponse({ error: err.message }); 
      }
    });
    return true;
  }
});