// shared/components/recruitment-timeline/recruitment-timeline.ts

import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RecruitmentTimelineItem } from './recruitment-timeline.model';

@Component({
  selector: 'app-recruitment-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recruitment-timeline.html',
})
export class RecruitmentTimelineComponent {
  readonly items = input.required<RecruitmentTimelineItem[]>();
  readonly isLoading = input<boolean>(false);
}
