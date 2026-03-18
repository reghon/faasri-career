import { Component, Input } from '@angular/core';
import {
  PersonalInfo,
  EducationInfo,
  ExperienceInfo,
} from '../../../../../core/mock/application.mock';

@Component({
  selector: 'app-step4-review',
  standalone: true,
  imports: [],
  templateUrl: './step4-review.html',
})
export class Step4Review {
  @Input() personalInfo!: PersonalInfo;
  @Input() educationInfo!: EducationInfo;
  @Input() experienceInfo!: ExperienceInfo;
}
