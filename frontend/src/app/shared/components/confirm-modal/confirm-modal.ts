import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal.html',
})
export class ConfirmModal {
  @Input() title = 'Konfirmasi';
  @Input() message = 'Apakah anda yakin?';
  @Input() confirmLabel = 'Hapus';
  @Input() cancelLabel = 'Batal';
  @Input() isOpen = false;
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
}
