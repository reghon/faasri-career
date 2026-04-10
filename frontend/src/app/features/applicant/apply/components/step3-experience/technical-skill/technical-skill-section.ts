import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguagePayload, TechnicalSkillPayload } from '../../../../../../domain/applicant';
import {
  FieldError,
  ErrorMap,
  checkError,
  scrollToFirstError,
} from '../../../../../../shared/utils';

export interface TechnicalSkillSectionValue {
  technicalSkills: TechnicalSkillPayload[];
  technicalSkillsDescription: string | null;
  languages: LanguagePayload[];
}

export const TECHNICAL_SKILL_OPTIONS: string[] = [
  'Microsoft Office',
  'Excel',
  'Google Sheets',
  'Figma',
  'Photoshop',
  'SQL',
  'Python',
  'JavaScript',
  'React',
  'Angular',
];

export const LANGUAGE_OPTIONS: string[] = [
  'Indonesia',
  'Inggris',
  'Mandarin',
  'Jepang',
  'Korea',
  'Jerman',
  'Prancis',
];

export const PROFICIENCY_OPTIONS: string[] = ['Pemula', 'Menengah', 'Mahir', 'Native'];

export function createLanguageItem(): LanguagePayload {
  return {
    language: '',
    proficiency: '',
  };
}

export function createTechnicalSkillSectionValue(): TechnicalSkillSectionValue {
  return {
    technicalSkills: [],
    technicalSkillsDescription: '',
    languages: [createLanguageItem()],
  };
}

export function mapTechnicalSkillSectionToForm(
  data: TechnicalSkillSectionValue | null | undefined,
): TechnicalSkillSectionValue {
  if (!data) {
    return createTechnicalSkillSectionValue();
  }

  return {
    technicalSkillsDescription: data.technicalSkillsDescription || '',
    technicalSkills: (data.technicalSkills || []).map((item) => ({
      skillName: item.skillName || '',
    })),
    languages:
      data.languages && data.languages.length > 0
        ? data.languages.map((lang) => ({
            language: lang.language || '',
            proficiency: lang.proficiency || '',
          }))
        : [createLanguageItem()],
  };
}

export function normalizeTechnicalSkillSectionValue(
  data: TechnicalSkillSectionValue,
): TechnicalSkillSectionValue {
  return {
    technicalSkillsDescription: data.technicalSkillsDescription || null,
    technicalSkills: data.technicalSkills.map((item) => ({
      skillName: item.skillName || null,
    })),
    languages: data.languages.map((lang) => ({
      language: lang.language || null,
      proficiency: lang.proficiency || null,
    })),
  };
}

@Component({
  selector: 'app-technical-skill-section',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './technical-skill-section.html',
})
export class TechnicalSkillSectionComponent {
  @Input() data!: TechnicalSkillSectionValue;
  @Input() technicalSkillOptions: string[] = TECHNICAL_SKILL_OPTIONS;
  @Input() languageOptions: string[] = LANGUAGE_OPTIONS;
  @Input() proficiencyOptions: string[] = PROFICIENCY_OPTIONS;
  @Output() dataChange = new EventEmitter<TechnicalSkillSectionValue>();

  errors: ErrorMap = {};

  constructor(private readonly el: ElementRef) {}

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

  addLanguage(): void {
    const hasEmptyRow = this.data.languages.some(
      (lang) => !(lang.language || '').trim() && !(lang.proficiency || '').trim(),
    );

    if (hasEmptyRow) return;

    this.data.languages.push(createLanguageItem());
    this.onChange();
  }

  removeLanguage(index: number): void {
    if (index < 0 || index >= this.data.languages.length) return;

    this.data.languages.splice(index, 1);

    if (this.data.languages.length === 0) {
      this.data.languages.push(createLanguageItem());
    }

    this.onChange();
  }

  onSkillSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = select.value;

    if (!value) return;

    this.toggleSkill(value);
    select.value = '';
  }

  toggleSkill(skillName: string): void {
    const idx = this.data.technicalSkills.findIndex((item) => item.skillName === skillName);

    if (idx > -1) {
      this.data.technicalSkills.splice(idx, 1);
    } else {
      this.data.technicalSkills.push({ skillName });
    }

    this.onChange('skills');
  }

  trackSkill(_: number, skill: TechnicalSkillPayload): string {
    return skill.skillName || '';
  }

  validate(): FieldError[] {
    this.errors = {};
    const errs: FieldError[] = [];

    const check = (condition: boolean, field: string, message: string) =>
      checkError(this.errors, errs, condition, field, message);

    const selectedSkills = this.data.technicalSkills.filter((item) =>
      (item.skillName || '').trim(),
    );

    const languages = this.data.languages.map((lang) => ({
      language: (lang.language || '').trim(),
      proficiency: (lang.proficiency || '').trim(),
    }));

    const filledLanguages = languages.filter((lang) => lang.language || lang.proficiency);

    check(selectedSkills.length === 0, 'skills', 'Minimal pilih 1 keterampilan teknis');

    check(filledLanguages.length === 0, 'languages', 'Minimal isi 1 bahasa yang dikuasai');

    check(
      filledLanguages.some((lang) => lang.language && !lang.proficiency),
      'languages',
      'Tingkat kemahiran bahasa wajib diisi',
    );

    check(
      filledLanguages.some((lang) => !lang.language && lang.proficiency),
      'languages',
      'Bahasa wajib diisi',
    );

    const normalizedNames = filledLanguages
      .map((lang) => lang.language.toLowerCase())
      .filter(Boolean);

    check(
      new Set(normalizedNames).size !== normalizedNames.length,
      'languages',
      'Bahasa tidak boleh duplikat',
    );

    if (errs.length > 0) {
      scrollToFirstError(this.el, errs[0].field);
    }

    return errs;
  }
}
