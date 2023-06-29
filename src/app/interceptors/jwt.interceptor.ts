import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class JwtInterceptor implements HttpInterceptor {
  constructor() {}

  // Intercepts all HTTP requests!
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const data = StorageService.getItem('axs_auth_data');
    if (data) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          // tslint:disable-next-line: object-literal-key-quotes
          Authorization: `Bearer ${data.userToken}`,
          'cache-control': 'no-cache',
        },
      });
    }
    return next.handle(request);
  }
}
