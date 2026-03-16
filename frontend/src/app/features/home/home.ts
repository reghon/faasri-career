import { Component } from '@angular/core';
import { HeroSection } from './components/hero-section/hero-section';
import { JobFilter } from './components/job-filter/job-filter';
import { JobCard } from '../../shared/components/job-card/job-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroSection, JobFilter, JobCard],
  templateUrl: './home.html',
})
export class Home {}
