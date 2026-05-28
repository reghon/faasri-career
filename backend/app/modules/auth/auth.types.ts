export type Auth = {
  id: string;
  roleId: string | null;
  email: string;
  password: string;
  isActive: boolean;
  otp: string | null;
  otpExpiredAt: string | null;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
  roleName: string | null;
  sessionVersion: number;
};

export type AuthMe = {
  id: string;
  email: string;
  isActive: boolean;
  roleId: string | null;
  roleName: string | null;
  sessionVersion: number;
};

export type AuthRegisterResult = {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  roleId: string | null;
};

export type RefreshTokenRecord = {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
};
