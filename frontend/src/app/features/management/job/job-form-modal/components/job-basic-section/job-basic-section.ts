import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SelectComponent } from '../../../../../../shared/components/select/select';
import { JobFormErrors, JobFormValue, SelectOption } from '../../models/job-form.model';

@Component({
  selector: 'app-job-basic-section',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectComponent],
  templateUrl: './job-basic-section.html',
})
export class JobBasicSectionComponent {
  @Input({ required: true }) form!: JobFormValue;
  @Input({ required: true }) errors!: JobFormErrors;

  @Input() categories: SelectOption[] = [];
  @Input() employmentTypes: SelectOption[] = [];
  @Input() statuses: SelectOption[] = [];
  @Input() departments: SelectOption[] = [];
  @Input() educationLevels: SelectOption[] = [];

  toOptions(items: SelectOption[]) {
    return items.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }
}
