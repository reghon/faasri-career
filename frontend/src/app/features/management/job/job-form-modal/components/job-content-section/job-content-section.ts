import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillModule, QuillModules } from 'ngx-quill';

import { JobFormErrors, JobFormValue } from '../../models/job-form.model';

@Component({
  selector: 'app-job-content-section',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './job-content-section.html',
})
export class JobContentSectionComponent {
  @Input({ required: true }) form!: JobFormValue;
  @Input({ required: true }) errors!: JobFormErrors;
  @Input({ required: true }) modules!: QuillModules;
}
