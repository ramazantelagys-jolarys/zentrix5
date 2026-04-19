import { Router, type IRouter } from "express";
import healthRouter from "./health";
import patientsRouter from "./patients";
import formsRouter from "./forms";
import appointmentsRouter from "./appointments";
import dashboardRouter from "./dashboard";
import authRouter from "./auth";
import { requireAuth, requireDoctor } from "../middlewares/auth";

const router: IRouter = Router();

// Public routes
router.use(healthRouter);
router.use("/auth", authRouter);

// Protected routes (require valid JWT)
router.use("/patients", requireAuth, requireDoctor, patientsRouter);
router.use(requireAuth, requireDoctor, formsRouter);
router.use("/appointments", requireAuth, requireDoctor, appointmentsRouter);
router.use("/schedule", requireAuth, requireDoctor, appointmentsRouter);
router.use("/dashboard", requireAuth, dashboardRouter);

export default router;
