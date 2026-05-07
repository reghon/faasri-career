import { dashboardRepository } from "./dashboard.repositories";
import { HiringInsightGroup, DashboardOverview, DashboardOverviewResponse, JobHiringPerformance, RecruitmentFunnelItem, SmartInsightItem } from "./dashboard.types";

export class DashboardService {
  async getOverview(): Promise<DashboardOverviewResponse> {
    const [activeJobs, totalApplicants, applicationsInProcess, openPositions, recruitmentFunnel, jobHiringPerformance] = await Promise.all([
      dashboardRepository.getActiveJobsCount(),
      dashboardRepository.getTotalApplicantsCount(),
      dashboardRepository.getApplicationsInProcessCount(),
      dashboardRepository.getOpenPositionsCount(),
      dashboardRepository.getRecruitmentFunnel(),
      dashboardRepository.getJobHiringPerformance(),
    ]);

    const overview: DashboardOverview = {
      activeJobs,
      totalApplicants,
      applicationsInProcess,
      openPositions,
    };

    return {
      overview,
      recruitmentFunnel,
      smartInsight: this.buildSmartInsights(overview, recruitmentFunnel),
      hiringInsights: this.buildHiringInsights(jobHiringPerformance),
    };
  }

  private buildHiringInsights(jobs: JobHiringPerformance[]): HiringInsightGroup[] {
    const noApplicantJobs = jobs.filter((job) => job.applicantCount === 0);

    const lowApplicantJobs = jobs.filter((job) => job.applicantCount > 0 && job.applicantCount < job.vacancyCount);

    const healthyApplicantJobs = jobs.filter((job) => job.applicantCount >= job.vacancyCount && job.applicantCount < job.vacancyCount * 5);

    const highApplicantJobs = jobs.filter((job) => job.applicantCount >= job.vacancyCount * 5);

    const insights: HiringInsightGroup[] = [];

    if (noApplicantJobs.length > 0) {
      insights.push({
        type: "no_applicant",
        severity: "danger",
        label: "Tanpa Kandidat",
        description: "Lowongan belum memiliki pelamar.",
        total: noApplicantJobs.length,
        jobs: noApplicantJobs.map((job) => ({
          jobId: job.jobId,
          jobTitle: job.jobTitle,
          vacancyCount: job.vacancyCount,
          applicantCount: job.applicantCount,
        })),
      });
    }

    if (lowApplicantJobs.length > 0) {
      insights.push({
        type: "low_applicant",
        severity: "warning",
        label: "Kurang Kandidat",
        description: "Jumlah pelamar masih di bawah kebutuhan posisi.",
        total: lowApplicantJobs.length,
        jobs: lowApplicantJobs.map((job) => ({
          jobId: job.jobId,
          jobTitle: job.jobTitle,
          vacancyCount: job.vacancyCount,
          applicantCount: job.applicantCount,
        })),
      });
    }

    if (healthyApplicantJobs.length > 0) {
      insights.push({
        type: "healthy_applicant",
        severity: "info",
        label: "Cukup Kandidat",
        description: "Jumlah kandidat sudah memenuhi kebutuhan posisi.",
        total: healthyApplicantJobs.length,
        jobs: healthyApplicantJobs.map((job) => ({
          jobId: job.jobId,
          jobTitle: job.jobTitle,
          vacancyCount: job.vacancyCount,
          applicantCount: job.applicantCount,
        })),
      });
    }

    if (highApplicantJobs.length > 0) {
      insights.push({
        type: "high_applicant",
        severity: "success",
        label: "Ramai Peminat",
        description: "Lowongan memiliki jumlah pelamar yang tinggi.",
        total: highApplicantJobs.length,
        jobs: highApplicantJobs.map((job) => ({
          jobId: job.jobId,
          jobTitle: job.jobTitle,
          vacancyCount: job.vacancyCount,
          applicantCount: job.applicantCount,
        })),
      });
    }

    return insights;
  }

  private buildSmartInsights(overview: DashboardOverview, recruitmentFunnel: RecruitmentFunnelItem[]): SmartInsightItem[] {
    const insights: SmartInsightItem[] = [];

    const totalFunnelApplicants = recruitmentFunnel.reduce((sum, item) => sum + item.total, 0);

    if (overview.activeJobs === 0) {
      insights.push({
        type: "warning",
        title: "Belum ada job aktif",
        description: "Saat ini belum ada lowongan berstatus open.",
      });
    }

    if (overview.activeJobs > 0 && overview.totalApplicants === 0) {
      insights.push({
        type: "warning",
        title: "Belum ada pelamar",
        description: `${overview.activeJobs} job aktif belum memiliki pelamar.`,
      });
    }

    if (overview.applicationsInProcess === 0) {
      insights.push({
        type: "info",
        title: "Belum ada aplikasi dalam proses",
        description: "Tidak ada aplikasi aktif yang sedang diproses untuk job yang masih open.",
      });
    }

    if (overview.openPositions > 0) {
      insights.push({
        type: "info",
        title: "Posisi masih tersedia",
        description: `Ada ${overview.openPositions} posisi dari ${overview.activeJobs} job aktif yang masih dibuka.`,
      });
    }

    if (totalFunnelApplicants === 0) {
      insights.push({
        type: "warning",
        title: "Recruitment funnel masih kosong",
        description: "Belum ada data apply pada job yang sedang open di recruitment funnel.",
      });
    }

    if (overview.totalApplicants > 0 && totalFunnelApplicants === 0) {
      insights.push({
        type: "info",
        title: "Pelamar belum masuk ke job open",
        description: "Terdapat applicant profile, tetapi belum ada apply yang terhubung ke job berstatus open.",
      });
    }

    if (insights.length === 0) {
      insights.push({
        type: "success",
        title: "Dashboard terlihat stabil",
        description: "Data recruitment sudah berjalan normal dan memiliki aktivitas pelamar.",
      });
    }

    return insights;
  }
}

export const dashboardService = new DashboardService();
