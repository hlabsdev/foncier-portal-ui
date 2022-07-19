import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {Config} from './models/config.model';
import {environment} from '../../environments/environment';
import {KeycloakService} from 'keycloak-angular';
import {TranslationService} from '../translation/translation.service';
import {AlertService} from '../core/ui-components/alert/alert.service';

@Injectable()
export class KeyCloakInitService {
    config: Config=new Config();
    constructor(private keycloak: KeycloakService, private router: Router,private translator: TranslationService,private alertService: AlertService,
        private location: Location) {}

    initialize(): Promise<any> {

    this.config.keyCloakUrl = environment.keyCloakUrl;
    this.config.keyCloakRealm = environment.keyCloakRealm;
    this.config.keyCloakClientId = environment.keyCloakClientId;
      // eslint-disable-next-line no-async-promise-executor
        return new Promise( async (resolve, reject) => {
          try {
            const options: any = {
              config: {
                url: this.config.keyCloakUrl,
                realm: this.config.keyCloakRealm,
                clientId: this.config.keyCloakClientId,
              },
              initOptions: {
                checkLoginIframe: false,
              },
            };

            const data = JSON.parse(<string>localStorage.getItem('token'));
            if (data) {
              const accessToken = JSON.parse(atob(data.access_token.split('.')[1]));
              if (accessToken && new Date().getTime() < accessToken.exp * 1000) {
                options.initOptions.token = data.access_token;
                options.initOptions.idToken = data.id_token;
                options.initOptions.refreshToken = data.refresh_token;
              }
            }

            await this.keycloak.init(options);
            resolve(null);
          } catch (error) {
            reject(error);
          }
        });
    }

    isAuthenticated(): boolean {
        if(this.keycloak.getKeycloakInstance().authenticated){
            if(!this.location.path()){
                // check the connected user's profil before routing to dashboard. Dashbord is for professionnal users
                this.router.navigate(['/professional-space/dashboard']);
            }
            return true;
        } else {
            if( this.location.path() != '/login'
            && !this.location.path().includes('/login')
            && this.location.path() != '/register'
            && this.location.path() != '/lost-password'
            && this.location.path() != '/reset-password'
            && !this.location.path().includes('/reset-password')
            && this.location.path() != '/404'
            && this.location.path() != '/home')
            {
                this.router.navigate(['/home']);
                this.alertService.showAlert(
                    {
                       type:"warn",
                       title: this.translator.translate('ERROR.ERROR'),
                       message: this.translator.translate('MESSAGES.ACCESS_DENIED')
                    });
            }
            return false;
        }
    }
}
