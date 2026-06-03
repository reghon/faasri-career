import { Component, computed, HostListener, inject, input, OnInit, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { filter, take, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../../../domain/auth/auth.service';
import { RbacService } from '../../../domain/authorization/rbac.service';
import { ApplicantProfileService } from '../../../domain/applicant/applicant_profile/applicant_profile.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf, RouterLinkActive],
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly applicantProfileService = inject(ApplicantProfileService);

  readonly rbac = inject(RbacService);

  transparent = input(false);
  variant = input<'public' | 'management'>('public');

  isScrolled = signal(false);
  isAuthReady = signal(false);
  avatarUrl = signal<string | null>(null);

  readonly isLoggedIn = this.authService.isLoggedIn;
  readonly currentUser = this.authService.currentUser;

  readonly isManagement = computed(() => this.variant() === 'management');

  readonly isWhite = computed(() => {
    if (this.isManagement()) {
      return true;
    }
    return !this.transparent() || this.isScrolled();
  });

  readonly displayName = computed(() => {
    const email = this.currentUser()?.email;
    if (!email) {
      return this.isManagement() ? 'HR' : 'User';
    }
    return email.split('@')[0];
  });

  readonly isManagementRole = computed(() => {
    const user = this.currentUser();
    return !!user && user.roleName !== 'applicant';
  });

  constructor() {
    toObservable(this.authService.isReady)
      .pipe(
        filter((ready) => ready),
        take(1),
        switchMap(() => {
          if (this.authService.isLoggedIn()) {
            return this.applicantProfileService.getMe();
          }
          return of(null);
        }),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: (profile) => {
          this.isAuthReady.set(true);
          if (profile?.avatarUrl) {
            this.avatarUrl.set(this.applicantProfileService.getFileUrl(profile.avatarUrl));
          }
        },
        error: () => {
          this.isAuthReady.set(true);
        },
      });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 10);
  }

  ngOnInit(): void {
    this.isScrolled.set(window.scrollY > 10);
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}
