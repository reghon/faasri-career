import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { JobDetail as JobDetailModel } from '../../../../../domain/job/models/job.model';
import { HtmlContentComponent } from '../../../../../shared/components/html-content/html-content.component';

@Component({
  selector: 'app-job-detail-overview',
  standalone: true,
  imports: [CommonModule, HtmlContentComponent],
  templateUrl: './job-detail-overview.html',
})
export class JobDetailOverviewComponent {
  readonly job = input.required<JobDetailModel>();

  readonly salaryRange = computed(() => this.job().salary || '-');
}
