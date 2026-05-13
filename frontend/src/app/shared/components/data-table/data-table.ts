import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination';
import { TableActionComponent, TableActionItem } from '../table-action/table-action';

export type DataTableColumn<T = any> = {
  key: keyof T | string;
  label: string;
  type?: 'text' | 'badge' | 'date' | 'number' | 'action';
  align?: 'left' | 'center' | 'right';
  minWidth?: string;
  className?: string;
  valueGetter?: (row: T) => string | number | null | undefined;
};

export type DataTablePagination = {
  currentPage: number;
  totalPages: number;
  startEntry: number;
  endEntry: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions: number[];
};

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, PaginationComponent, TableActionComponent],
  templateUrl: './data-table.html',
})
export class DataTableComponent<T = any> {
  @Input() columns: DataTableColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() isLoading = false;
  @Input() actionsGetter?: (row: T) => TableActionItem[];

  @Input() loadingText = 'Loading data...';
  @Input() emptyTitle = 'Data belum tersedia';
  @Input() emptyDescription = 'Data belum tersedia atau tidak cocok dengan filter pencarian.';

  @Input() pagination: DataTablePagination = {
    currentPage: 1,
    totalPages: 1,
    startEntry: 0,
    endEntry: 0,
    totalItems: 0,
    pageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
  };

  @Input() showView = true;
  @Input() showEdit = true;
  @Input() showDelete = false;

  @Input() useActionDropdown = false;
  @Input() actions: TableActionItem[] = [];

  @Output() view = new EventEmitter<T>();
  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();

  @Output() actionClick = new EventEmitter<{
    action: string;
    row: T;
  }>();

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  get columnCount(): number {
    return this.columns.length || 1;
  }

  onActionClick(action: string, row: T) {
    this.actionClick.emit({ action, row });
  }

  getCellValue(row: T, column: DataTableColumn<T>): string | number {
    if (column.valueGetter) {
      return column.valueGetter(row) ?? '-';
    }

    const value = (row as Record<string, any>)[column.key as string];
    return value ?? '-';
  }

  getTextAlignClass(align?: 'left' | 'center' | 'right'): string {
    if (align === 'center') return 'text-center';
    if (align === 'right') return 'text-right';
    return 'text-left';
  }

  getBadgeClass(value: string | number): string {
    const status = String(value).toLowerCase();

    if (status.includes('active') || status.includes('open')) {
      return 'badge-success';
    }

    if (status.includes('draft') || status.includes('pending')) {
      return 'badge-warning';
    }

    if (status.includes('closed') || status.includes('inactive')) {
      return 'badge-error';
    }

    return 'badge-ghost';
  }

  formatDate(value: string | number): string {
    if (!value || value === '-') return '-';

    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(value));
  }
}
