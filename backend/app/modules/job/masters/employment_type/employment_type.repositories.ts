import { queryCamel, queryCamelOne } from "../../../../utils/db.util";
import { employmentTypeQueries } from "./employment_type.queries";
import { EmploymentType, EmploymentTypeDetail, EmploymentTypePayload } from "./employment_type.types";

type EmploymentTypeLookup = Pick<EmploymentType, "id" | "name" | "code">;

export const employmentTypeRepository = {
  async getAll(): Promise<EmploymentType[]> {
    return queryCamel<EmploymentType>(employmentTypeQueries.getAll);
  },

  async getById(id: string): Promise<EmploymentType | null> {
    return queryCamelOne<EmploymentType>(employmentTypeQueries.getById, [id]);
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
};
