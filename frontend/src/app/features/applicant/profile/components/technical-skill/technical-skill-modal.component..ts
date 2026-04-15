import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import {
  Language,
  LanguagePayload,
  LanguageService,
  TechnicalSkill,
  TechnicalSkillPayload,
  TechnicalSkillService,
} from '../../../../../domain/applicant';
import { GenericModalComponent } from '../../../../../shared/components/general/generic-modal.component';
import {
  LANGUAGE_OPTIONS,
  PROFICIENCY_OPTIONS,
  TECHNICAL_SKILL_OPTIONS,
  TechnicalSkillSectionComponent,
  TechnicalSkillSectionValue,
  createTechnicalSkillSectionValue,
  normalizeTechnicalSkillSectionValue,
} from '../../../apply/components/step3-experience/technical-skill/technical-skill-section';

interface TechnicalSkillFormItem extends TechnicalSkillPayload {
  id?: string;
}

interface LanguageFormItem extends LanguagePayload {
  id?: string;
}

interface TechnicalSkillFormValue {
  technicalSkills: TechnicalSkillFormItem[];
  technicalSkillsDescription: string | null;
  languages: LanguageFormItem[];
}

@Component({
  selector: 'app-technical-skill-modal',
  standalone: true,
  imports: [CommonModule, GenericModalComponent, TechnicalSkillSectionComponent],
  templateUrl: './technical-skill-modal.component.html',
})
export class TechnicalSkillModalComponent implements OnChanges {
  @ViewChild(TechnicalSkillSectionComponent)
  technicalSkillSection?: TechnicalSkillSectionComponent;

  @Input() open = false;
  @Input() technicalSkills: TechnicalSkill[] | null = null;
  @Input() technicalSkillsDescription: string | null = null;
  @Input() languages: Language[] | null = null;

  @Input() technicalSkillOptions: string[] = TECHNICAL_SKILL_OPTIONS;
  @Input() languageOptions: string[] = LANGUAGE_OPTIONS;
  @Input() proficiencyOptions: string[] = PROFICIENCY_OPTIONS;

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  isSubmitting = false;

  formData: TechnicalSkillFormValue = this.createEmptyForm();
  originalTechnicalSkills: TechnicalSkill[] = [];
  originalLanguages: Language[] = [];

