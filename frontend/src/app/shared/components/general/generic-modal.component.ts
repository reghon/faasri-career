import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-generic-modal',
  templateUrl: './generic-modal.component.html',
})
export class GenericModalComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() isSubmitting = false;
  @Input() cancelLabel = 'Batal';
  @Input() saveLabel = 'Simpan';
  @Input() savingLabel = 'Menyimpan...';

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).tagName === 'DIALOG') {
      this.close.emit();
    }
  }
}
