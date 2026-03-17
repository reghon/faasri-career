import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-step-indicator',
  standalone: true,
  imports: [],
  templateUrl: './step-indicator.html',
})
export class StepIndicator {
  @Input() steps: { number: number; label: string }[] = [];
  @Input() currentStep = 1;
  @Output() stepClick = new EventEmitter<number>();
}
