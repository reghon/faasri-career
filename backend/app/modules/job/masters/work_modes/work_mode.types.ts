export type WorkMode = {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
};

export type WorkModeDetail = {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
};

export type WorkModePayload = {
  code: string;
  name: string;
  isActive: boolean;
};

export type CountResult = {
  count: number;
};