import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalRouteLoader } from './shared/components/global-route-loader/global-route-loader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GlobalRouteLoader],
  templateUrl: './app.html',
})
export class App {}
