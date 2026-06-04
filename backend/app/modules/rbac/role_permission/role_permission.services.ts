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
      throw new AppError(404, "Role tidak ditemukan");
    }

    const permission = await permissionRepository.getById(data.permissionId);
    if (!permission) {
      throw new AppError(404, "Permission tidak ditemukan");
    }

    const existingCombination = await rolePermissionRepository.getByRoleAndPermission(data.roleId, data.permissionId);

    if (existingCombination) {
      throw new AppError(409, "Role permission sudah ada");
    }

    const created = await rolePermissionRepository.create(data, userId);
    if (!created) {
      throw new AppError(500, "Gagal membuat role permission");
    }

    const fullData = await rolePermissionRepository.getById(created.id);
    if (!fullData) {
      throw new AppError(500, "Gagal memuat role permission yang dibuat");
    }

    return fullData;
  },

  async update(userId: string, id: string, data: RolePermissionPayload) {
    const existing = await rolePermissionRepository.getById(id);
    if (!existing) {
      throw new AppError(404, "Role permission tidak ditemukan");
    }

    const role = await roleRepository.getById(data.roleId);
    if (!role) {
      throw new AppError(404, "Role tidak ditemukan");
    }

    const permission = await permissionRepository.getById(data.permissionId);
    if (!permission) {
      throw new AppError(404, "Permission tidak ditemukan");
    }

    const existingCombination = await rolePermissionRepository.getByRoleAndPermission(data.roleId, data.permissionId);

    if (existingCombination && existingCombination.id !== id) {
      throw new AppError(409, "Role permission sudah ada");
    }

    const updated = await rolePermissionRepository.update(id, data, userId);
    if (!updated) {
      throw new AppError(500, "Gagal memperbarui role permission");
    }

    const fullData = await rolePermissionRepository.getById(updated.id);
    if (!fullData) {
      throw new AppError(500, "Gagal memuat role permission yang diperbarui");
    }

    return fullData;
  },

  async delete(userId: string, id: string) {
    const existing = await rolePermissionRepository.getById(id);
    if (!existing) {
      throw new AppError(404, "Role permission tidak ditemukan");
    }

    const deleted = await rolePermissionRepository.softDelete(id, userId);
    if (!deleted) {
      throw new AppError(500, "Gagal menghapus role permission");
    }
  },
};
