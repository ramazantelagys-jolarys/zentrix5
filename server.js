const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" })); // Разрешаем запросы от расширения

const DOCTOR_TOKEN = "doctor-secret";
let patients = [];

// Проверка авторизации
const checkAuth = (req, res, next) => {
  if (req.headers.authorization !== DOCTOR_TOKEN) {
    return res.status(403).json({ error: "Доступ запрещен" });
  }
  next();
};

app.get("/api/patients", checkAuth, (req, res) => res.json(patients));

app.post("/api/patients", checkAuth, (req, res) => {
  const p = req.body;
  const newPatient = {
    id: Date.now(),
    name: p.name || "Неизвестный",
    diagnosis: p.diagnosis || "Нет диагноза",
    vitals: p.vitals || {},
    date: new Date().toLocaleString()
  };
  patients.push(newPatient);
  console.log("✅ Сохранен пациент:", newPatient.name);
  res.status(201).json(newPatient);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
