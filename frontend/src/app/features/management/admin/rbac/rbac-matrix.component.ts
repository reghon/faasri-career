import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';

import { RoleService } from '../../../../domain/admin/role/role.service';
import { ModuleService } from '../../../../domain/rbac/modules/module.service';
import { PermissionActionService } from '../../../../domain/rbac/permission-actions/permission-action.service';
import { PermissionService } from '../../../../domain/rbac/permissions/permission.service';
import { RolePermissionService } from '../../../../domain/rbac/role-permissions/role-permission.service';

import { Role } from '../../../../domain/admin/role/role.model';
import { Module } from '../../../../domain/rbac/modules/module.model';
import { PermissionAction } from '../../../../domain/rbac/permission-actions/permission-action.model';
import { Permission } from '../../../../domain/rbac/permissions/permission.model';
import { RolePermission } from '../../../../domain/rbac/role-permissions/role-permission.model';

interface MatrixCell {
  permissionId: string | null;
  rolePermissionId: string | null;
  checked: boolean;
  originalChecked: boolean;
  disabled: boolean;
}

interface MatrixRow {
  moduleId: string;
  moduleCode: string;
  moduleName: string;
  cells: Record<string, MatrixCell>;
}

@Component({
  selector: 'app-rbac-matrix',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rbac-matrix.component.html',
})
export class RbacMatrixComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly roleService = inject(RoleService);
  private readonly moduleService = inject(ModuleService);
  private readonly permissionActionService = inject(PermissionActionService);
  private readonly permissionService = inject(PermissionService);
  private readonly rolePermissionService = inject(RolePermissionService);

  roles: Role[] = [];
  modules: Module[] = [];
  actions: PermissionAction[] = [];
  permissions: Permission[] = [];
  rolePermissions: RolePermission[] = [];

  selectedRoleId = '';

  matrixRows: MatrixRow[] = [];

  isLoading = false;
  isSaving = false;

  pageFeedbackMessage = '';
  pageFeedbackType: 'success' | 'error' | '' = '';

  ngOnInit(): void {
    this.loadInitialData();
  }

  get hasRoleSelected(): boolean {
    return !!this.selectedRoleId;
  }

  get hasChanges(): boolean {
    return this.matrixRows.some((row) =>
      this.actions.some((action) => {
        const cell = row.cells[action.id];
        return cell && cell.checked !== cell.originalChecked;
      }),
    );
  }

  onRoleChange(): void {
    this.pageFeedbackMessage = '';
    this.pageFeedbackType = '';

    if (!this.selectedRoleId) {
      this.matrixRows = [];
      this.cdr.detectChanges();
      return;
    }

    this.buildMatrix();
  }

  loadInitialData(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    forkJoin({
      roles: this.roleService.getAll(),
      modules: this.moduleService.getAll(),
      actions: this.permissionActionService.getAll(),
      permissions: this.permissionService.getAll(),
      rolePermissions: this.rolePermissionService.getAll(),
    })
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: ({ roles, modules, actions, permissions, rolePermissions }) => {
          this.roles = (roles ?? []).filter((item) => item.isActive);
          this.modules = (modules ?? []).filter((item) => item.isActive);
          this.actions = this.sortActions((actions ?? []).filter((item) => item.isActive));
          this.permissions = (permissions ?? []).filter((item) => item.isActive);
          this.rolePermissions = rolePermissions ?? [];

          if (this.roles.length > 0 && !this.selectedRoleId) {
            this.selectedRoleId = this.roles[0].id;
          }

          if (this.selectedRoleId) {
            this.buildMatrix();
          } else {
            this.matrixRows = [];
          }

          this.cdr.detectChanges();
        },
        error: (error) => {
          this.showError(this.extractErrorMessage(error, 'Gagal memuat data RBAC.'));
        },
      });
  }

  buildMatrix(): void {
    if (!this.selectedRoleId) {
      this.matrixRows = [];
      return;
    }

    const activeRolePermissions = this.rolePermissions.filter(
      (item) => item.roleId === this.selectedRoleId,
    );

    this.matrixRows = this.modules.map((moduleItem) => {
      const row: MatrixRow = {
        moduleId: moduleItem.id,
        moduleCode: moduleItem.code,
        moduleName: moduleItem.name,
        cells: {},
      };

      for (const action of this.actions) {
        const permission = this.permissions.find(
          (item) =>
            item.moduleId === moduleItem.id &&
            item.permissionActionId === action.id &&
            item.isActive,
        );

        const rolePermission = permission
          ? activeRolePermissions.find((item) => item.permissionId === permission.id)
          : undefined;

        const checked = Boolean(rolePermission?.isActive);

        row.cells[action.id] = {
          permissionId: permission?.id ?? null,
          rolePermissionId: rolePermission?.id ?? null,
          checked,
          originalChecked: checked,
          disabled: !permission,
        };
      }

      return row;
    });

    this.cdr.detectChanges();
  }

  toggleCell(row: MatrixRow, actionId: string, value: boolean): void {
    const cell = row.cells[actionId];
    if (!cell || cell.disabled) return;

    cell.checked = value;
    this.pageFeedbackMessage = '';
    this.pageFeedbackType = '';
    this.cdr.detectChanges();
  }

  save(): void {
    if (!this.selectedRoleId || !this.hasChanges || this.isSaving) return;

    const requests = this.getSaveRequests();

    if (requests.length === 0) {
      return;
    }

    this.isSaving = true;
    this.pageFeedbackMessage = '';
    this.pageFeedbackType = '';
    this.cdr.detectChanges();

    forkJoin(requests)
      .pipe(
        switchMap(() => this.rolePermissionService.getAll()),
        finalize(() => {
          this.isSaving = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (rolePermissions) => {
          this.rolePermissions = rolePermissions ?? [];
          this.buildMatrix();
          this.pageFeedbackType = 'success';
          this.pageFeedbackMessage = 'Role permission berhasil diperbarui.';
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.showError(this.extractErrorMessage(error, 'Gagal menyimpan role permission.'));
        },
      });
  }

  resetChanges(): void {
    for (const row of this.matrixRows) {
      for (const action of this.actions) {
        const cell = row.cells[action.id];
        if (!cell) continue;
        cell.checked = cell.originalChecked;
      }
    }

    this.pageFeedbackMessage = '';
    this.pageFeedbackType = '';
    this.cdr.detectChanges();
  }

  isChecked(row: MatrixRow, actionId: string): boolean {
    return Boolean(row.cells[actionId]?.checked);
  }

  isDisabled(row: MatrixRow, actionId: string): boolean {
    return Boolean(row.cells[actionId]?.disabled);
  }

  private getSaveRequests() {
    const requests: ReturnType<RolePermissionService['create']>[] = [];

    for (const row of this.matrixRows) {
      for (const action of this.actions) {
        const cell = row.cells[action.id];
        if (!cell || cell.disabled) continue;
        if (cell.checked === cell.originalChecked) continue;
        if (!cell.permissionId) continue;

        if (cell.rolePermissionId) {
          requests.push(
            this.rolePermissionService.update(cell.rolePermissionId, {
              roleId: this.selectedRoleId,
              permissionId: cell.permissionId,
              isActive: cell.checked,
            }),
          );
        } else if (cell.checked) {
          requests.push(
            this.rolePermissionService.create({
              roleId: this.selectedRoleId,
              permissionId: cell.permissionId,
              isActive: true,
            }),
          );
        }
      }
    }

    return requests;
  }

  private sortActions(actions: PermissionAction[]): PermissionAction[] {
    const orderMap: Record<string, number> = {
      CREATE: 1,
      READ: 2,
      UPDATE: 3,
      DELETE: 4,
    };

    return [...actions].sort((a, b) => {
      const aOrder = orderMap[a.code?.toUpperCase()] ?? 999;
      const bOrder = orderMap[b.code?.toUpperCase()] ?? 999;

      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.name.localeCompare(b.name);
    });
  }

  private extractErrorMessage(error: any, fallback: string): string {
    return error?.error?.message || error?.message || fallback;
  }

  private showError(message: string): void {
    this.pageFeedbackType = 'error';
    this.pageFeedbackMessage = message;
    this.cdr.detectChanges();
  }
}
