export interface Language {
  id: string;
  applicantProfileId: string;
  language: string | null;
  proficiency: string | null;
  isActive: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface LanguagePayload {
  language: string | null;
  proficiency: string | null;
}
