import "dotenv/config";
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import pool from "./configurations/database";
import { config } from "./configurations/env";


import userRoutes from "./modules/users/user.routes";
import applicantProfileRoutes from "./modules/applicant/applicant_profile/applicant_profile.routes";
import workExperienceRoutes from "./modules/applicant/work_experiences/work_experience.routes";
import educationRoutes from "./modules/applicant/educations/education.routes";
import certificationRoutes from "./modules/applicant/certifications/certification.routes";
import languageRoutes from "./modules/applicant/languages/language.routes";
import technicalSkillRoutes from "./modules/applicant/technical_skills/technical_skill.routes";
import applicantMasterRoutes from "./modules/applicant/applicant_master.routes";
import employmentTypeRoutes from "./modules/job/masters/employment_type/employment_type.routes";
import jobCategoryRoutes from "./modules/job/masters/job_category/job_category.routes";
import jobLocationRoutes from "./modules/job/masters/job_locations/job_location.routes";
import jobStatusRoutes from "./modules/job/masters/job_statuses/job_status.routes";
import workModeRoutes from "./modules/job/masters/work_modes/work_mode.routes";
import educationLevelRoutes from "./modules/job/masters/education_levels/education_level.routes";
import departmentRoutes from "./modules/job/masters/departments/department.routes";

import { errorMiddleware } from "./middlewares/error.middleware";

const app: Application = express();
const PORT = Number(process.env.PORT) || config.app.port;

const allowedOrigins = ["http://localhost:4200", process.env.CLIENT_URL].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.status(200).send("Backend is running");
});

app.use("/api/auth", userRoutes);
app.use("/api/applicant/profile", applicantProfileRoutes);
app.use("/api/applicant/work-experiences", workExperienceRoutes);
app.use("/api/applicant/educations", educationRoutes);
app.use("/api/applicant/certifications", certificationRoutes);
app.use("/api/applicant/languages", languageRoutes);
app.use("/api/applicant/technical-skills", technicalSkillRoutes);
app.use("/api/applicant/applicant-master", applicantMasterRoutes);
app.use("/api/job/employment-types", employmentTypeRoutes);
app.use("/api/job/job-categories", jobCategoryRoutes);
app.use("/api/job/job-locations", jobLocationRoutes);
app.use("/api/job/job-statuses", jobStatusRoutes);
app.use("/api/job/work-modes", workModeRoutes);
app.use("/api/job/education-levels", educationLevelRoutes);
app.use("/api/job/departments", departmentRoutes);

app.use(errorMiddleware);

async function bootstrap() {
  try {
    const client = await pool.connect();
    console.log("✅ Database connected");
    client.release();

    app.listen(PORT, "127.0.0.1", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

bootstrap();

export default app;
