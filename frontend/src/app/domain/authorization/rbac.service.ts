import { Injectable, inject } from '@angular/core';
import { AuthorizationService } from './authorization.service';
import { PERMISSIONS } from './authorization.constant';

@Injectable({
  providedIn: 'root',
})
export class RbacService {
  private readonly permission = inject(AuthorizationService);

  readonly applicant = {
    canList: () => this.permission.has(PERMISSIONS.APPLICANT.LIST),
    canCreate: () => this.permission.has(PERMISSIONS.APPLICANT.CREATE),
    canRead: () => this.permission.has(PERMISSIONS.APPLICANT.READ),
    canUpdate: () => this.permission.has(PERMISSIONS.APPLICANT.UPDATE),
    canDelete: () => this.permission.has(PERMISSIONS.APPLICANT.DELETE),
  };

  readonly job = {
    canList: () => this.permission.has(PERMISSIONS.JOB.LIST),
    canCreate: () => this.permission.has(PERMISSIONS.JOB.CREATE),
    canRead: () => this.permission.has(PERMISSIONS.JOB.READ),
    canUpdate: () => this.permission.has(PERMISSIONS.JOB.UPDATE),
    canDelete: () => this.permission.has(PERMISSIONS.JOB.DELETE),
  };

  readonly application = {
    canList: () => this.permission.has(PERMISSIONS.APPLICATION.LIST),
    canCreate: () => this.permission.has(PERMISSIONS.APPLICATION.CREATE),
    canRead: () => this.permission.has(PERMISSIONS.APPLICATION.READ),
    canUpdate: () => this.permission.has(PERMISSIONS.APPLICATION.UPDATE),
    canDelete: () => this.permission.has(PERMISSIONS.APPLICATION.DELETE),
  };

  readonly masterData = {
    canList: () => this.permission.has(PERMISSIONS.MASTER_DATA.LIST),
    canCreate: () => this.permission.has(PERMISSIONS.MASTER_DATA.CREATE),
    canRead: () => this.permission.has(PERMISSIONS.MASTER_DATA.READ),
    canUpdate: () => this.permission.has(PERMISSIONS.MASTER_DATA.UPDATE),
    canDelete: () => this.permission.has(PERMISSIONS.MASTER_DATA.DELETE),
  };

  readonly admin = {
    canList: () => this.permission.has(PERMISSIONS.ADMIN.LIST),
    canCreate: () => this.permission.has(PERMISSIONS.ADMIN.CREATE),
    canRead: () => this.permission.has(PERMISSIONS.ADMIN.READ),
    canUpdate: () => this.permission.has(PERMISSIONS.ADMIN.UPDATE),
    canDelete: () => this.permission.has(PERMISSIONS.ADMIN.DELETE),
  };
}
