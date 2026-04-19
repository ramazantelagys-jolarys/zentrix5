import { Router, Request, Response } from "express";
import { db } from "@workspace/db";
import { patientsTable } from "@workspace/db";
import { eq, ilike, or } from "drizzle-orm";
import {
  ListPatientsQueryParams,
  CreatePatientBody,
  GetPatientParams,
  UpdatePatientBody,
  UpdatePatientParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const parsed = ListPatientsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid query params" });
  }
  const { search, status } = parsed.data;

  let query = db.select().from(patientsTable);

  const conditions = [];
  if (search) {
    conditions.push(
      or(
        ilike(patientsTable.fullName, `%${search}%`),
        ilike(patientsTable.iinNumber, `%${search}%`),
        ilike(patientsTable.diagnosis, `%${search}%`)
      )
    );
  }
  if (status) {
    conditions.push(eq(patientsTable.status, status));
  }

  const patients = conditions.length > 0
    ? await db.select().from(patientsTable).where(conditions[0])
    : await db.select().from(patientsTable);

  return res.json(patients.map(formatPatient));
});

router.post("/", async (req: Request, res: Response) => {
  const parsed = CreatePatientBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const [patient] = await db
    .insert(patientsTable)
    .values({
      fullName: parsed.data.fullName,
      birthDate: parsed.data.birthDate,
      gender: parsed.data.gender,
      iinNumber: parsed.data.iinNumber,
      diagnosis: parsed.data.diagnosis,
      ward: parsed.data.ward ?? null,
      admissionDate: parsed.data.admissionDate,
      attendingDoctor: parsed.data.attendingDoctor,
      phone: parsed.data.phone ?? null,
      address: parsed.data.address ?? null,
      status: "active",
    })
    .returning();

  return res.status(201).json(formatPatient(patient));
});

router.get("/:id", async (req: Request, res: Response) => {
  const parsed = GetPatientParams.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const [patient] = await db
    .select()
    .from(patientsTable)
    .where(eq(patientsTable.id, parsed.data.id));

  if (!patient) {
    return res.status(404).json({ error: "Patient not found" });
  }

  return res.json(formatPatient(patient));
});

router.patch("/:id", async (req: Request, res: Response) => {
  const paramsParsed = UpdatePatientParams.safeParse(req.params);
  if (!paramsParsed.success) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const bodyParsed = UpdatePatientBody.safeParse(req.body);
  if (!bodyParsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const updates: Record<string, unknown> = {};
  const body = bodyParsed.data;
  if (body.fullName !== undefined) updates.fullName = body.fullName;
  if (body.diagnosis !== undefined) updates.diagnosis = body.diagnosis;
  if (body.ward !== undefined) updates.ward = body.ward;
  if (body.dischargeDate !== undefined) updates.dischargeDate = body.dischargeDate;
  if (body.status !== undefined) updates.status = body.status;
  if (body.phone !== undefined) updates.phone = body.phone;
  if (body.address !== undefined) updates.address = body.address;

  const [patient] = await db
    .update(patientsTable)
    .set(updates)
    .where(eq(patientsTable.id, paramsParsed.data.id))
    .returning();

  if (!patient) {
    return res.status(404).json({ error: "Patient not found" });
  }

  return res.json(formatPatient(patient));
});

function formatPatient(p: typeof patientsTable.$inferSelect) {
  return {
    id: p.id,
    fullName: p.fullName,
    birthDate: p.birthDate,
    gender: p.gender,
    iinNumber: p.iinNumber,
    diagnosis: p.diagnosis,
    ward: p.ward,
    admissionDate: p.admissionDate,
    dischargeDate: p.dischargeDate,
    status: p.status,
    attendingDoctor: p.attendingDoctor,
    phone: p.phone,
    address: p.address,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export default router;
