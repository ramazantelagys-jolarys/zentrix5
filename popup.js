'use strict';

const API_URL = "http://localhost:3000/api/patients";
// Если сервер локальный, раскомментируй:
// const API_URL = "http://localhost:3000/api/patients";

const TOKEN = "doctor-secret";

async function loadPatients() {
  const list = document.getElementById("list");
  const status = document.getElementById("status");
  const errorBox = document.getElementById("errorBox");

  status.innerText = "⏳ Загрузка данных...";
  status.style.color = "#ff9800"; 
  list.innerHTML = "";
  errorBox.innerHTML = "";

  try {
    const res = await fetch(API_URL, { headers: { "Authorization": TOKEN } });
    
    if (res.status === 502 || res.status === 503) {
      throw new Error("Сервер просыпается. Подождите 5 секунд и обновите.");
    }
    if (!res.ok) throw new Error("Ошибка сервера: " + res.status);
    
    const data = await res.json();
    status.innerText = "✅ На связи с сервером";
    status.style.color = "#4CAF50";

    if (data.length === 0) {
      list.innerHTML = "<div class='empty'>Пациентов пока нет</div>";
      return;
    }

    // Показываем от новых к старым
    data.reverse().forEach(p => {
      const div = document.createElement("div");
      div.className = "patient";
      div.innerHTML = `<strong>👤 ${p.name}</strong><br>🩺 ${p.diagnosis}`;
      list.appendChild(div);
    });
  } catch (err) {
    status.innerText = "❌ Ошибка подключения";
    status.style.color = "#d32f2f";
    errorBox.innerHTML = `<div class="error">⚠️ ${err.message}</div>`;
  }
}

document.getElementById("refresh").addEventListener("click", loadPatients);
document.addEventListener("DOMContentLoaded", loadPatients);