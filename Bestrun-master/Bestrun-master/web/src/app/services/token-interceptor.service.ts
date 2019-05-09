import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { StorageService } from './storage.service';
import {Observable, of, throwError} from 'rxjs';
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";
import {NotificationType} from "angular2-notifications";
import {NotifyService} from "./notify.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  token_key: string = "token_auth";

  constructor(private router: Router,public storage: StorageService,private notify: NotifyService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({
      setHeaders: {
        Authorization: `${this.storage.get(this.token_key)}`
      }
    });

    return next.handle(request).pipe(
      catchError(x=> this.handleAuthError(x))
    );
  }

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    if (err.status === 401 || err.status === 403) {
      this.notify.show(NotificationType.Error, "Error", err.error.message);
      this.router.navigateByUrl(`/auth`);
      return of(err.message);
    }
    return throwError(err);
  }
}
