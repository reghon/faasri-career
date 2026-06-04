import { queryCamel, queryCamelOne } from "../../../utils/db.util";
import { applicantProfileQueries } from "./applicant_profile.queries";
import { ApplicantProfile, ApplicantProfileAvatarPayload, ApplicantProfileCvPayload, ApplicantProfilePayload, ApplicantFilterParams, CountResult } from "./applicant_profile.types";

function buildFilterClauses(filters: ApplicantFilterParams): { conditions: string; params: unknown[] } {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters.search) {
    params.push(`%${filters.search}%`);
    conditions.push(`(full_name ILIKE $${params.length} OR email ILIKE $${params.length} OR phone ILIKE $${params.length} OR linkedin_url ILIKE $${params.length})`);
  }

  if (filters.gender) {
    params.push(filters.gender);
    conditions.push(`gender = $${params.length}`);
  }

  return {
    conditions: conditions.length > 0 ? "AND " + conditions.join(" AND ") : "",
    params,
  };
}

export const applicantProfileRepository = {
  async countAllFiltered(filters: ApplicantFilterParams): Promise<CountResult | null> {
    const { conditions, params } = buildFilterClauses(filters);
    return queryCamelOne<CountResult>(applicantProfileQueries.countAllFiltered(conditions), params);
  },

  async getAllFiltered(limit: number, offset: number, filters: ApplicantFilterParams): Promise<ApplicantProfile[]> {
    const { conditions, params } = buildFilterClauses(filters);
    const limitParam = `$${params.length + 1}`;
    const offsetParam = `$${params.length + 2}`;
    const orderBy = `${filters.sortBy} ${filters.sortDirection}`;
    return queryCamel<ApplicantProfile>(
      applicantProfileQueries.getAllFiltered(conditions, orderBy, limitParam, offsetParam),
      [...params, limit, offset],
    );
  },

  async getAll(): Promise<ApplicantProfile[]> {
    return queryCamel<ApplicantProfile>(applicantProfileQueries.getAll);
  },
  async getById(id: string): Promise<ApplicantProfile | null> {
    return queryCamelOne<ApplicantProfile>(applicantProfileQueries.getById, [id]);
  },
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

  async updateAvatar(userId: string, data: ApplicantProfileAvatarPayload, actorId: string): Promise<ApplicantProfile | null> {
    return queryCamelOne<ApplicantProfile>(applicantProfileQueries.updateAvatar, [data.avatarUrl, actorId, userId]);
  },

  async updateCv(userId: string, data: ApplicantProfileCvPayload, actorId: string): Promise<ApplicantProfile | null> {
    return queryCamelOne<ApplicantProfile>(applicantProfileQueries.updateCv, [data.cvUrl, data.cvFileName, actorId, userId]);
  },

  async removeAvatar(userId: string, actorId: string): Promise<ApplicantProfile | null> {
    return queryCamelOne<ApplicantProfile>(applicantProfileQueries.removeAvatar, [actorId, userId]);
  },

  async removeCv(userId: string, actorId: string): Promise<ApplicantProfile | null> {
    return queryCamelOne<ApplicantProfile>(applicantProfileQueries.removeCv, [actorId, userId]);
  },
};
