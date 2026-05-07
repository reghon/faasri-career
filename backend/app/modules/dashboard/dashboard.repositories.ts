import { queryCamel, queryCamelOne } from "../../utils/db.util";
import { dashboardQueries } from "./dashboard.queries";
import { RecruitmentFunnelItem, JobHiringPerformance } from "./dashboard.types";

type CountResult = {
  total: number;
};

export class DashboardRepository {
  async getActiveJobsCount(): Promise<number> {
    const result = await queryCamelOne<CountResult>(dashboardQueries.getActiveJobsCount);

    return result?.total ?? 0;
  }

  async getTotalApplicantsCount(): Promise<number> {
    const result = await queryCamelOne<CountResult>(dashboardQueries.getTotalApplicantsCount);

    return result?.total ?? 0;
  }

  async getApplicationsInProcessCount(): Promise<number> {
    const result = await queryCamelOne<CountResult>(dashboardQueries.getApplicationsInProcessCount);

    return result?.total ?? 0;
  }

  async getOpenPositionsCount(): Promise<number> {
    const result = await queryCamelOne<CountResult>(dashboardQueries.getOpenPositionsCount);

    return result?.total ?? 0;
  }
  async getRecruitmentFunnel(): Promise<RecruitmentFunnelItem[]> {
    return queryCamel<RecruitmentFunnelItem>(dashboardQueries.getRecruitmentFunnel);
  }
  async getJobHiringPerformance(): Promise<JobHiringPerformance[]> {
    return queryCamel<JobHiringPerformance>(dashboardQueries.getJobHiringPerformance);
  }
}

export const dashboardRepository = new DashboardRepository();
