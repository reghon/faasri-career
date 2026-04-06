import { queryCamel, queryCamelOne } from "../../../../utils/db.util";
import { employmentTypeQueries } from "./employment_type.queries";
import { EmploymentType, EmploymentTypePayload } from "./employment_type.types";

export const employmentTypeRepository = {
  async getAll(): Promise<EmploymentType[]> {
    return queryCamel<EmploymentType>(employmentTypeQueries.getAll);
  },

  async getById(id: string): Promise<EmploymentType | null> {
    return queryCamelOne<EmploymentType>(employmentTypeQueries.getById, [id]);
  },

  async getByName(name: string): Promise<EmploymentType | null> {
    return queryCamelOne<EmploymentType>(employmentTypeQueries.getByName, [name]);
  },

  async create(data: EmploymentTypePayload, actorId: string): Promise<EmploymentType | null> {
    return queryCamelOne<EmploymentType>(employmentTypeQueries.create, [data.name, data.description, data.isActive, actorId]);
  },

  async update(id: string, data: EmploymentTypePayload, actorId: string): Promise<EmploymentType | null> {
    return queryCamelOne<EmploymentType>(employmentTypeQueries.update, [data.name, data.description, data.isActive, actorId, id]);
  },

  async softDelete(id: string, actorId: string): Promise<EmploymentType | null> {
    return queryCamelOne<EmploymentType>(employmentTypeQueries.softDelete, [id, actorId]);
  },
};
