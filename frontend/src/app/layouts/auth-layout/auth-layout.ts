import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../shared/components/navbar/navbar';
import { Toast } from '../../shared/components/toast/toast';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, Navbar, Toast],
  templateUrl: './auth-layout.html',
})
export class AuthLayout {}
