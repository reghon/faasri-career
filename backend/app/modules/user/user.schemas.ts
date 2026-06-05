import { z } from "zod";

const passwordSchema = z.string().min(8, "Password minimal 8 karakter").regex(/[A-Z]/, "Password harus mengandung minimal 1 huruf besar").regex(/[0-9]/, "Password harus mengandung minimal 1 angka");

export const userBodySchema = z.object({
  fullName: z.string().trim().min(3, "Full name minimal 3 karakter").max(255),
  email: z.string().trim().min(1, "Email is required").email("Invalid email format"),
  password: passwordSchema,
  roleName: z.string().trim().min(1, "Role name is required"),
  isActive: z.boolean(),
});

export const userUpdateBodySchema = z.object({
  email: z.string().trim().min(1, "Alamat email wajib diisi").email("Invalid email format"),
  password: z
    .string()
    .trim()
    .optional()
    .transform((value) => {
      if (value === undefined) return undefined;
      return value === "" ? undefined : value;
    })
    .refine((value) => value === undefined || (value.length >= 8 && /[A-Z]/.test(value) && /[0-9]/.test(value)), {
      message: "Kata sandi harus terdiri dari minimal 8 karakter dan mengandung setidaknya satu huruf besar serta satu angka",
    }),
  roleName: z.string().trim().min(1, "Role wajib diisi"),
  isActive: z.boolean(),
});

export const userParamsSchema = z.object({
  id: z.string().uuid("ID tidak valid"),
});

export type UserBodyInput = z.infer<typeof userBodySchema>;
export type UserUpdateBodyInput = z.infer<typeof userUpdateBodySchema>;
export type UserParamsInput = z.infer<typeof userParamsSchema>;
