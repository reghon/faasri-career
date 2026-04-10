import { queryCamelOne } from "../../../utils/db.util";
import { applicantProfileQueries } from "./applicant_profile.queries";
import { ApplicantProfile, ApplicantProfilePayload } from "./applicant_profile.types";

export const applicantProfileRepository = {
  async getByUserId(userId: string): Promise<ApplicantProfile | null> {
    return queryCamelOne<ApplicantProfile>(applicantProfileQueries.getByUserId, [userId]);
  },

  async create(userId: string, actorId: string): Promise<ApplicantProfile | null> {
    return queryCamelOne<ApplicantProfile>(applicantProfileQueries.create, [userId, actorId]);
  },

  async update(userId: string, data: ApplicantProfilePayload, actorId: string): Promise<ApplicantProfile | null> {
    return queryCamelOne<ApplicantProfile>(applicantProfileQueries.update, [
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
      actorId,
      userId,
    ]);
  },
};
