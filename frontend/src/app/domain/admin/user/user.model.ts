export interface UserMe {
  id: string;
  email: string;
  isActive: boolean;
  roleId: string | null;
  roleName: string | null;
}

export interface User {
  id: string;
  roleId: string | null;
  roleName: string | null;
  email: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
}

export interface UserDetail {
  id: string;
  roleId: string | null;
  roleName: string | null;
  email: string;
  isActive: boolean;
  otp: string | null;
  otpExpiredAt: string | null;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface UserCreateResult {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  roleId: string | null;
}

export interface CreateUserByAdminPayload {
  email: string;
  password: string;
  roleName: string;
}

export interface UserPayload {
  email: string;
  password: string;
  roleName: string;
  isActive: boolean;
}

export interface UserUpdatePayload {
  email: string;
  password?: string;
  roleName: string;
  isActive: boolean;
}
