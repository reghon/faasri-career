import { queryCamel, queryCamelOne } from "../../utils/db.util";
import { userQueries } from "./user.queries";
import { CountResult, UserCrudCreateParams, UserCrudUpdateParams, UserDetail, UserEmailLookup, UserListItem, UserRoleLookup } from "./user.types";

export const userRepository = {
  async getAll(): Promise<UserListItem[]> {
    return queryCamel<UserListItem>(userQueries.getAll);
  },

  async getAllManagement(): Promise<UserListItem[]> {
    return queryCamel<UserListItem>(userQueries.getAllManagement);
  },

  async getAllDeleted(): Promise<UserListItem[]> {
    return queryCamel<UserListItem>(userQueries.getAllDeleted);
  },

  async getById(id: string): Promise<UserDetail | null> {
    return queryCamelOne<UserDetail>(userQueries.getById, [id]);
  },

  async getSoftDeletedById(id: string): Promise<UserDetail | null> {
    return queryCamelOne<UserDetail>(userQueries.getSoftDeletedById, [id]);
  },

  async getByEmail(email: string): Promise<UserEmailLookup | null> {
    return queryCamelOne<UserEmailLookup>(userQueries.getByEmail, [email]);
  },

  async getRoleByName(name: string): Promise<UserRoleLookup | null> {
    return queryCamelOne<UserRoleLookup>(userQueries.getRoleByName, [name]);
  },

  async create(params: UserCrudCreateParams): Promise<UserDetail | null> {
    return queryCamelOne<UserDetail>(userQueries.create, [params.roleId, params.email, params.hashedPassword, params.isActive, params.actorId]);
  },

  async update(id: string, params: UserCrudUpdateParams): Promise<UserDetail | null> {
    return queryCamelOne<UserDetail>(userQueries.update, [params.roleId, params.email, params.hashedPassword, params.isActive, params.actorId, id]);
  },

  async restore(id: string, actorId: string): Promise<UserDetail | null> {
    return queryCamelOne<UserDetail>(userQueries.restore, [id, actorId]);
  },

  async softDelete(id: string, actorId: string): Promise<UserDetail | null> {
    return queryCamelOne<UserDetail>(userQueries.softDelete, [id, actorId]);
  },

  async hardDelete(id: string): Promise<UserDetail | null> {
    return queryCamelOne<UserDetail>(userQueries.hardDelete, [id]);
  },
};
