/* eslint-disable @typescript-eslint/prefer-as-const */
import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {AlertService} from "../core/ui-components/alert/alert.service";
import {environment} from '../../environments/environment';
import {TranslationService} from "../translation/translation.service";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {UserDto} from "./models/user-dto.model";
import {catchError, map, Observable, throwError} from 'rxjs';


/**
 * Here we manage all the authentication process, be it keycloak or other services.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  requestUrl = `${environment.apiUrl}` + `${environment.apiVersion}`;
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': '*/*',
  });
  options = {
    observe: 'response' as 'response',
    headers: this.headers,
  };

  constructor(
    public router: Router, // Inject Route Service
    private alertService: AlertService,
    private translator: TranslationService,
    private http: HttpClient,
  ) {
  }

  getAuthStatus(): boolean {
    return true;
  }

  //Reset password
  resetPassword(user: UserDto): Observable<any> {
    const url: string = this.requestUrl + `user/confirmation-code`;
    return this.http.post<any>(`${url}`, user, this.options);
  }

  checkResetCode(user: UserDto): Observable<any> {
    const url: string = this.requestUrl + "user/check-confirmation-code";
    return this.http.post<any>(`${url}`, user, this.options);
  }

  changePassword(user: UserDto): Observable<any> {
    const url: string = this.requestUrl + "user/change-password";
    return this.http.put<any>(`${url}`, user, this.options);
  }

  createUser(user: UserDto): Observable<any> {
    const url = `${this.requestUrl}user`
    return this.http.post<any>(`${url}`, user, this.options).pipe(
      map((response) => {
        return response
      }),
      catchError(this.handleError),
    );
  }


  private handleError(error: HttpErrorResponse) {
    console.log('An error occurred:', error.error);
    return throwError(error);
  }
}
