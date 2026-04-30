import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { JobFormErrors, JobFormValue } from '../../models/job-form.model';

@Component({
  selector: 'app-job-publication-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './job-publication-section.html',
})
export class JobPublicationSectionComponent {
  @Input({ required: true }) form!: JobFormValue;
  @Input({ required: true }) errors!: JobFormErrors;
}
