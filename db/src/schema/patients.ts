import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const patientsTable = pgTable("patients", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  birthDate: text("birth_date").notNull(),
  gender: text("gender").notNull(),
  iinNumber: text("iin_number").notNull(),
  diagnosis: text("diagnosis").notNull(),
  ward: text("ward"),
  admissionDate: text("admission_date").notNull(),
  dischargeDate: text("discharge_date"),
  status: text("status").notNull().default("active"),
  attendingDoctor: text("attending_doctor").notNull(),
  phone: text("phone"),
  address: text("address"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertPatientSchema = createInsertSchema(patientsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patientsTable.$inferSelect;
