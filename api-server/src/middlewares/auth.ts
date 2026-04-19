import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SESSION_SECRET || "fallback-dev-secret";

export interface AuthPayload {
  userId: number;
  username: string;
  name: string;
  role: "doctor" | "admin";
}

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Требуется авторизация" });
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Недействительный токен. Войдите снова." });
  }
}

export function requireDoctor(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Требуется авторизация" });
  }
  if (req.user.role !== "doctor" && req.user.role !== "admin") {
    return res.status(403).json({ error: "Доступ разрешён только врачам" });
  }
  next();
}
