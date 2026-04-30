import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { SelectComponent } from '../../../../../../shared/components/select/select';
import { JobFormErrors, JobFormValue, SelectOption } from '../../models/job-form.model';

@Component({
  selector: 'app-job-location-section',
  standalone: true,
  imports: [CommonModule, SelectComponent],
  templateUrl: './job-location-section.html',
})
export class JobLocationSectionComponent {
  @Input({ required: true }) form!: JobFormValue;
  @Input({ required: true }) errors!: JobFormErrors;

  @Input() jobLocations: SelectOption[] = [];
  @Input() workModes: SelectOption[] = [];

  toOptions(items: SelectOption[]) {
    return items.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }
}
