export type TechnicalSkill = {
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
};

export type TechnicalSkillPayload = {
  skillName: string | null;
};

export type TechnicalSkillParams = {
  id: string;
};
