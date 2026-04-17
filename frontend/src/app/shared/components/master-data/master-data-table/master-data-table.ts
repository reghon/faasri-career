import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../pagination/pagination';
import { TableActionComponent } from '../../table-action/table-action';

type MasterRecord = Record<string, any> & {
  id: string;
  code?: string;
  name?: string;
  isActive?: boolean;
};

@Component({
  selector: 'app-master-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, TableActionComponent],
  templateUrl: './master-data-table.html',
})
export class MasterDataTable implements OnChanges {
  @Input() columns: Array<{ key: string; label: string }> = [];
  @Input() items: MasterRecord[] = [];
  @Input() isLoading = false;
  @Input() label = 'Data';

  @Input() pageSize = 5;
  @Input() pageSizeOptions: number[] = [5, 10, 20, 50];
  @Output() edit = new EventEmitter<MasterRecord>();
  @Output() delete = new EventEmitter<MasterRecord>();

  currentPage = 1;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      if (!this.items.length) {
        this.currentPage = 1;
        return;
      }

      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      }
    }
  }

  get totalPages(): number {
    return Math.ceil(this.items.length / this.pageSize) || 1;
  }

  get startEntry(): number {
    if (!this.items.length) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endEntry(): number {
    return Math.min(this.currentPage * this.pageSize, this.items.length);
  }

  get paginatedItems(): MasterRecord[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.items.slice(startIndex, endIndex);
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  onEdit(item: MasterRecord): void {
    this.edit.emit(item);
  }

  onDelete(item: MasterRecord): void {
    this.delete.emit(item);
  }
}
