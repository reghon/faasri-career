export interface Module {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
}

export interface ModuleDetail {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type ModulePayload = {
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
};
