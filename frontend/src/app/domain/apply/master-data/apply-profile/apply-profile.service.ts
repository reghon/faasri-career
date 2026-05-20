import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../../core/config/api.config';
import { ApplyProfile } from './apply-profile.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class ApplyProfileService {
  private readonly url = API_ENDPOINTS.apply.profile;

  constructor(private readonly http: HttpClient) {}

  getByApplyId(applyId: string): Observable<ApplyProfile> {
    return this.http
      .get<ApiResponse<ApplyProfile>>(`${this.url}/${applyId}`)
      .pipe(map((res) => res.data));
  }
}
