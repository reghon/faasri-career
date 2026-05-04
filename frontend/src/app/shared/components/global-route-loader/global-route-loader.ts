import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouteLoadingService } from '../../../core/services/route-loading.service';

@Component({
  selector: 'faasri-global-route-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './global-route-loader.html',
})
export class GlobalRouteLoader {
  private readonly routeLoadingService = inject(RouteLoadingService);

  readonly isLoading$ = this.routeLoadingService.loading$;
}
