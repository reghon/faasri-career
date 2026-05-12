export type UserListItem = {
  id: string;
  roleId: string | null;
  roleName: string | null;
  email: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
};

export type UserDetail = {
  id: string;
  roleId: string | null;
  roleName: string | null;
  email: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
};

export type UserEmailLookup = {
  id: string;
  email: string;
};

export type UserRoleLookup = {
  id: string;
  name: string;
};

export type UserCrudCreateParams = {
  email: string;
  hashedPassword: string;
  roleId: string;
  isActive: boolean;
  actorId: string;
};

export type UserCrudUpdateParams = {
  email: string;
  hashedPassword: string | null;
  roleId: string;
  isActive: boolean;
  actorId: string;
};

export type CountResult = {
  count: number;
};
