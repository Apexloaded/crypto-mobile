import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, map, retry } from 'rxjs/operators';
import { cleanObject } from '../helpers';
import { EnvironmentService } from './environment.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl: string;

  constructor(private http: HttpClient, envService: EnvironmentService) {
    this.apiUrl = envService.environment.api;
  }

  getApi(url: string): Observable<any> {
    const apiUrl = `${this.apiUrl}/${url}`;
    return this.http
      .get<any>(apiUrl, httpOptions)
      .pipe(retry(3), map(this.extractData), catchError(this.handleError));
  }

  postApi(url: string, data: any): Observable<any> {
    const apiUrl = `${this.apiUrl}/${url}`;
    const payload = cleanObject(data);
    return this.http
      .post(apiUrl, payload, httpOptions)
      .pipe(retry(3), catchError(this.handleError));
  }

  updateApi(url: string, data: any): Observable<any> {
    const payload = cleanObject(data);
    const apiUrl = `${this.apiUrl}/${url}`;
    return this.http
      .put(apiUrl, payload, httpOptions)
      .pipe(retry(3), catchError(this.handleError));
  }

  patchApi(url: string, data = {}): Observable<any> {
    const apiUrl = `${this.apiUrl}/${url}`;
    return this.http
      .patch(apiUrl, data, httpOptions)
      .pipe(retry(3), catchError(this.handleError));
  }

  deleteApi(url: string): Observable<{}> {
    const apiUrl = `${this.apiUrl}/${url}`;
    return this.http
      .delete(apiUrl, httpOptions)
      .pipe(retry(3), catchError(this.handleError));
  }

  getImageUrl(str: string) {
    return `${this.apiUrl}/assets/images/${str}`;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error(`\n\n::Frontend Error: ${error.status}\n\n`);
    } else {
      console.error(`\n\n::Backend Error:\n\n`);
    }
    return throwError(error);
  }

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }
}
