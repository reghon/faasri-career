export type ApplyLanguage = {
  id: string;
  applyId: string;
  language: string | null;
  proficiency: string | null;
  sortOrder: number;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
};

export type ApplyLanguagePayload = {
  language: string | null;
  proficiency: string | null;
};