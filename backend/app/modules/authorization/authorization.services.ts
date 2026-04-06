import { authorizationRepository } from "./authorization.repositories";

export const authorizationService = {
  async hasPermission(roleId: string, permissionCode: string): Promise<boolean> {
    return authorizationRepository.hasPermission(roleId, permissionCode);
  },

  async getRolePermissions(roleId: string) {
    return authorizationRepository.getRolePermissions(roleId);
  },
};
