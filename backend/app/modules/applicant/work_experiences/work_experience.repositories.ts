import { queryCamel, queryCamelOne } from "../../../utils/db.util";
import { workExperienceQueries } from "./work_experience.queries";
import { WorkExperience, WorkExperiencePayload } from "./work_experience.types";

export const workExperienceRepository = {
  async getByProfileId(profileId: string): Promise<WorkExperience[]> {
    return queryCamel<WorkExperience>(workExperienceQueries.getByProfileId, [profileId]);
  },

  async getById(id: string, profileId: string): Promise<WorkExperience | null> {
    return queryCamelOne<WorkExperience>(workExperienceQueries.getById, [id, profileId]);
  },

  async create(profileId: string, data: WorkExperiencePayload, actorId: string): Promise<WorkExperience | null> {
    return queryCamelOne<WorkExperience>(workExperienceQueries.create, [
      profileId,
      data.company,
      data.industry,
      data.position,
      data.employmentType,
      data.jobLevel,
      data.teamSize,
      data.startDay,
      data.startMonth,
      data.startYear,
      data.endDay,
      data.endMonth,
      data.endYear,
      data.isCurrentJob,
      data.responsibilities,
      data.leaveReason,
      data.referenceName,
      data.referencePosition,
      data.referencePhoneCode,
      data.referencePhone,
      data.referenceEmail,
      actorId,
    ]);
  },

  async update(id: string, profileId: string, data: WorkExperiencePayload, actorId: string): Promise<WorkExperience | null> {
    return queryCamelOne<WorkExperience>(workExperienceQueries.update, [
      data.company,
      data.industry,
      data.position,
      data.employmentType,
      data.jobLevel,
      data.teamSize,
      data.startDay,
      data.startMonth,
      data.startYear,
      data.endDay,
      data.endMonth,
      data.endYear,
      data.isCurrentJob,
      data.responsibilities,
      data.leaveReason,
      data.referenceName,
      data.referencePosition,
      data.referencePhoneCode,
      data.referencePhone,
      data.referenceEmail,
      actorId,
      id,
      profileId,
    ]);
  },

  async softDelete(id: string, profileId: string, actorId: string): Promise<{ id: string } | null> {
    return queryCamelOne<{ id: string }>(workExperienceQueries.softDelete, [id, profileId, actorId]);
  },
};
