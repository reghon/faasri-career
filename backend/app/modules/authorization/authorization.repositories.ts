import { queryCamel, queryCamelOne } from "../../utils/db.util";
import { authorizationQueries } from "./authorization.queries";
import { AuthorizationHasPermissionResult, RolePermission } from "./authorization.types";

export const authorizationRepository = {
  async hasPermission(roleId: string, permissionCode: string): Promise<boolean> {
    const result = await queryCamelOne<AuthorizationHasPermissionResult>(authorizationQueries.hasPermission, [roleId, permissionCode]);

    return result?.hasPermission ?? false;
  },

  async getRolePermissions(roleId: string): Promise<RolePermission[]> {
    return queryCamel<RolePermission>(authorizationQueries.getRolePermissions, [roleId]);
  },
};
