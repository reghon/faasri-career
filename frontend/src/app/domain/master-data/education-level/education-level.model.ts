export interface EducationLevel {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
}

export interface EducationLevelDetail {
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

export interface EducationLevelPayload {
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
}
