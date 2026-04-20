import { queryCamel, queryCamelOne } from "../../utils/db.util";
import { userQueries } from "./user.queries";
import { UserCrudCreateParams, UserCrudUpdateParams, UserDetail, UserEmailLookup, UserListItem, UserRoleLookup } from "./user.types";

export const userRepository = {
  async findAll(): Promise<UserListItem[]> {
    return queryCamel<UserListItem>(userQueries.findAll);
  },

  async findDetailById(id: string): Promise<UserDetail | null> {
    return queryCamelOne<UserDetail>(userQueries.findDetailById, [id]);
  },

  async findByEmail(email: string): Promise<UserEmailLookup | null> {
    return queryCamelOne<UserEmailLookup>(userQueries.findByEmail, [email]);
  },

  async findRoleByName(name: string): Promise<UserRoleLookup | null> {
    return queryCamelOne<UserRoleLookup>(userQueries.findRoleByName, [name]);
  },

  async create(params: UserCrudCreateParams): Promise<UserDetail | null> {
    return queryCamelOne<UserDetail>(userQueries.create, [params.roleId, params.email, params.hashedPassword, params.isActive, params.actorId]);
  },

  async update(id: string, params: UserCrudUpdateParams): Promise<UserDetail | null> {
    return queryCamelOne<UserDetail>(userQueries.update, [params.roleId, params.email, params.hashedPassword, params.isActive, params.actorId, id]);
  },

  async softDelete(id: string, actorId: string): Promise<UserDetail | null> {
    return queryCamelOne<UserDetail>(userQueries.softDelete, [id, actorId]);
  },
};
