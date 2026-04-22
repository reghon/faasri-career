import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GenericModalComponent } from '../../general/generic-modal.component';

type FieldType = 'text' | 'textarea' | 'switch' | 'number';

export interface MasterDataFieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  patternMessage?: string;
}

@Component({
  selector: 'app-master-data-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, GenericModalComponent],
  templateUrl: './master-data-form-modal.html',
})
export class MasterDataFormModal {
  @Input() open = false;
  @Input() title = '';
  @Input() description = '';
  @Input() fields: MasterDataFieldConfig[] = [];
  @Input() form: Record<string, any> = {};
  @Input() errors: Record<string, string> = {};
  @Input() isSubmitting = false;
  @Input() feedbackType: 'success' | 'error' | '' = '';
  @Input() feedbackMessage = '';
  @Input() submitLabel = 'Save';

  @Output() formChange = new EventEmitter<{
    key: string;
    value: any;
    form: Record<string, any>;
  }>();
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  updateField(key: string, value: any): void {
    const nextForm = {
      ...this.form,
      [key]: value,
    };

    this.formChange.emit({
      key,
      value,
      form: nextForm,
    });
  }

  onClose(): void {
    if (this.isSubmitting) return;
    this.close.emit();
  }

  onSubmit(): void {
    if (this.isSubmitting) return;
    this.submit.emit();
  }
}
