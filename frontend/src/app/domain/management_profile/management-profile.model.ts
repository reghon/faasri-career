export interface ManagementProfile {
  id: string;
  userId: string;
  roleId: string;
  fullName: string;
  isActive: boolean;
}

export interface ManagementProfilePayload {
  userId: string;
  roleId: string;
  fullName: string;
  isActive: boolean;
}
