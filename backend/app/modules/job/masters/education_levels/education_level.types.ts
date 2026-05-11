export type EducationLevel = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
};

export type EducationLevelPayload = {
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
};

export type EducationLevelDetail = {
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
};

export type CountResult = {
  count: number;
};
