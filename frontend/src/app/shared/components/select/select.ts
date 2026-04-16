import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select.html',
})
export class SelectComponent {
  @Input() label!: string;
  @Input() name!: string;

  @Input() model: any;
  @Output() modelChange = new EventEmitter<any>();

  @Input() options: { label: string; value: any }[] = [];
  @Input() placeholder: string = 'Pilih';
  @Input() error: string | null = null;
}
