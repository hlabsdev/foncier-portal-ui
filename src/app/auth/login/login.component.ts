import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {catchError, tap} from 'rxjs/operators';
import {throwError as observableThrowError} from 'rxjs/internal/observable/throwError';
import {KeycloakService} from 'keycloak-angular';
import {ActivatedRoute} from '@angular/router';
import {Config} from '../models/config.model';
import {AlertService} from 'src/app/core/ui-components/alert/alert.service';
import {TranslationService} from 'src/app/translation/translation.service';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username="";
  password="";
  //error message won't be shown if this string is empty
  errorMessage = false;
  showPassword = false;
  loading = false;
  config: Config= new Config();
  returnUrl="";
  tokenInfo="";

  constructor(
    private keycloakService: KeycloakService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private translator: TranslationService,
  ) {}

  ngOnInit(): void {
    this.config.keyCloakUrl = environment.keyCloakUrl;
    this.config.keyCloakRealm = environment.keyCloakRealm;
    this.config.keyCloakClientId = environment.keyCloakClientId;
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    if (this.returnUrl === '/') {
        if (localStorage.getItem('currentSpace') !== null){
          this.returnUrl = `/${localStorage.getItem('currentSpace')}/dashboard`;
        }
        this.returnUrl = '/public-space/dashboard';
    }
  }

  submit() {
    this.loading = true;
    this.getTokenKeyCloak(this.username, this.password).subscribe(
      (data) => {
        this.keycloakService
          .init({
            config: {
              url: this.config.keyCloakUrl,
              realm: this.config.keyCloakRealm,
              clientId: this.config.keyCloakClientId,
            },
            initOptions: {
              checkLoginIframe: false,
              token: data.access_token,
              idToken: data.id_token,
              refreshToken: data.refresh_token,
              redirectUri: this.returnUrl,
            },
          })
          .then((res) => {
            localStorage.setItem('token', JSON.stringify(data));
            window.location.replace(this.returnUrl);
            window.history.replaceState(window.history.state, "", this.returnUrl);
          })
          .catch((error) => {
            this.loading = false;
            this.handleError(error);
          });
      },
      (error) => {
        this.loading = false;
        this.handleError(error);
        if (error.status === 401) {
          this.errorMessage = true;
          this.password = '';
        }
      },
    );
  }

  getTokenKeyCloak(username: string, password: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    };

    const params = new HttpParams({
      fromObject: {
        grant_type: 'password',
        client_id: this.config.keyCloakClientId,
        username,
        password,
        scope: 'openid',
      },
    });

    const url = `${this.config.keyCloakUrl}/realms/${this.config.keyCloakRealm}/protocol/openid-connect/token`;

    return this.http.post(url, params, httpOptions).pipe(
      tap((response: any) => {
        this.tokenInfo = response.access_token;
      }),
      catchError(this.handleError),
    );
  }

  private handleError(error: any) {
    this.alertService.showAlert({
      type: 'error',
      message: this.translator.translate('LOGIN.FAILED'),
      title: 'AN ERROR OCCURED',
      permanent: true,
    });
    return observableThrowError(error);
  }

}
