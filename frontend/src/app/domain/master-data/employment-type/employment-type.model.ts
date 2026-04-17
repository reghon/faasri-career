export interface EmploymentType {
  id: string;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
}

export interface EmploymentTypeDetail {
  id: string;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface EmploymentTypePayload {
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
}
