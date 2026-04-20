import bcrypt from "bcryptjs";
import { config } from "../../configurations/env";
import { AppError } from "../../errors/app-error";
import { UserBodyInput, UserUpdateBodyInput } from "./user.schemas";
import { userRepository } from "./user.repositories";

export const userService = {
  async getAll() {
    return userRepository.findAll();
  },

  async getById(id: string) {
    const user = await userRepository.findDetailById(id);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    return user;
  },

  async create(data: UserBodyInput, actorId: string) {
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError(409, "Email already registered");
    }

    const role = await userRepository.findRoleByName(data.roleName);

    if (!role) {
      throw new AppError(404, "Role not found");
    }

    const hashedPassword = await bcrypt.hash(data.password, config.bcrypt.saltRounds);

    const created = await userRepository.create({
      email: data.email,
      hashedPassword,
      roleId: role.id,
      isActive: data.isActive,
      actorId,
    });

    if (!created) {
      throw new AppError(500, "Failed to create user");
    }

    return created;
  },

  async update(id: string, data: UserUpdateBodyInput, actorId: string) {
    const existing = await userRepository.findDetailById(id);

    if (!existing) {
      throw new AppError(404, "User not found");
    }

    const duplicateEmail = await userRepository.findByEmail(data.email);

    if (duplicateEmail && duplicateEmail.id !== id) {
      throw new AppError(409, "Email already registered");
    }

    const role = await userRepository.findRoleByName(data.roleName);

    if (!role) {
      throw new AppError(404, "Role not found");
    }

    const hashedPassword = data.password ? await bcrypt.hash(data.password, config.bcrypt.saltRounds) : null;

    const updated = await userRepository.update(id, {
      email: data.email,
      hashedPassword,
      roleId: role.id,
      isActive: data.isActive,
      actorId,
    });

    if (!updated) {
      throw new AppError(500, "Failed to update user");
    }

    return updated;
  },

  async delete(id: string, actorId: string) {
    const existing = await userRepository.findDetailById(id);

    if (!existing) {
      throw new AppError(404, "User not found");
    }

    const deleted = await userRepository.softDelete(id, actorId);

    if (!deleted) {
      throw new AppError(500, "Failed to delete user");
    }

    return deleted;
  },
};
