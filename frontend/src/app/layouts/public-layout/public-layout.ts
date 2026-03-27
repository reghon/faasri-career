import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../shared/components/navbar/navbar';
import { Footer } from '../../shared/components/footer/footer';
import { Toast } from '../../shared/components/toast/toast';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer, Toast],
  templateUrl: './public-layout.html',
})
export class PublicLayout {}
