import { PoolClient } from "pg";
import format from "pg-format";
import { queryCamel } from "../../../utils/db.util";
import { applyLanguageQueries } from "./apply_language.queries";
import { ApplyLanguage, ApplyLanguagePayload } from "./apply_language.types";

export const applyLanguageRepository = {
  async getByApplyId(client: PoolClient, applyId: string): Promise<ApplyLanguage[]> {
    return queryCamel<ApplyLanguage>(client, applyLanguageQueries.getByApplyId, [applyId]);
  },

  async bulkInsert(client: PoolClient, applyId: string, data: ApplyLanguagePayload[], actorId: string): Promise<ApplyLanguage[]> {
    if (data.length === 0) {
      return [];
    }

    const now = new Date();

    const values = data.map((item, index) => [applyId, item.language, item.proficiency, index, now, actorId, now, actorId]);

    const query = format(applyLanguageQueries.bulkInsert, values);

    return queryCamel<ApplyLanguage>(client, query);
  },
};
