import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-section-add-button',
  standalone: true,
  templateUrl: './section-add-button.html',
})
export class SectionAddButton {
  @Input() label = 'TAMBAHKAN';
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clicked.emit();
  }
}
