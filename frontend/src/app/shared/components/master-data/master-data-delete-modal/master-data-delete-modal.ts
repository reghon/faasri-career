import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-master-data-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './master-data-delete-modal.html',
})
export class MasterDataDeleteModal {
  @Input() open = false;
  @Input() label = 'Data';
  @Input() item: Record<string, any> | null = null;
  @Input() isDeleting = false;
  @Input() feedbackType: 'success' | 'error' | '' = '';
  @Input() feedbackMessage = '';

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onBackdropClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.tagName.toLowerCase() === 'dialog') {
      this.close.emit();
    }
  }

  onClose(): void {
    if (this.isDeleting) return;
    this.close.emit();
  }

  onConfirm(): void {
    if (this.isDeleting) return;
    this.confirm.emit();
  }
}
