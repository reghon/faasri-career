import { Injectable, computed, inject } from '@angular/core';
import { AuthService } from '../../domain/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  private readonly authService = inject(AuthService);

  readonly permissions = computed(() => this.authService.currentUser()?.permissions ?? []);

  has(permission: string): boolean {
    return this.permissions().includes(permission);
  }

  hasAny(...permissions: string[]): boolean {
    return permissions.some((permission) => this.permissions().includes(permission));
  }

  hasAll(...permissions: string[]): boolean {
    return permissions.every((permission) => this.permissions().includes(permission));
  }
}
