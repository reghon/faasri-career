export interface Department {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
}

export interface DepartmentDetail {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface DepartmentPayload {
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
}
