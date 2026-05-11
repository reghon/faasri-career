import { queryCamel, queryCamelOne } from "../../../../utils/db.util";
import { employmentTypeQueries } from "./employment_type.queries";
import { CountResult, EmploymentType, EmploymentTypeDetail, EmploymentTypePayload } from "./employment_type.types";

type EmploymentTypeLookup = Pick<EmploymentType, "id" | "name" | "code">;

export const employmentTypeRepository = {
  async getAll(): Promise<EmploymentType[]> {
    return queryCamel<EmploymentType>(employmentTypeQueries.getAll);
  },

  async getAllDeleted(): Promise<EmploymentType[]> {
    return queryCamel<EmploymentType>(employmentTypeQueries.getAllDeleted);
  },

  async getById(id: string): Promise<EmploymentType | null> {
    return queryCamelOne<EmploymentType>(employmentTypeQueries.getById, [id]);
  },

  async getSoftDeletedById(id: string): Promise<EmploymentType | null> {
    return queryCamelOne<EmploymentType>(employmentTypeQueries.getSoftDeletedById, [id]);
  },

  async getDetailById(id: string): Promise<EmploymentTypeDetail | null> {
    return queryCamelOne<EmploymentTypeDetail>(employmentTypeQueries.getDetailById, [id]);
  },

  async getByName(name: string): Promise<EmploymentTypeLookup | null> {
    return queryCamelOne<EmploymentTypeLookup>(employmentTypeQueries.getByName, [name]);
  },

  async getByCode(code: string): Promise<EmploymentTypeLookup | null> {
    return queryCamelOne<EmploymentTypeLookup>(employmentTypeQueries.getByCode, [code]);
  },

  async create(data: EmploymentTypePayload, actorId: string): Promise<EmploymentType | null> {
    return queryCamelOne<EmploymentType>(employmentTypeQueries.create, [data.name, data.code, data.description, data.isActive, actorId]);
  },

  async update(id: string, data: EmploymentTypePayload, actorId: string): Promise<EmploymentType | null> {
    return queryCamelOne<EmploymentType>(employmentTypeQueries.update, [data.name, data.code, data.description, data.isActive, actorId, id]);
  },

  async softDelete(id: string, actorId: string): Promise<EmploymentTypeDetail | null> {
    return queryCamelOne<EmploymentTypeDetail>(employmentTypeQueries.softDelete, [id, actorId]);
  },

  async countOpenJobsUsage(id: string): Promise<number> {
    const result = await queryCamelOne<CountResult>(employmentTypeQueries.countOpenJobsUsage, [id]);
    return result?.count ?? 0;
  },

  async countJobsUsage(id: string): Promise<number> {
    const result = await queryCamelOne<CountResult>(employmentTypeQueries.countJobsUsage, [id]);
    return result?.count ?? 0;
  },

  async hardDelete(id: string): Promise<EmploymentTypeDetail | null> {
    return queryCamelOne<EmploymentTypeDetail>(employmentTypeQueries.hardDelete, [id]);
  },

  async restore(id: string, actorId: string): Promise<EmploymentTypeDetail | null> {
    return queryCamelOne<EmploymentTypeDetail>(employmentTypeQueries.restore, [id, actorId]);
  },
};
