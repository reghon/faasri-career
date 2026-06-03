import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
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
  readonly isOpen = input(false);
  readonly message = input('Apakah Anda yakin?');
  readonly isLoading = input(false);
  readonly requireNotes = input(false);

  readonly close = output<void>();
  readonly confirm = output<ConfirmModalResult>();

  readonly notes = signal('');
  readonly isSubmitted = signal(false);

  readonly notesInvalid = computed(() => this.requireNotes() && !this.notes().trim());

  onClose(): void {
    if (this.isLoading()) {
      return;
    }

    this.reset();
    this.close.emit();
  }

  onConfirm(): void {
    this.isSubmitted.set(true);

    const notes = this.notes().trim();

    if (this.requireNotes() && !notes) {
      return;
    }

    this.confirm.emit({
      notes: notes || null,
    });
  }

  reset(): void {
    this.notes.set('');
    this.isSubmitted.set(false);
  }
}
