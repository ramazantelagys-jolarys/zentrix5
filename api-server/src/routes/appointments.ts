import { Router, Request, Response } from "express";
import { db } from "@workspace/db";
import { appointmentsTable, patientsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  ListAppointmentsQueryParams,
  CreateAppointmentBody,
  UpdateAppointmentParams,
  UpdateAppointmentBody,
  GenerateScheduleBody,
} from "@workspace/api-zod";

const router = Router();

const SPECIALISTS: Record<string, string[]> = {
  doctor: ["Асанов Берик Серикович", "Жумабекова Алия Нурлановна"],
  physiotherapy: ["Сейткали Дина Маратовна", "Байжанов Аскар Темирович"],
  massage: ["Нурланов Бауыржан Ержанович", "Айтбаева Салтанат Рашидовна"],
  psychologist: ["Кенжебаева Гулия Серикбаевна"],
  speech_therapy: ["Мухамбетова Рауан Толегеновна"],
};

router.get("/", async (req: Request, res: Response) => {
  const parsed = ListAppointmentsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid query params" });
  }

  const { patientId, date, specialistType } = parsed.data;

  let appointments = await db.select().from(appointmentsTable);

  if (patientId) {
    appointments = appointments.filter(a => a.patientId === patientId);
  }
  if (date) {
    appointments = appointments.filter(a => a.scheduledDate === date);
  }
  if (specialistType) {
    appointments = appointments.filter(a => a.specialistType === specialistType);
  }

  appointments.sort((a, b) => {
    if (a.scheduledDate !== b.scheduledDate) return a.scheduledDate.localeCompare(b.scheduledDate);
    return a.scheduledTime.localeCompare(b.scheduledTime);
  });

  return res.json(appointments.map(formatAppointment));
});

router.post("/", async (req: Request, res: Response) => {
  const parsed = CreateAppointmentBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const [appointment] = await db
    .insert(appointmentsTable)
    .values({
      patientId: parsed.data.patientId,
      patientName: parsed.data.patientId.toString(),
      specialistType: parsed.data.specialistType,
      specialistName: parsed.data.specialistName,
      scheduledDate: parsed.data.scheduledDate,
      scheduledTime: parsed.data.scheduledTime,
      duration: parsed.data.duration,
      notes: parsed.data.notes ?? null,
      status: "scheduled",
    })
    .returning();

  return res.status(201).json(formatAppointment(appointment));
});

router.patch("/:id", async (req: Request, res: Response) => {
  const paramsParsed = UpdateAppointmentParams.safeParse(req.params);
  if (!paramsParsed.success) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const bodyParsed = UpdateAppointmentBody.safeParse(req.body);
  if (!bodyParsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const updates: Record<string, unknown> = {};
  if (bodyParsed.data.status !== undefined) {
    updates.status = bodyParsed.data.status;
    if (bodyParsed.data.status === "completed") {
      updates.completedAt = new Date().toISOString();
    }
  }
  if (bodyParsed.data.notes !== undefined) updates.notes = bodyParsed.data.notes;

  const [appointment] = await db
    .update(appointmentsTable)
    .set(updates)
    .where(eq(appointmentsTable.id, paramsParsed.data.id))
    .returning();

  if (!appointment) {
    return res.status(404).json({ error: "Appointment not found" });
  }

  return res.json(formatAppointment(appointment));
});

router.post("/generate", async (req: Request, res: Response) => {
  const parsed = GenerateScheduleBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { patientId, startDate, procedures } = parsed.data;

  const [patient] = await db
    .select()
    .from(patientsTable)
    .where(eq(patientsTable.id, patientId));

  if (!patient) {
    return res.status(404).json({ error: "Patient not found" });
  }

  const defaultProcedures = procedures?.length ? procedures : [
    "physiotherapy", "physiotherapy",
    "massage",
    "psychologist",
    "doctor",
  ];

  const workingDays: string[] = [];
  const start = new Date(startDate);
  let current = new Date(start);
  while (workingDays.length < 9) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays.push(current.toISOString().split("T")[0]);
    }
    current.setDate(current.getDate() + 1);
  }

  const timeSlots = ["09:00", "09:40", "10:20", "11:00", "11:40", "14:00", "14:40", "15:20", "16:00"];

  const newAppointments: typeof appointmentsTable.$inferSelect[] = [];

  for (let dayIdx = 0; dayIdx < workingDays.length; dayIdx++) {
    const date = workingDays[dayIdx];
    const slotTime = timeSlots[dayIdx % timeSlots.length];

    for (const procedure of defaultProcedures.slice(0, 2)) {
      const specialistList = SPECIALISTS[procedure] ?? SPECIALISTS["doctor"];
      const specialistName = specialistList[0];

      const [appt] = await db
        .insert(appointmentsTable)
        .values({
          patientId,
          patientName: patient.fullName,
          specialistType: procedure,
          specialistName,
          scheduledDate: date,
          scheduledTime: slotTime,
          duration: 30,
          status: "scheduled",
          notes: null,
          completedAt: null,
        })
        .returning();

      newAppointments.push(appt);
      break;
    }
  }

  return res.json(newAppointments.map(formatAppointment));
});

function formatAppointment(a: typeof appointmentsTable.$inferSelect) {
  return {
    id: a.id,
    patientId: a.patientId,
    patientName: a.patientName,
    specialistType: a.specialistType,
    specialistName: a.specialistName,
    scheduledDate: a.scheduledDate,
    scheduledTime: a.scheduledTime,
    duration: a.duration,
    status: a.status,
    notes: a.notes,
    completedAt: a.completedAt,
    createdAt: a.createdAt.toISOString(),
  };
}

export default router;
