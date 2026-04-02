import { queryCamel, queryCamelOne } from "../../../utils/db.util";
import { languageQueries } from "./language.queries";
import { Language, LanguagePayload } from "./language.types";

export const languageRepository = {
  async getByProfileId(profileId: string): Promise<Language[]> {
    return queryCamel<Language>(languageQueries.getByProfileId, [profileId]);
  },

  async getById(id: string, profileId: string): Promise<Language | null> {
    return queryCamelOne<Language>(languageQueries.getById, [id, profileId]);
  },

  async create(profileId: string, data: LanguagePayload, actorId: string): Promise<Language | null> {
    return queryCamelOne<Language>(languageQueries.create, [profileId, data.language, data.proficiency, actorId]);
  },

  async update(id: string, profileId: string, data: LanguagePayload, actorId: string): Promise<Language | null> {
    return queryCamelOne<Language>(languageQueries.update, [data.language, data.proficiency, actorId, id, profileId]);
  },

  async softDelete(id: string, profileId: string, actorId: string): Promise<{ id: string } | null> {
    return queryCamelOne<{ id: string }>(languageQueries.softDelete, [id, profileId, actorId]);
  },
};
