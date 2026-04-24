import { AppError } from "../../../errors/app-error";
import { permissionRepository } from "../permissions/permission.repositories";
import { roleRepository } from "../../role/role.repositories";
import { rolePermissionRepository } from "./role_permission.repositories";
import { RolePermissionPayload } from "./role_permission.types";

export const rolePermissionService = {
  async getAll() {
    return rolePermissionRepository.getAll();
  },

  async create(userId: string, data: RolePermissionPayload) {
    const role = await roleRepository.getById(data.roleId);
    if (!role) {
      throw new AppError(404, "Role not found");
    }

    const permission = await permissionRepository.getById(data.permissionId);
    if (!permission) {
      throw new AppError(404, "Permission not found");
    }

    const existingCombination = await rolePermissionRepository.getByRoleAndPermission(data.roleId, data.permissionId);

    if (existingCombination) {
      throw new AppError(409, "Role permission already exists");
    }

    const created = await rolePermissionRepository.create(data, userId);
    if (!created) {
      throw new AppError(500, "Failed to create role permission");
    }

    const fullData = await rolePermissionRepository.getById(created.id);
    if (!fullData) {
      throw new AppError(500, "Failed to load created role permission");
    }

    return fullData;
  },

  async update(userId: string, id: string, data: RolePermissionPayload) {
    const existing = await rolePermissionRepository.getById(id);
    if (!existing) {
      throw new AppError(404, "Role permission not found");
    }

    const role = await roleRepository.getById(data.roleId);
    if (!role) {
      throw new AppError(404, "Role not found");
    }

    const permission = await permissionRepository.getById(data.permissionId);
    if (!permission) {
      throw new AppError(404, "Permission not found");
    }

    const existingCombination = await rolePermissionRepository.getByRoleAndPermission(data.roleId, data.permissionId);

    if (existingCombination && existingCombination.id !== id) {
      throw new AppError(409, "Role permission already exists");
    }

    const updated = await rolePermissionRepository.update(id, data, userId);
    if (!updated) {
      throw new AppError(500, "Failed to update role permission");
    }

    const fullData = await rolePermissionRepository.getById(updated.id);
    if (!fullData) {
      throw new AppError(500, "Failed to load updated role permission");
    }

    return fullData;
  },

  async delete(userId: string, id: string) {
    const existing = await rolePermissionRepository.getById(id);
    if (!existing) {
      throw new AppError(404, "Role permission not found");
    }

    const deleted = await rolePermissionRepository.softDelete(id, userId);
    if (!deleted) {
      throw new AppError(500, "Failed to delete role permission");
    }
  },
};
