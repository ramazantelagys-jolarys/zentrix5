import { Router, Request, Response } from "express";
import { db } from "@workspace/db";
import { medicalFormsTable, patientsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  GetPatientFormsParams,
  CreateFormBody,
  GetFormParams,
  UpdateFormParams,
  UpdateFormBody,
  SubmitFormParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/patients/:id/forms", async (req: Request, res: Response) => {
  const parsed = GetPatientFormsParams.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const forms = await db
    .select()
    .from(medicalFormsTable)
    .where(eq(medicalFormsTable.patientId, parsed.data.id));

  return res.json(forms.map(formatForm));
});

router.post("/forms", async (req: Request, res: Response) => {
  const parsed = CreateFormBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const [form] = await db
    .insert(medicalFormsTable)
    .values({
      patientId: parsed.data.patientId,
      formType: parsed.data.formType,
      complaints: parsed.data.complaints ?? null,
      anamnesis: parsed.data.anamnesis ?? null,
      objectiveStatus: parsed.data.objectiveStatus ?? null,
      diagnosis: parsed.data.diagnosis ?? null,
      treatment: parsed.data.treatment ?? null,
      recommendations: parsed.data.recommendations ?? null,
      doctorNotes: parsed.data.doctorNotes ?? null,
      status: "draft",
    })
    .returning();

  return res.status(201).json(formatForm(form));
});

router.get("/forms/:id", async (req: Request, res: Response) => {
  const parsed = GetFormParams.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const [form] = await db
    .select()
    .from(medicalFormsTable)
    .where(eq(medicalFormsTable.id, parsed.data.id));

  if (!form) {
    return res.status(404).json({ error: "Form not found" });
  }

  return res.json(formatForm(form));
});

router.patch("/forms/:id", async (req: Request, res: Response) => {
  const paramsParsed = UpdateFormParams.safeParse(req.params);
  if (!paramsParsed.success) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const bodyParsed = UpdateFormBody.safeParse(req.body);
  if (!bodyParsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const updates: Record<string, unknown> = {};
  const body = bodyParsed.data;
  if (body.complaints !== undefined) updates.complaints = body.complaints;
  if (body.anamnesis !== undefined) updates.anamnesis = body.anamnesis;
  if (body.objectiveStatus !== undefined) updates.objectiveStatus = body.objectiveStatus;
  if (body.diagnosis !== undefined) updates.diagnosis = body.diagnosis;
  if (body.treatment !== undefined) updates.treatment = body.treatment;
  if (body.recommendations !== undefined) updates.recommendations = body.recommendations;
  if (body.doctorNotes !== undefined) updates.doctorNotes = body.doctorNotes;

  const [form] = await db
    .update(medicalFormsTable)
    .set(updates)
    .where(eq(medicalFormsTable.id, paramsParsed.data.id))
    .returning();

  if (!form) {
    return res.status(404).json({ error: "Form not found" });
  }

  return res.json(formatForm(form));
});

router.post("/forms/:id/submit", async (req: Request, res: Response) => {
  const parsed = SubmitFormParams.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const [form] = await db
    .update(medicalFormsTable)
    .set({
      status: "submitted",
      submittedAt: new Date().toISOString(),
      submittedBy: "Дежурный врач",
    })
    .where(eq(medicalFormsTable.id, parsed.data.id))
    .returning();

  if (!form) {
    return res.status(404).json({ error: "Form not found" });
  }

  return res.json(formatForm(form));
});

function formatForm(f: typeof medicalFormsTable.$inferSelect) {
  return {
    id: f.id,
    patientId: f.patientId,
    formType: f.formType,
    complaints: f.complaints,
    anamnesis: f.anamnesis,
    objectiveStatus: f.objectiveStatus,
    diagnosis: f.diagnosis,
    treatment: f.treatment,
    recommendations: f.recommendations,
    doctorNotes: f.doctorNotes,
    status: f.status,
    submittedAt: f.submittedAt,
    submittedBy: f.submittedBy,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
  };
}

export default router;
