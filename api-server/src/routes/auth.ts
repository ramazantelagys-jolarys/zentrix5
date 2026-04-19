import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthPayload } from "../middlewares/auth";

const router = Router();
const JWT_SECRET = process.env.SESSION_SECRET || "fallback-dev-secret";

interface DoctorAccount {
  id: number;
  username: string;
  passwordHash: string;
  name: string;
  role: "doctor" | "admin";
  specialty?: string;
}

// Pre-hashed passwords for demo accounts
// password for doctors: "doctor123" | admin password: "admin123"
const DOCTORS: DoctorAccount[] = [
  {
    id: 1,
    username: "asanov",
    passwordHash: "$2b$10$fUfLqZMr6/P21RR60aUkCushg.uR0YvnV0AvG9Uk.CHIKNKd3rBYG",
    name: "Асанов Берик Серикович",
    role: "doctor",
    specialty: "Врач-реабилитолог"
  },
  {
    id: 2,
    username: "zhumabek",
    passwordHash: "$2b$10$fUfLqZMr6/P21RR60aUkCushg.uR0YvnV0AvG9Uk.CHIKNKd3rBYG",
    name: "Жумабекова Алия Нурлановна",
    role: "doctor",
    specialty: "Врач-невролог"
  },
  {
    id: 3,
    username: "seytkali",
    passwordHash: "$2b$10$fUfLqZMr6/P21RR60aUkCushg.uR0YvnV0AvG9Uk.CHIKNKd3rBYG",
    name: "Сейткали Дина Маратовна",
    role: "doctor",
    specialty: "Специалист ЛФК"
  },
  {
    id: 4,
    username: "admin",
    passwordHash: "$2b$10$UelgdqfMC0T5bzUWdg.lhuoTjC3VzLD8jlhT5a9nFcdxPMguI0Wr.",
    name: "Администратор",
    role: "admin"
  }
];

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Введите имя пользователя и пароль" });
  }

  const doctor = DOCTORS.find(d => d.username === username.toLowerCase().trim());
  if (!doctor) {
    return res.status(401).json({ error: "Неверный логин или пароль" });
  }

  const isValid = await bcrypt.compare(password, doctor.passwordHash);
  if (!isValid) {
    return res.status(401).json({ error: "Неверный логин или пароль" });
  }

  const payload: AuthPayload = {
    userId: doctor.id,
    username: doctor.username,
    name: doctor.name,
    role: doctor.role
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "12h" });

  return res.json({
    token,
    user: {
      id: doctor.id,
      username: doctor.username,
      name: doctor.name,
      role: doctor.role,
      specialty: doctor.specialty
    }
  });
});

// GET /api/auth/me
router.get("/me", (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Требуется авторизация" });
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
    const doctor = DOCTORS.find(d => d.id === payload.userId);
    return res.json({
      id: payload.userId,
      username: payload.username,
      name: payload.name,
      role: payload.role,
      specialty: doctor?.specialty
    });
  } catch {
    return res.status(401).json({ error: "Недействительный токен" });
  }
});

export default router;
