export interface TechnicalSkill {
  id: string;
  applicantProfileId: string;
  skillName: string | null;
  isActive: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface TechnicalSkillPayload {
  skillName: string | null;
}
