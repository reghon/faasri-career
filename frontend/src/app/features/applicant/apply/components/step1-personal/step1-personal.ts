import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PersonalInfo } from '../../../../../core/mock/application.mock';

export interface FieldError {
  field: string;
  message: string;
}

@Component({
  selector: 'app-step1-personal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './step1-personal.html',
})
export class Step1Personal {
  @Input() data!: PersonalInfo;
  @Input() months: string[] = [];
  @Input() days: string[] = [];
  @Input() years: string[] = [];
  @Input() phoneCodes: string[] = [];
  @Input() jobSources: string[] = [];
  @Output() dataChange = new EventEmitter<PersonalInfo>();

  errors: Record<string, string> = {};

  constructor(private el: ElementRef) {}

  onCvChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.data.cvFile = file;
      this.clearError('cv');
      this.dataChange.emit(this.data);
    }
  }

  onChange(field?: string) {
    if (field) this.clearError(field);
    this.dataChange.emit(this.data);
  }

  clearError(field: string) {
    delete this.errors[field];
  }

  hasError(field: string): boolean {
    return !!this.errors[field];
  }

  getError(field: string): string {
    return this.errors[field] || '';
  }

  validate(): FieldError[] {
    this.errors = {};
    const errs: FieldError[] = [];

    const check = (condition: boolean, field: string, message: string) => {
      if (condition) {
        this.errors[field] = message;
        errs.push({ field, message });
      }
    };

    check(!this.data.cvFile, 'cv', 'CV wajib diunggah');
    check(!this.data.fullName, 'fullName', 'Nama lengkap wajib diisi');
    check(!this.data.birthPlace, 'birthPlace', 'Tempat lahir wajib diisi');
    check(
      !this.data.birthDay || !this.data.birthMonth || !this.data.birthYear,
      'birthDate',
      'Tanggal lahir wajib diisi lengkap',
    );
    check(!this.data.email, 'email', 'Email wajib diisi');
    check(!!this.data.email && !this.data.email.includes('@'), 'email', 'Format email tidak valid');
    check(!this.data.phone, 'phone', 'Nomor telepon wajib diisi');
    check(!this.data.gender, 'gender', 'Jenis kelamin wajib dipilih');
    check(!this.data.address, 'address', 'Alamat wajib diisi');
    check(!this.data.kelurahan, 'kelurahan', 'Kelurahan wajib diisi');
    check(!this.data.kecamatan, 'kecamatan', 'Kecamatan wajib diisi');
    check(!this.data.city, 'city', 'Kota/Kabupaten wajib diisi');
    check(!this.data.province, 'province', 'Provinsi wajib diisi');
    check(!this.data.postalCode, 'postalCode', 'Kode pos wajib diisi');
    check(!this.data.jobSource, 'jobSource', 'Sumber informasi wajib dipilih');

    if (errs.length > 0) this.scrollToFirstError(errs[0].field);
    return errs;
  }

  scrollToFirstError(field: string) {
    setTimeout(() => {
      const el = this.el.nativeElement.querySelector(`[data-field="${field}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }
}
