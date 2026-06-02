import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SelectComponent } from '../../../../../../shared/components/select/select';
import { JobFormErrors, JobFormValue, SelectOption } from '../../models/job-form.model';

@Component({
  selector: 'app-job-pic-section',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectComponent],
  templateUrl: './job-pic-section.html',
})
export class JobPicSectionComponent {
  @Input({ required: true }) form!: JobFormValue;
  @Input({ required: true }) errors!: JobFormErrors;

  @Input() creatorName = '';
  @Input() managementProfiles: SelectOption[] = [];

  toOptions(items: SelectOption[]) {
    return items.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }
}
