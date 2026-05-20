// shared/components/recruitment-timeline/recruitment-timeline.model.ts

export interface RecruitmentTimelineItem {
  id: string;
  applyStatusId: string;
  name: string;
  code: string | null;
  description: string | null;
  isFinal: boolean;
  history: RecruitmentTimelineHistory | null;
  state: 'done' | 'current' | 'pending';
  dotClass: string;
  cardClass: string;
  statusLabel: string;
  statusClass: string;
}

export interface RecruitmentTimelineHistory {
  applyStatusId?: string | null;
  applyStatusName?: string | null;
  createdAt?: string | null;
  createdBy?: string | null;
  notes?: string | null;
}
