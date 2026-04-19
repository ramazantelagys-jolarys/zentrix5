import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const medicalFormsTable = pgTable("medical_forms", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  formType: text("form_type").notNull(),
  complaints: text("complaints"),
  anamnesis: text("anamnesis"),
  objectiveStatus: text("objective_status"),
  diagnosis: text("diagnosis"),
  treatment: text("treatment"),
  recommendations: text("recommendations"),
  doctorNotes: text("doctor_notes"),
  status: text("status").notNull().default("draft"),
  submittedAt: text("submitted_at"),
  submittedBy: text("submitted_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertMedicalFormSchema = createInsertSchema(medicalFormsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertMedicalForm = z.infer<typeof insertMedicalFormSchema>;
export type MedicalForm = typeof medicalFormsTable.$inferSelect;