  constructor(
    private readonly technicalSkillService: TechnicalSkillService,
    private readonly languageService: LanguageService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['open'] ||
      changes['technicalSkills'] ||
      changes['technicalSkillsDescription'] ||
      changes['languages']
    ) {
      this.originalTechnicalSkills = this.technicalSkills ? [...this.technicalSkills] : [];
      this.originalLanguages = this.languages ? [...this.languages] : [];
      this.formData = this.mapInputToForm(
        this.technicalSkills,
        this.technicalSkillsDescription,
        this.languages,
      );
    }
  }

  onClose(): void {
    if (this.isSubmitting) return;
    this.close.emit();
  }

  onDataChange(data: TechnicalSkillSectionValue): void {
    this.formData = {
      technicalSkills: data.technicalSkills.map((item, index) => ({
        ...item,
        id: this.formData.technicalSkills[index]?.id,
      })),
      technicalSkillsDescription: data.technicalSkillsDescription,
      languages: data.languages.map((lang, index) => ({
        ...lang,
        id: this.formData.languages[index]?.id,
      })),
    };
  }
  private isTechnicalSkillEqual(
    current: TechnicalSkillPayload,
    original: TechnicalSkillPayload,
  ): boolean {
    return (current.skillName || null) === (original.skillName || null);
  }

  private isLanguageEqual(current: LanguagePayload, original: LanguagePayload): boolean {
    return (
      (current.language || null) === (original.language || null) &&
      (current.proficiency || null) === (original.proficiency || null)
    );
  }
  onSave(): void {
    const errors = this.technicalSkillSection?.validate() || [];
    if (errors.length > 0) return;

    this.isSubmitting = true;

    const normalized = this.normalizeFormValue(this.formData);

    const originalSkillMap = new Map(this.originalTechnicalSkills.map((item) => [item.id, item]));
    const originalLanguageMap = new Map(this.originalLanguages.map((item) => [item.id, item]));

    const originalSkillIds = new Set(this.originalTechnicalSkills.map((item) => item.id));
    const currentSkillIds = new Set(
      normalized.technicalSkills.filter((item) => !!item.id).map((item) => item.id as string),
    );

    const originalLanguageIds = new Set(this.originalLanguages.map((item) => item.id));
    const currentLanguageIds = new Set(
      normalized.languages.filter((item) => !!item.id).map((item) => item.id as string),
    );

    const createSkillRequests: Observable<unknown>[] = normalized.technicalSkills
      .filter((item) => !item.id && !!item.skillName)
      .map((item) => this.technicalSkillService.create(this.toTechnicalSkillPayload(item)));

    const updateSkillRequests: Observable<unknown>[] = normalized.technicalSkills
      .filter((item) => !!item.id)
      .filter((item) => {
        const original = originalSkillMap.get(item.id as string);
        if (!original) return false;

        return !this.isTechnicalSkillEqual(
          this.toTechnicalSkillPayload(item),
          this.toTechnicalSkillPayload(original),
        );
      })
      .map((item) =>
        this.technicalSkillService.update(item.id as string, this.toTechnicalSkillPayload(item)),
      );

    const deleteSkillRequests: Observable<unknown>[] = this.originalTechnicalSkills
      .filter((item) => originalSkillIds.has(item.id) && !currentSkillIds.has(item.id))
      .map((item) => this.technicalSkillService.delete(item.id));

    const createLanguageRequests: Observable<unknown>[] = normalized.languages
      .filter((item) => !item.id && !!item.language && !!item.proficiency)
      .map((item) => this.languageService.create(this.toLanguagePayload(item)));

    const updateLanguageRequests: Observable<unknown>[] = normalized.languages
      .filter((item) => !!item.id)
      .filter((item) => {
        const original = originalLanguageMap.get(item.id as string);
        if (!original) return false;

        return !this.isLanguageEqual(
          this.toLanguagePayload(item),
          this.toLanguagePayload(original),
        );
      })
      .map((item) => this.languageService.update(item.id as string, this.toLanguagePayload(item)));

    const deleteLanguageRequests: Observable<unknown>[] = this.originalLanguages
      .filter((item) => originalLanguageIds.has(item.id) && !currentLanguageIds.has(item.id))
      .map((item) => this.languageService.delete(item.id));

    const requests = [
      ...createSkillRequests,
      ...updateSkillRequests,
      ...deleteSkillRequests,
      ...createLanguageRequests,
      ...updateLanguageRequests,
      ...deleteLanguageRequests,
    ];

    const submit$ = requests.length > 0 ? forkJoin(requests) : of([]);

    submit$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.saved.emit();
        this.close.emit();
      },
      error: (error) => {
        console.error('[TechnicalSkillModal] ERROR:', error);
        this.isSubmitting = false;
      },
    });
  }

  private createEmptyForm(): TechnicalSkillFormValue {
    return {
      technicalSkills: [],
      technicalSkillsDescription: '',
      languages: createTechnicalSkillSectionValue().languages.map((lang) => ({
        ...lang,
      })),
    };
  }

  private mapInputToForm(
    technicalSkills: TechnicalSkill[] | null,
    technicalSkillsDescription: string | null,
    languages: Language[] | null,
  ): TechnicalSkillFormValue {
    return {
      technicalSkills: (technicalSkills || []).map((item) => ({
        id: item.id,
        skillName: item.skillName || '',
      })),
      technicalSkillsDescription: technicalSkillsDescription || '',
      languages:
        languages && languages.length > 0
          ? languages.map((lang) => ({
              id: lang.id,
              language: lang.language || '',
              proficiency: lang.proficiency || '',
            }))
          : createTechnicalSkillSectionValue().languages.map((lang) => ({ ...lang })),
    };
  }

  private normalizeFormValue(data: TechnicalSkillFormValue): TechnicalSkillFormValue {
    const normalizedSection = normalizeTechnicalSkillSectionValue({
      technicalSkills: data.technicalSkills,
      technicalSkillsDescription: data.technicalSkillsDescription,
      languages: data.languages,
    });

    return {
      technicalSkills: normalizedSection.technicalSkills.map((item, index) => ({
        ...item,
        id: data.technicalSkills[index]?.id,
      })),
      technicalSkillsDescription: normalizedSection.technicalSkillsDescription,
      languages: normalizedSection.languages.map((lang, index) => ({
        ...lang,
        id: data.languages[index]?.id,
      })),
    };
  }

  private toTechnicalSkillPayload(item: TechnicalSkillFormItem): TechnicalSkillPayload {
    return {
      skillName: item.skillName || null,
    };
  }

  private toLanguagePayload(item: LanguageFormItem): LanguagePayload {
    return {
      language: item.language || null,
      proficiency: item.proficiency || null,
    };
  }
}
