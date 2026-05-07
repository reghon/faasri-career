export interface DashboardOverview {
  activeJobs: number;
  totalApplicants: number;
  applicationsInProcess: number;
  openPositions: number;
}

export interface RecruitmentFunnelItem {
  name: string;
  total: number;
}

export type SmartInsightType = "info" | "success" | "warning" | "danger";

export interface SmartInsightItem {
  type: SmartInsightType;
  title: string;
  description: string;
}

export type HiringInsightType = "no_applicant" | "low_applicant" | "healthy_applicant" | "high_applicant";

export type HiringInsightSeverity = "success" | "warning" | "danger" | "info";

export interface HiringInsightJobItem {
  jobId: string;
  jobTitle: string;
  vacancyCount: number;
  applicantCount: number;
}

export interface HiringInsightGroup {
  type: HiringInsightType;
  severity: HiringInsightSeverity;
  label: string;
  description: string;
  total: number;
  jobs: HiringInsightJobItem[];
}

export interface JobHiringPerformance {
  jobId: string;
  jobTitle: string;
  vacancyCount: number;
  applicantCount: number;
}

export interface DashboardOverviewResponse {
  overview: DashboardOverview;
  recruitmentFunnel: RecruitmentFunnelItem[];
  smartInsight: SmartInsightItem[];
  hiringInsights: HiringInsightGroup[];
}
