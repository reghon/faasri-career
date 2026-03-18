import { Component, Input, OnInit, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit {
  @Input() transparent = false;
  isScrolled = false;

  constructor(private authService: AuthService) {}

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  ngOnInit() {
    this.isScrolled = window.scrollY > 10;
  }

  get isWhite(): boolean {
    return !this.transparent || this.isScrolled;
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get currentUser() {
    return this.authService.currentUser;
  }
  get displayName(): string {
    const email = this.authService.currentUser?.email;
    if (!email) return 'User';
    return email.split('@')[0];
  }

  logout() {
    this.authService.logout();
  }
}
