export type ApplyCertification = {
  id: string;
  applyId: string;
  name: string | null;
  issuer: string | null;
  issuedDay: string | null;
  issuedMonth: string | null;
  issuedYear: string | null;
  expiredDay: string | null;
  expiredMonth: string | null;
  expiredYear: string | null;
  sortOrder: number;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
};

export type ApplyCertificationPayload = {
  name: string | null;
  issuer: string | null;
  issuedDay: string | null;
  issuedMonth: string | null;
  issuedYear: string | null;
  expiredDay: string | null;
  expiredMonth: string | null;
  expiredYear: string | null;
};
