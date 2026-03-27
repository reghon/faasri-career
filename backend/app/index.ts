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

const app: Application = express();
const PORT = Number(process.env.PORT) || config.app.port;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://faasri-career.vercel.app",
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
