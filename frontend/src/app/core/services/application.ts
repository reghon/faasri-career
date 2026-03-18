import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApplicationForm } from '../mock/application.mock';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  submitApplication(jobId: string, form: ApplicationForm): Observable<any> {
    console.log('Submitting application for job:', jobId, form);
    return of({ success: true, message: 'Lamaran berhasil dikirim!' });
  }
}
