import { PoolClient } from "pg";
import { queryCamelOne } from "../../../utils/db.util";
import { applyProfileQueries } from "./apply_profile.queries";
import { ApplyProfile, ApplyProfilePayload } from "./apply_profile.types";

export const applyProfileRepository = {
  async getByApplyId(client: PoolClient, applyId: string): Promise<ApplyProfile | null> {
    return queryCamelOne<ApplyProfile>(client, applyProfileQueries.getByApplyId, [applyId]);
  },

  async create(client: PoolClient, applyId: string, data: ApplyProfilePayload, actorId: string): Promise<ApplyProfile | null> {
    return queryCamelOne<ApplyProfile>(client, applyProfileQueries.create, [
      applyId,
      data.fullName,
      data.email,
      data.birthPlace,
      data.birthDate,
      data.gender,
      data.phoneCode,
      data.phone,
      data.address,
      data.kelurahan,
      data.kecamatan,
      data.city,
      data.province,
      data.postalCode,
      data.linkedinUrl,
      data.cvUrl,
      data.cvFileName,
      actorId,
    ]);
  },
};
