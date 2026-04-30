import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { JobFormErrors, JobFormValue } from '../../models/job-form.model';
import { formatRupiah } from '../../../../../../shared/utils/number.utils';

@Component({
  selector: 'app-job-compensation-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './job-compensation-section.html',
})
export class JobCompensationSectionComponent {
  @Input({ required: true }) form!: JobFormValue;
  @Input({ required: true }) errors!: JobFormErrors;

  @Output() formChange = new EventEmitter<void>();

  formatRupiah = formatRupiah;

  validateSalaryRelation(form: JobFormValue, errors: JobFormErrors): void {
    const min = form.minSalary;
    const max = form.maxSalary;

    if (errors['maxSalary'] === 'Maksimum gaji harus lebih besar atau sama dengan minimum gaji.') {
      delete errors['maxSalary'];
    }

    if (min !== null && max !== null && max < min) {
      errors['maxSalary'] = 'Maksimum gaji harus lebih besar atau sama dengan minimum gaji.';
    }
  }

  onSalaryChange(value: string, field: 'minSalary' | 'maxSalary'): void {
    const numeric = value.replace(/[^\d]/g, '');

    this.form[field] = numeric ? Number(numeric) : null;

    delete this.errors[field];

    this.validateSalaryRelation(this.form, this.errors);

    this.formChange.emit();
  }

  onlyNumber(event: KeyboardEvent, field: 'minSalary' | 'maxSalary'): void {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];

    if (allowedKeys.includes(event.key)) return;

    if (!/^\d$/.test(event.key)) {
      this.errors[field] = 'Field ini hanya menerima angka 0-9.';
      event.preventDefault();
      this.formChange.emit();
      return;
    }

    if (this.errors[field] === 'Field ini hanya menerima angka 0-9.') {
      delete this.errors[field];
      this.formChange.emit();
    }
  }

  onPaste(event: ClipboardEvent, field: 'minSalary' | 'maxSalary'): void {
    const pastedInput = event.clipboardData?.getData('text') || '';

    if (!/^\d+$/.test(pastedInput)) {
      this.errors[field] = 'Paste gagal. Field ini hanya menerima angka tanpa huruf atau simbol.';
      event.preventDefault();
      this.formChange.emit();
      return;
    }

    if (
      this.errors[field] === 'Paste gagal. Field ini hanya menerima angka tanpa huruf atau simbol.'
    ) {
      delete this.errors[field];
      this.formChange.emit();
    }
  }
}
