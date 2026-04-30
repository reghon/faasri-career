import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type ToolbarSortDirection = 'asc' | 'desc';

export interface ToolbarFilter {
  key: string;
  label: string;
  value: string;
  options: string[];
}

export interface ToolbarSortOption {
  key: string;
  label: string;
}

export interface ToolbarAction {
  key: string;
  label: string;
}

@Component({
  selector: 'app-table-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table-toolbar.html',
})
export class TableToolbarComponent {
  @Input() search = '';
  @Input() searchPlaceholder = 'Search...';

  @Input() sortBy = '';
  @Input() sortDirection: ToolbarSortDirection = 'desc';

  @Input() filters: ToolbarFilter[] = [];
  @Input() sortOptions: ToolbarSortOption[] = [];
  @Input() actions: ToolbarAction[] = [];

  @Output() searchChange = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<{ key: string; value: string }>();
  @Output() sortDirectionChange = new EventEmitter<ToolbarSortDirection>();
  @Output() sortByChange = new EventEmitter<string>();
  @Output() action = new EventEmitter<string>();

  onSearchChange(value: string): void {
    this.searchChange.emit(value);
  }

  onFilterChange(key: string, value: string): void {
    this.filterChange.emit({ key, value });
  }

  toggleSortDirection(): void {
    const nextDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortDirectionChange.emit(nextDirection);
  }

  selectSort(field: string): void {
    this.sortByChange.emit(field);
  }

  onAction(key: string): void {
    this.action.emit(key);
  }
}
