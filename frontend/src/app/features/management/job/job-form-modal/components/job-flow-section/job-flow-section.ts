import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ApplyStatus } from '../../../../../../domain/apply/master-data/apply-status/apply-status.model';
import {
  isLockedDefaultStatus,
  mapApplyStatusToFlowItem,
  normalizeJobFlowStatuses,
} from '../../helpers/job-form.mapper';
import { JobFlowStatusItem } from '../../models/job-form.model';

@Component({
  selector: 'app-job-flow-section',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './job-flow-section.html',
})
export class JobFlowSectionComponent {
  @Input() applyStatuses: ApplyStatus[] = [];
  @Input() jobFlowStatuses: JobFlowStatusItem[] = [];
  @Input() isLocked = false;
  @Input() lockMessage = '';
  @Input() error = '';

  @Output() jobFlowStatusesChange = new EventEmitter<JobFlowStatusItem[]>();

  get availableApplyStatuses(): ApplyStatus[] {
    const selectedIds = new Set(this.jobFlowStatuses.map((item) => item.applyStatusId));

    return this.applyStatuses.filter((status) => !selectedIds.has(status.id));
  }

  isLockedDefaultStatus = isLockedDefaultStatus;

  addStatusToFlow(status: ApplyStatus): void {
    if (this.isLocked) return;

    const newItem = mapApplyStatusToFlowItem(status, 0);

    const firstFinalIndex = this.jobFlowStatuses.findIndex((item) =>
      ['REJECTED', 'HIRED', 'WITHDRAWN'].includes(item.code.toUpperCase()),
    );

    const nextItems = [...this.jobFlowStatuses];

    if (firstFinalIndex === -1) {
      nextItems.push(newItem);
    } else {
      nextItems.splice(firstFinalIndex, 0, newItem);
    }

    this.emitItems(normalizeJobFlowStatuses(nextItems));
  }

  removeStatusFromFlow(index: number): void {
    if (this.isLocked) return;

    const item = this.jobFlowStatuses[index];

    if (isLockedDefaultStatus(item)) return;

    const nextItems = this.jobFlowStatuses.filter((_, itemIndex) => itemIndex !== index);

    this.emitItems(normalizeJobFlowStatuses(nextItems));
  }

  dropJobFlowStatus(event: CdkDragDrop<JobFlowStatusItem[]>): void {
    if (this.isLocked) return;

    const draggedItem = this.jobFlowStatuses[event.previousIndex];

    if (isLockedDefaultStatus(draggedItem)) return;

    const submittedCount = this.jobFlowStatuses.filter(
      (item) => item.code.toUpperCase() === 'SUBMITTED',
    ).length;

    const firstFinalIndex = this.jobFlowStatuses.findIndex((item) =>
      ['REJECTED', 'HIRED', 'WITHDRAWN'].includes(item.code.toUpperCase()),
    );

    const minIndex = submittedCount;
    const maxIndex = firstFinalIndex === -1 ? this.jobFlowStatuses.length - 1 : firstFinalIndex - 1;

    let targetIndex = event.currentIndex;

    if (targetIndex < minIndex) targetIndex = minIndex;
    if (targetIndex > maxIndex) targetIndex = maxIndex;

    const nextItems = [...this.jobFlowStatuses];

    moveItemInArray(nextItems, event.previousIndex, targetIndex);

    this.emitItems(normalizeJobFlowStatuses(nextItems));
  }

  private emitItems(items: JobFlowStatusItem[]): void {
    this.jobFlowStatuses = items;
    this.jobFlowStatusesChange.emit(items);
  }
}
