export type ApplyTechnicalSkill = {
  id: string;
  applyId: string;
  skillName: string | null;
  sortOrder: number;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
};

export type ApplyTechnicalSkillPayload = {
  skillName: string | null;
};
