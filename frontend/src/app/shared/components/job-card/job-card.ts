import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JobListItem } from '../../../domain/job/models/job.model';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './job-card.html',
})
export class JobCard {
  @Input() job!: JobListItem;

  getSkillsLabel(skills: string[]): string {
    const maxShow = 2;
    if (skills.length <= maxShow) {
      return skills.join(', ');
    }
    const shown = skills.slice(0, maxShow).join(', ');
    const remaining = skills.length - maxShow;
    return `${shown}, +${remaining} more`;
  }
}
