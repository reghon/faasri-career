import { Component, computed, HostListener, input, OnInit, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../domain/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf, RouterLinkActive],
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit {
  transparent = input(false);
  variant = input<'public' | 'management'>('public');

  isScrolled = signal(false);

  isManagement = computed(() => this.variant() === 'management');

  isWhite = computed(() => {
    if (this.isManagement()) return true;
    return !this.transparent() || this.isScrolled();
  });

  isLoggedIn = computed(() => this.authService.isLoggedIn());

  currentUser = computed(() => this.authService.currentUser());

  displayName = computed(() => {
    const email = this.currentUser()?.email;
    if (!email) return this.isManagement() ? 'HR' : 'User';
    return email.split('@')[0];
  });

  isManagementRole = computed(() => {
    const user = this.currentUser();
    return !!user && user.roleName !== 'applicant';
  });
  
  constructor(private readonly authService: AuthService) {}

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
