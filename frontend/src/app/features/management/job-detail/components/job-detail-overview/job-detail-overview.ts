import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { JobDetail as JobDetailModel } from '../../../../../domain/job/models/job.model';
import { HtmlContentComponent } from '../../../../../shared/components/html-content/html-content.component';

@Component({
  selector: 'app-job-detail-overview',
  standalone: true,
  imports: [CommonModule, HtmlContentComponent],
  templateUrl: './job-detail-overview.html',
})
export class JobDetailOverviewComponent {
  @Input({ required: true }) job!: JobDetailModel;

  formatDate(value: string | null | undefined): string {
    if (!value) return '-';

    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(value));
  }

  getSalaryRange(): string {
    return this.job?.salary || '-';
  }
}
