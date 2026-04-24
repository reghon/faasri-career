import { z } from "zod";

export const rolePermissionBodySchema = z.object({
  roleId: z.string().uuid("Invalid role id"),
  permissionId: z.string().uuid("Invalid permission id"),
  isActive: z.boolean(),
});

export const rolePermissionParamsSchema = z.object({
  id: z.string().uuid("Invalid role permission id"),
});

export type RolePermissionBodyInput = z.infer<typeof rolePermissionBodySchema>;
export type RolePermissionParamsInput = z.infer<typeof rolePermissionParamsSchema>;
