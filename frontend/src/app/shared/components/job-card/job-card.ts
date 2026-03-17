import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Job } from '../../../core/mock/job.mock';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './job-card.html',
})
export class JobCard {
  @Input() job!: Job;

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
