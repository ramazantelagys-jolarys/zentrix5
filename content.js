chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'EXECUTE_ACTION' && msg.action === 'fill_form') {
    const data = msg.payload;
    // Маппинг ключей AI на селекторы ДамуМед
    const maps = {
      'complaints': 'textarea[name*="complaint"]',
      'temperature': 'input[name*="Temperature"]',
      'diagnosis': 'input[name*="Diagnosis"]'
    };

    Object.entries(maps).forEach(([key, selector]) => {
      const el = document.querySelector(selector);
      if (el && data[key]) {
        el.value = data[key];
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.style.backgroundColor = "#e8f5e9";
      }
    });
  }
});