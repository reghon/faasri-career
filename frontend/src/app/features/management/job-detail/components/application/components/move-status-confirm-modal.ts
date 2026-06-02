import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type ConfirmModalResult = {
  notes: string | null;
};

@Component({
  selector: 'app-move-status-confirm-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './move-status-confirm-modal.html',
})
export class MoveStatusConfirmModalComponent {
  @Input() isOpen = false;
  @Input() message = 'Apakah Anda yakin?';
  @Input() isLoading = false;
  @Input() requireNotes = false;

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<ConfirmModalResult>();

  notes = '';
  isSubmitted = false;

  get notesInvalid(): boolean {
    return this.requireNotes && !this.notes.trim();
  }

  onClose(): void {
    if (this.isLoading) {
      return;
    }

    this.reset();
    this.close.emit();
  }

  onConfirm(): void {
    this.isSubmitted = true;

    const notes = this.notes.trim();

    if (this.requireNotes && !notes) {
      return;
    }

    this.confirm.emit({
      notes: notes || null,
    });
  }

  reset(): void {
    this.notes = '';
    this.isSubmitted = false;
  }
}
