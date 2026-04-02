import { queryCamel, queryCamelOne } from "../../../utils/db.util";
import { certificationQueries } from "./certification.queries";
import { Certification, CertificationPayload } from "./certification.types";

export const certificationRepository = {
  async getByProfileId(profileId: string): Promise<Certification[]> {
    return queryCamel<Certification>(certificationQueries.getByProfileId, [profileId]);
  },

  async getById(id: string, profileId: string): Promise<Certification | null> {
    return queryCamelOne<Certification>(certificationQueries.getById, [id, profileId]);
  },

  async create(profileId: string, data: CertificationPayload, actorId: string): Promise<Certification | null> {
    return queryCamelOne<Certification>(certificationQueries.create, [profileId, data.name, data.issuer, data.issuedDay, data.issuedMonth, data.issuedYear, data.expiredDay, data.expiredMonth, data.expiredYear, actorId]);
  },

  async update(id: string, profileId: string, data: CertificationPayload, actorId: string): Promise<Certification | null> {
    return queryCamelOne<Certification>(certificationQueries.update, [data.name, data.issuer, data.issuedDay, data.issuedMonth, data.issuedYear, data.expiredDay, data.expiredMonth, data.expiredYear, actorId, id, profileId]);
  },

  async softDelete(id: string, profileId: string, actorId: string): Promise<{ id: string } | null> {
    return queryCamelOne<{ id: string }>(certificationQueries.softDelete, [id, profileId, actorId]);
  },
};
