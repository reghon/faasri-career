import { queryCamel, queryCamelOne } from "../../../../utils/db.util";
import { educationLevelQueries } from "./education_level.queries";
import { CountResult, EducationLevel, EducationLevelPayload } from "./education_level.types";

export const educationLevelRepository = {
  async getAll(): Promise<EducationLevel[]> {
    return queryCamel<EducationLevel>(educationLevelQueries.getAll);
  },

  async getAllDeleted(): Promise<EducationLevel[]> {
    return queryCamel<EducationLevel>(educationLevelQueries.getAllDeleted);
  },

  async getById(id: string): Promise<EducationLevel | null> {
    return queryCamelOne<EducationLevel>(educationLevelQueries.getById, [id]);
  },

  async getSoftDeletedById(id: string): Promise<EducationLevel | null> {
    return queryCamelOne<EducationLevel>(educationLevelQueries.getSoftDeletedById, [id]);
  },

  async getByName(name: string): Promise<EducationLevel | null> {
    return queryCamelOne<EducationLevel>(educationLevelQueries.getByName, [name]);
  },

  async getByCode(code: string): Promise<EducationLevel | null> {
    return queryCamelOne<EducationLevel>(educationLevelQueries.getByCode, [code]);
  },

  async create(data: EducationLevelPayload, actorId: string): Promise<EducationLevel | null> {
    return queryCamelOne<EducationLevel>(educationLevelQueries.create, [data.code, data.name, data.description, data.isActive, actorId]);
  },

  async update(id: string, data: EducationLevelPayload, actorId: string): Promise<EducationLevel | null> {
    return queryCamelOne<EducationLevel>(educationLevelQueries.update, [data.code, data.name, data.description, data.isActive, actorId, id]);
  },

  async softDelete(id: string, actorId: string): Promise<EducationLevel | null> {
    return queryCamelOne<EducationLevel>(educationLevelQueries.softDelete, [id, actorId]);
  },

  async countOpenJobsUsage(id: string): Promise<number> {
    const result = await queryCamelOne<CountResult>(educationLevelQueries.countOpenJobsUsage, [id]);
    return result?.count ?? 0;
  },

  async countJobsUsage(id: string): Promise<number> {
    const result = await queryCamelOne<CountResult>(educationLevelQueries.countJobsUsage, [id]);
    return result?.count ?? 0;
  },

  async hardDelete(id: string): Promise<EducationLevel | null> {
    return queryCamelOne<EducationLevel>(educationLevelQueries.hardDelete, [id]);
  },

  async restore(id: string, actorId: string): Promise<EducationLevel | null> {
    return queryCamelOne<EducationLevel>(educationLevelQueries.restore, [id, actorId]);
  },
};
