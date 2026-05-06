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

  getSalaryRange(): string {
    return this.job?.salary || '-';
  }
}
