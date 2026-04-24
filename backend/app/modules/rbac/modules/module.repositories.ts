import { queryCamel, queryCamelOne } from "../../../utils/db.util";
import { moduleQueries } from "./module.queries";
import { Module, ModulePayload } from "./module.types";

export const moduleRepository = {
  async getAll(): Promise<Module[]> {
    return queryCamel<Module>(moduleQueries.getAll);
  },

  async getById(id: string): Promise<Module | null> {
    return queryCamelOne<Module>(moduleQueries.getById, [id]);
  },

  async getByCode(code: string): Promise<Module | null> {
    return queryCamelOne<Module>(moduleQueries.getByCode, [code]);
  },

  async getByName(name: string): Promise<Module | null> {
    return queryCamelOne<Module>(moduleQueries.getByName, [name]);
  },

  async create(data: ModulePayload, actorId: string): Promise<Module | null> {
    return queryCamelOne<Module>(moduleQueries.create, [data.code, data.name, data.description, data.isActive, actorId]);
  },

  async update(id: string, data: ModulePayload, actorId: string): Promise<Module | null> {
    return queryCamelOne<Module>(moduleQueries.update, [data.code, data.name, data.description, data.isActive, actorId, id]);
  },

  async softDelete(id: string, actorId: string) {
    return queryCamelOne<{ id: string }>(moduleQueries.softDelete, [id, actorId]);
  },
};
