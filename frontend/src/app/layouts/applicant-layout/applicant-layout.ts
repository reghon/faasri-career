import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../shared/components/navbar/navbar';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-applicant-layout',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './applicant-layout.html',
})
export class ApplicantLayout {}
