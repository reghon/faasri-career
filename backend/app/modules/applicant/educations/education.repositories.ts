import { queryCamel, queryCamelOne } from "../../../utils/db.util";
import { educationQueries } from "./education.queries";
import { Education, EducationPayload } from "./education.types";

export const educationRepository = {
  async getByProfileId(profileId: string): Promise<Education[]> {
    return queryCamel<Education>(educationQueries.getByProfileId, [profileId]);
  },

  async getById(id: string, profileId: string): Promise<Education | null> {
    return queryCamelOne<Education>(educationQueries.getById, [id, profileId]);
  },

  async create(profileId: string, data: EducationPayload, actorId: string): Promise<Education | null> {
    return queryCamelOne<Education>(educationQueries.create, [
      profileId,
      data.level,
      data.country,
      data.institution,
      data.major,
      data.isStillStudying,
      data.startDay,
      data.startMonth,
      data.startYear,
      data.endDay,
      data.endMonth,
      data.endYear,
      data.gpa,
      data.gpaScale,
      actorId,
    ]);
  },

  async update(id: string, profileId: string, data: EducationPayload, actorId: string): Promise<Education | null> {
    return queryCamelOne<Education>(educationQueries.update, [
      data.level,
      data.country,
      data.institution,
      data.major,
      data.isStillStudying,
      data.startDay,
      data.startMonth,
      data.startYear,
      data.endDay,
      data.endMonth,
      data.endYear,
      data.gpa,
      data.gpaScale,
      actorId,
      id,
      profileId,
    ]);
  },

  async softDelete(id: string, profileId: string, actorId: string): Promise<{ id: string } | null> {
    return queryCamelOne<{ id: string }>(educationQueries.softDelete, [id, profileId, actorId]);
  },
};
