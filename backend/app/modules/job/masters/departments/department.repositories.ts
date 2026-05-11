import { queryCamel, queryCamelOne } from "../../../../utils/db.util";
import { departmentQueries } from "./department.queries";
import { CountResult, Department, DepartmentPayload } from "./department.types";

export const departmentRepository = {
  async getAll(): Promise<Department[]> {
    return queryCamel<Department>(departmentQueries.getAll);
  },

  async getAllDeleted(): Promise<Department[]> {
    return queryCamel<Department>(departmentQueries.getAllDeleted);
  },

  async getById(id: string): Promise<Department | null> {
    return queryCamelOne<Department>(departmentQueries.getById, [id]);
  },

  async getSoftDeletedById(id: string): Promise<Department | null> {
    return queryCamelOne<Department>(departmentQueries.getSoftDeletedById, [id]);
  },

  async getByName(name: string): Promise<Department | null> {
    return queryCamelOne<Department>(departmentQueries.getByName, [name]);
  },

  async getByCode(code: string): Promise<Department | null> {
    return queryCamelOne<Department>(departmentQueries.getByCode, [code]);
  },

  async create(data: DepartmentPayload, actorId: string): Promise<Department | null> {
    return queryCamelOne<Department>(departmentQueries.create, [data.code, data.name, data.description, data.isActive, actorId]);
  },

  async update(id: string, data: DepartmentPayload, actorId: string): Promise<Department | null> {
    return queryCamelOne<Department>(departmentQueries.update, [data.code, data.name, data.description, data.isActive, actorId, id]);
  },

  async softDelete(id: string, actorId: string): Promise<Department | null> {
    return queryCamelOne<Department>(departmentQueries.softDelete, [id, actorId]);
  },

  async countOpenJobsUsage(id: string): Promise<number> {
    const result = await queryCamelOne<CountResult>(departmentQueries.countOpenJobsUsage, [id]);
    return result?.count ?? 0;
  },

  async countJobsUsage(id: string): Promise<number> {
    const result = await queryCamelOne<CountResult>(departmentQueries.countJobsUsage, [id]);
    return result?.count ?? 0;
  },

  async hardDelete(id: string): Promise<Department | null> {
    return queryCamelOne<Department>(departmentQueries.hardDelete, [id]);
  },

  async restore(id: string, actorId: string): Promise<Department | null> {
    return queryCamelOne<Department>(departmentQueries.restore, [id, actorId]);
  },
};
