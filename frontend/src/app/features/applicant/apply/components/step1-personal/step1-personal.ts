import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApplicantProfile, ApplicantProfilePayload } from '../../../../../domain/applicant/index';
import {
  FieldError,
  ErrorMap,
  checkError,
  scrollToFirstError,
  MONTHS,
  DAYS,
  YEARS,
  PHONE_CODES,
} from '../../../../../shared/utils';

export function createApplicantProfileForm(): ApplicantProfilePayload {
  return {
    fullName: '',
    email: '',
    birthPlace: '',
    birthDate: null,
    gender: '',
    phoneCode: '+62',
    phone: '',
    address: '',
    kelurahan: '',
    kecamatan: '',
    city: '',
    province: '',
    postalCode: '',
    linkedinUrl: '',
  };
}

export function mapApplicantProfileToForm(
  profile: ApplicantProfile | null,
): ApplicantProfilePayload {
  if (!profile) return createApplicantProfileForm();

  return {
    fullName: profile.fullName || '',
    email: profile.email || '',
    birthPlace: profile.birthPlace || '',
    birthDate: profile.birthDate || null,
    gender: profile.gender || '',
    phoneCode: profile.phoneCode || '+62',
    phone: profile.phone || '',
    address: profile.address || '',
    kelurahan: profile.kelurahan || '',
    kecamatan: profile.kecamatan || '',
    city: profile.city || '',
    province: profile.province || '',
    postalCode: profile.postalCode || '',
    linkedinUrl: profile.linkedinUrl || '',
  };
}

export function normalizeApplicantProfileForm(
  form: ApplicantProfilePayload,
): ApplicantProfilePayload {
  return {
    fullName: form.fullName || null,
    email: form.email || null,
    birthPlace: form.birthPlace || null,
    birthDate: form.birthDate || null,
    gender: form.gender || null,
    phoneCode: form.phoneCode || null,
    phone: form.phone || null,
    address: form.address || null,
    kelurahan: form.kelurahan || null,
    kecamatan: form.kecamatan || null,
    city: form.city || null,
    province: form.province || null,
    postalCode: form.postalCode || null,
    linkedinUrl: form.linkedinUrl || null,
  };
}

@Component({
  selector: 'app-step1-personal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './step1-personal.html',
})
export class Step1Personal implements OnChanges {
  @Input() data!: ApplicantProfilePayload;

  @Input() avatarFile: File | null = null;
  @Input() avatarPreviewUrl: string | null = null;
  @Input() hasExistingAvatar = false;

  @Input() cvFile: File | null = null;
  @Input() cvFileName: string | null = null;

  @Output() dataChange = new EventEmitter<ApplicantProfilePayload>();

  @Output() avatarFileChange = new EventEmitter<File | null>();
  @Output() avatarPreviewUrlChange = new EventEmitter<string | null>();
  @Output() avatarRemoveChange = new EventEmitter<boolean>();

  @Output() cvFileChange = new EventEmitter<File | null>();
  @Output() cvFileNameChange = new EventEmitter<string | null>();
  @Output() cvRemoveChange = new EventEmitter<boolean>();

  errors: ErrorMap = {};

  selectedBirthDay = '';
  selectedBirthMonth = '';
  selectedBirthYear = '';

  readonly months = MONTHS;
  readonly days = DAYS;
  readonly years = YEARS;
  readonly phoneCodes = PHONE_CODES;

  constructor(private readonly el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.syncBirthDateParts();
    }
  }

  onAvatarChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const maxSize = 2 * 1024 * 1024;

    if (!allowedExtensions.includes(extension)) {
      this.errors['avatar'] = 'Avatar harus berformat .jpg, .jpeg, .png, atau .webp';
      return;
    }

    if (file.size > maxSize) {
      this.errors['avatar'] = 'Ukuran avatar maksimal 2MB';
      return;
    }

    this.avatarFile = file;
    this.avatarPreviewUrl = URL.createObjectURL(file);
    this.clearError('avatar');

    this.avatarFileChange.emit(this.avatarFile);
    this.avatarPreviewUrlChange.emit(this.avatarPreviewUrl);
    this.avatarRemoveChange.emit(false);
  }

  onRemoveAvatar(): void {
    this.avatarFile = null;
    this.avatarPreviewUrl = null;
    this.clearError('avatar');

    this.avatarFileChange.emit(null);
    this.avatarPreviewUrlChange.emit(null);
    this.avatarRemoveChange.emit(true);
  }

  onCvChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const allowedExtensions = ['pdf', 'docx'];
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const maxSize = 5 * 1024 * 1024;

    if (!allowedExtensions.includes(extension)) {
      this.errors['cv'] = 'CV harus berformat .pdf atau .docx';
      return;
    }

    if (file.size > maxSize) {
      this.errors['cv'] = 'Ukuran CV maksimal 5MB';
      return;
    }

    this.cvFile = file;
    this.cvFileName = file.name;
    this.clearError('cv');

    this.cvFileChange.emit(this.cvFile);
    this.cvFileNameChange.emit(this.cvFileName);
    this.cvRemoveChange.emit(false);
  }

  onRemoveCv(): void {
    this.cvFile = null;
    this.cvFileName = null;
    this.clearError('cv');

    this.cvFileChange.emit(null);
    this.cvFileNameChange.emit(null);
    this.cvRemoveChange.emit(true);
  }

  onBirthDayChange(day: string): void {
    this.selectedBirthDay = day;
    this.updateBirthDate();
  }

  onBirthMonthChange(month: string): void {
    this.selectedBirthMonth = month;
    this.updateBirthDate();
  }

  onBirthYearChange(year: string): void {
    this.selectedBirthYear = year;
    this.updateBirthDate();
  }

  onChange(field?: string): void {
    if (field) this.clearError(field);
    this.dataChange.emit(this.data);
  }

  clearError(field: string): void {
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
    const check = (condition: boolean, field: string, message: string) =>
      checkError(this.errors, errs, condition, field, message);

    check(!this.cvFile && !this.cvFileName, 'cv', 'CV wajib diunggah');
    check(!this.data.fullName, 'fullName', 'Nama lengkap wajib diisi');
    check(!this.data.birthPlace, 'birthPlace', 'Tempat lahir wajib diisi');
    check(!this.data.birthDate, 'birthDate', 'Tanggal lahir wajib diisi lengkap');
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

    if (errs.length > 0) scrollToFirstError(this.el, errs[0].field);

    return errs;
  }

  private syncBirthDateParts(): void {
    if (!this.data?.birthDate) {
      this.selectedBirthDay = '';
      this.selectedBirthMonth = '';
      this.selectedBirthYear = '';
      return;
    }

    const [year, month, day] = this.data.birthDate.split('-');
    this.selectedBirthYear = year || '';
    this.selectedBirthMonth = month || '';
    this.selectedBirthDay = day || '';
  }

  private updateBirthDate(): void {
    if (!this.selectedBirthDay || !this.selectedBirthMonth || !this.selectedBirthYear) {
      this.data.birthDate = null;
      this.onChange('birthDate');
      return;
    }

    this.data.birthDate = [
      this.selectedBirthYear,
      this.selectedBirthMonth.padStart(2, '0'),
      this.selectedBirthDay.padStart(2, '0'),
    ].join('-');

    this.onChange('birthDate');
  }
}
