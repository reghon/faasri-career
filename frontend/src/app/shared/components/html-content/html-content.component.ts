import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'faasri-html-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './html-content.component.html',
})
export class HtmlContentComponent {
  @Input() title: string = '';
  @Input() content: string | null = null;
}
