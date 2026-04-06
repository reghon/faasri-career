export interface Certification {
  id: string;
  applicantProfileId: string;
  name: string | null;
  issuer: string | null;
  issuedDay: string | null;
  issuedMonth: string | null;
  issuedYear: string | null;
  expiredDay: string | null;
  expiredMonth: string | null;
  expiredYear: string | null;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface CertificationPayload {
  name: string;
  issuer: string;
  issuedDay: string | null;
  issuedMonth: string | null;
  issuedYear: string | null;
  expiredDay: string | null;
  expiredMonth: string | null;
  expiredYear: string | null;
}
