export interface WorkMode {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}

export interface WorkModeDetail {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface WorkModePayload {
  code: string;
  name: string;
  isActive: boolean;
}
