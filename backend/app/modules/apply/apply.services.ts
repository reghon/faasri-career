import { AppError } from "../../errors/app-error";
import pool from "../../configurations/database";
import { applicantProfileRepository } from "../applicant/applicant_profile/applicant_profile.repositories";
import { applyRepository } from "./apply.repositories";
import { applyProfileService } from "./applicant_profile/apply_profile.services";
import { applyEducationService } from "./educations/apply_education.services";
import { applyWorkExperienceService } from "./work_experiences/apply_work_experience.services";
import { applyCertificationService } from "./certifications/apply_certification.services";
import { applyLanguageService } from "./languages/apply_language.services";
import { applyTechnicalSkillService } from "./technical_skills/apply_technical_skill.services";
import { applyStatusRepository } from "./statuses/apply_status.repositories";
import { applyStatusHistoryRepository } from "./status_histories/apply_status_history.repositories";
import { CreateApplyBodyInput, UpdateApplyStatusBodyInput } from "./apply.schemas";

export const applyService = {
  async getAll() {
    const client = await pool.connect();

    try {
      return applyRepository.getAll(client);
    } finally {
      client.release();
    }
  },
  
  async createApply(userId: string, payload: CreateApplyBodyInput) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const profile = await applicantProfileRepository.getByUserId(userId);

      if (!profile) {
        throw new AppError(404, "Applicant profile not found");
      }

      const defaultStatus = await applyStatusRepository.getDefaultByJobId(client, payload.jobId);
      if (!defaultStatus) {
        throw new AppError(400, "Default apply status for this job is not configured");
      }

      const createdApply = await applyRepository.create(
        client,
        {
          applicantProfileId: profile.id,
          jobId: payload.jobId,
          statusId: defaultStatus.id,
          applicationCode: null,
          notes: null,
        },
        userId,
      );

      if (!createdApply) {
        throw new AppError(500, "Failed to create apply");
      }

      const applyId = createdApply.id;

      const profileSnapshot = await applyProfileService.createSnapshot(client, applyId, payload.personalInfo, userId);

      if (!profileSnapshot) {
        throw new AppError(500, "Failed to create apply profile snapshot");
      }

      await applyEducationService.createSnapshots(client, applyId, payload.educationInfo.educations, userId);

      await applyWorkExperienceService.createSnapshots(client, applyId, payload.experienceInfo.experiences, userId);

      await applyCertificationService.createSnapshots(client, applyId, payload.experienceInfo.certifications, userId);

      await applyLanguageService.createSnapshots(client, applyId, payload.experienceInfo.languages, userId);

      await applyTechnicalSkillService.createSnapshots(client, applyId, payload.experienceInfo.technicalSkills, userId);

      await applyStatusHistoryRepository.create(
        client,
        {
          applyId,
          applyStatusId: defaultStatus.id,
          applyStatusName: defaultStatus.name,
          notes: null,
        },
        userId,
        new Date(),
      );

      await client.query("COMMIT");

      return createdApply;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
  async getMine(userId: string) {
    const client = await pool.connect();

    try {
      const profile = await applicantProfileRepository.getByUserId(userId);

      if (!profile) {
        throw new AppError(404, "Applicant profile not found");
      }

      return applyRepository.getMine(client, profile.id);
    } finally {
      client.release();
    }
  },

  async getApplyListByApplicantProfileId(applicantProfileId: string) {
    const client = await pool.connect();

    try {
      return applyRepository.getByApplicantProfileId(client, applicantProfileId);
    } finally {
      client.release();
    }
  },

  async getApplyDetailById(applicantProfileId: string, applyId: string) {
    const client = await pool.connect();

    try {
      return applyRepository.getApplyDetail(client, applyId, applicantProfileId);
    } finally {
      client.release();
    }
  },

  async updateStatus(userId: string, applyId: string, data: UpdateApplyStatusBodyInput) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const existing = await applyRepository.getById(client, applyId);

      if (!existing) {
        throw new AppError(404, "Apply not found");
      }

      const updated = await applyRepository.updateStatus(client, applyId, data, userId);

      if (!updated) {
        throw new AppError(500, "Failed to update apply status");
      }

      const targetStatus = await applyStatusRepository.getById(data.statusId);

      if (!targetStatus) {
        throw new AppError(404, "Target apply status not found");
      }

      await applyStatusHistoryRepository.create(
        client,
        {
          applyId,
          applyStatusId: targetStatus.id,
          applyStatusName: targetStatus.name,
          notes: null,
        },
        userId,
        new Date(),
      );

      await client.query("COMMIT");

      return updated;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async getByJobId(jobId: string) {
    const client = await pool.connect();

    try {
      return applyRepository.getByJobId(client, jobId);
    } finally {
      client.release();
    }
  },
  async getMineDetail(userId: string, applyId: string) {
    const client = await pool.connect();

    try {
      const profile = await applicantProfileRepository.getByUserId(userId);

      if (!profile) {
        throw new AppError(404, "Applicant profile not found");
      }

      const data = await applyRepository.getApplyDetail(client, applyId, profile.id);

      if (!data) {
        throw new AppError(404, "Apply not found");
      }

      return data;
    } finally {
      client.release();
    }
  },

  async hasApplied(userId: string, jobId: string) {
    const client = await pool.connect();

    try {
      const profile = await applicantProfileRepository.getByUserId(userId);

      if (!profile) {
        throw new AppError(404, "Applicant profile not found");
      }

      return applyRepository.hasApplied(client, profile.id, jobId);
    } finally {
      client.release();
    }
  },
};
