import { Component, HostListener, Input, OnInit } from '@angular/core';
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
  @Input() transparent = false;
  @Input() variant: 'public' | 'management' = 'public';

  isScrolled = false;
  get isManagement(): boolean {
    return this.variant === 'management';
  }

  constructor(private readonly authService: AuthService) {}

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 10;
  }

  ngOnInit(): void {
    this.isScrolled = window.scrollY > 10;
  }

  get isWhite(): boolean {
    if (this.isManagement) return true;
    return !this.transparent || this.isScrolled;
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get currentUser() {
    return this.authService.currentUser();
  }

  get displayName(): string {
    const email = this.authService.currentUser()?.email;
    if (!email) return this.isManagement ? 'HR' : 'User';
    return email.split('@')[0];
  }
  get isManagementRole(): boolean {
    return this.currentUser?.roleName !== 'applicant';
  }
  logout(): void {
    this.authService.logout().subscribe();
  }
}
