import {EventEmitter, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "./auth.service";
import {AlertService} from "../core/ui-components/alert/alert.service";
import Keycloak from 'keycloak-js';
import { User } from './models/user.model';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { TranslationService } from '../translation/translation.service';

@Injectable({
  providedIn: 'root'
})
export class AppAuthGuard extends KeycloakAuthGuard {
  //override authenticated = this.authService.getAuthStatus() ?? true;

  constructor(
    //private authService: AuthService,
    protected override router: Router,
    private alertService: AlertService,
    private translator: TranslationService,
    protected override keycloakAngular:KeycloakService
  ) {
    super(router, keycloakAngular);
  }

  /* canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authenticated) {
      this.router.navigate(['/login']).then(() => null);
    }
    return this.authenticated;
  } */

  private user: any;
  userChange: EventEmitter<any> = new EventEmitter();

   isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
     return new Promise((resolve, reject) => {
       if (!this.authenticated) {
         this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
         return false;
       }

       return this.keycloakAngular.loadUserProfile().then((profile) => {
         this.user = new User(profile);
         this.user.roles = this.keycloakAngular.getUserRoles();
         this.notifyAndStore(this.user);/*
         const lang = this.utilService.loadLanguagePreferencesFromLocalStorage(this.user.username);
         if (lang) {
           this.translate.use(lang);
         } */

         const {accessData} = route.data;
         const hasAccess = this.user.hasEveryPermission(accessData);

         // allows the access in case there is no route.data.accessData for a route for now.
         if (hasAccess || accessData) {
           return resolve(true);
         } else {
           this.router.navigate(['home']);
           this.alertService.showAlert(
           {
              type:"warn",
              title: this.translator.translate('ERROR.ERROR'),
              message: this.translator.translate('MESSAGES.ACCESS_DENIED')
           });
           return resolve(true);
         }
       });
     });
   }

  setUser(user: any) {
    this.user = user;
    this.notifyAndStore(this.user);
  }

  getUser(): any {
    return this.user;
  }

  private notifyAndStore(user: any) {
    this.userChange.emit(user);
    return user
      ? localStorage.setItem('currentUser', JSON.stringify(user))
      : localStorage.removeItem('currentUser');
  }

}
