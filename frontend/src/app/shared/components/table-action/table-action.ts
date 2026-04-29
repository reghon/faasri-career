import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export type TableActionItem = {
  label: string;
  icon?: string;
  class?: string;
  disabled?: boolean;
  value: string;
};

@Component({
  selector: 'app-table-action',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-action.html',
})
export class TableActionComponent {
  @Input() showView = false;
  @Input() showEdit = false;
  @Input() showDelete = false;

  @Input() useDropdown = false;
  @Input() actions: TableActionItem[] = [];

  @Output() view = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() actionClick = new EventEmitter<string>();

  onActionClick(action: TableActionItem) {
    if (action.disabled) return;
    this.actionClick.emit(action.value);
  }
}
