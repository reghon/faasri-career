import { Component, Input, OnInit, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit {
  @Input() transparent = false;
  isScrolled = false;

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
}
