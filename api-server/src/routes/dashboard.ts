import { Router, Request, Response } from "express";
import { db } from "@workspace/db";
import { patientsTable, medicalFormsTable, appointmentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/summary", async (req: Request, res: Response) => {
  const today = new Date().toISOString().split("T")[0];

  const [allPatients, allForms, todayAppts] = await Promise.all([
    db.select().from(patientsTable),
    db.select().from(medicalFormsTable),
    db.select().from(appointmentsTable).where(eq(appointmentsTable.scheduledDate, today)),
  ]);

  const activePatients = allPatients.filter(p => p.status === "active").length;
  const completedToday = todayAppts.filter(a => a.status === "completed").length;
  const pendingForms = allForms.filter(f => f.status === "draft").length;
  const scheduledDischarges = allPatients.filter(p => p.dischargeDate === today).length;

  return res.json({
    totalPatients: allPatients.length,
    activePatients,
    todayAppointments: todayAppts.length,
    completedToday,
    pendingForms,
    scheduledDischarges,
  });
});

router.get("/today", async (req: Request, res: Response) => {
  const today = new Date().toISOString().split("T")[0];

  const appointments = await db
    .select()
    .from(appointmentsTable)
    .where(eq(appointmentsTable.scheduledDate, today));

  appointments.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

  return res.json(
    appointments.map(a => ({
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
    }))
  );
});

export default router;
