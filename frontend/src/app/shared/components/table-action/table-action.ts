import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

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

  @Output() view = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
}
