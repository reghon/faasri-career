export type ApplyStatus = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isDefault: boolean;
  isFinal: boolean;
  isActive: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
};
