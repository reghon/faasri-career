import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  DashboardData,
  HiringInsightGroup,
  HiringInsightType,
  RecruitmentFunnelItem,
  SmartInsightItem,
} from '../../../domain/admin/dashboard/dashboard.model';
import { DashboardService } from '../../../domain/admin/dashboard/dashboard.service';

type SummaryCard = {
  title: string;
  value: string;
  description: string;
  helper?: string;
  icon: 'briefcase' | 'users' | 'clock' | 'check';
  tone: 'success' | 'info' | 'warning' | 'primary';
};

type FunnelViewItem = RecruitmentFunnelItem & {
  count: number;
  percentage: number;
};

type HiringInsightTab = {
  type: HiringInsightType;
  label: string;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly dashboard = signal<DashboardData | null>(null);
  readonly selectedHiringInsightType = signal<HiringInsightType>('no_applicant');

  readonly hiringInsightTabs: HiringInsightTab[] = [
    { type: 'no_applicant', label: 'Tanpa Kandidat' },
    { type: 'low_applicant', label: 'Kurang Kandidat' },
    { type: 'healthy_applicant', label: 'Cukup Kandidat' },
    { type: 'high_applicant', label: 'Ramai Peminat' },
  ];

  readonly overview = computed(() => this.dashboard()?.overview ?? null);

  readonly summaryCards = computed<SummaryCard[]>(() => {
    const overview = this.overview();
    if (!overview) return [];

    return [
      {
        title: 'Job Aktif',
        value: String(overview.activeJobs),
        description: 'Lowongan berstatus open',
        icon: 'briefcase',
        tone: 'success',
      },
      {
        title: 'Total Pelamar',
        value: String(overview.totalApplicants),
        description: 'Total applicant profile',
        icon: 'users',
        tone: 'info',
      },
      {
        title: 'Dalam Proses',
        value: String(overview.applicationsInProcess),
        description: 'Apply aktif belum final',
        icon: 'clock',
        tone: 'warning',
      },
      {
        title: 'Posisi Dibuka',
        value: String(overview.openPositions),
        description: 'Total vacancy job open',
        icon: 'check',
        tone: 'primary',
      },
    ];
  });

  readonly recruitmentFunnel = computed<FunnelViewItem[]>(() => {
    const funnel = this.dashboard()?.recruitmentFunnel ?? [];
    const maxTotal = Math.max(...funnel.map((item) => item.total), 0);

    return funnel.map((item) => ({
      ...item,
      count: item.total,
      percentage: maxTotal > 0 ? Math.round((item.total / maxTotal) * 100) : 0,
    }));
  });

  readonly smartInsights = computed<SmartInsightItem[]>(() => {
    return this.dashboard()?.smartInsight ?? [];
  });

  readonly hiringInsights = computed<HiringInsightGroup[]>(() => {
    return this.dashboard()?.hiringInsights ?? [];
  });

  readonly selectedHiringInsight = computed<HiringInsightGroup | null>(() => {
    return (
      this.hiringInsights().find((insight) => insight.type === this.selectedHiringInsightType()) ??
      null
    );
  });

  readonly selectedHiringInsightJobs = computed(() => {
    return this.selectedHiringInsight()?.jobs ?? [];
  });

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.dashboardService.getOverview().subscribe({
      next: (data) => {
        this.dashboard.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Gagal memuat data dashboard.');
        this.isLoading.set(false);
      },
    });
  }

  selectHiringInsightTab(type: HiringInsightType): void {
    this.selectedHiringInsightType.set(type);
  }

  getHiringInsightCount(type: HiringInsightType): number {
    return this.hiringInsights().find((insight) => insight.type === type)?.total ?? 0;
  }

  getSummaryToneClass(tone: SummaryCard['tone']): string {
    const classes: Record<SummaryCard['tone'], string> = {
      success: 'bg-success/10 text-success',
      info: 'bg-info/10 text-info',
      warning: 'bg-warning/10 text-warning',
      primary: 'bg-primary/10 text-primary',
    };

    return classes[tone];
  }

  getInsightClass(type: SmartInsightItem['type'] | HiringInsightGroup['severity']): string {
    const classes: Record<string, string> = {
      warning: 'border-warning/30 bg-warning/10 text-warning',
      success: 'border-success/30 bg-success/10 text-success',
      info: 'border-info/30 bg-info/10 text-info',
      danger: 'border-error/30 bg-error/10 text-error',
    };

    return classes[type] ?? classes['info'];
  }
}
