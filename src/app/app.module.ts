import {HttpClient, HttpClientModule} from '@angular/common/http';
import {APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {TranslationModule} from './translation/translation.module';
import {RippleModule} from "primeng/ripple";
import {ButtonModule} from "primeng/button";
import {CoreModule} from "./core/core.module";
import {AuthModule} from "./auth/auth.module";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {MessageService} from "primeng/api";
import {KeycloakService} from 'keycloak-angular';
import {KeyCloakInitService} from './auth/app-init';
import {ToastModule} from "primeng/toast";
import {
  NgxUiLoaderConfig,
  NgxUiLoaderHttpModule,
  NgxUiLoaderModule,
  NgxUiLoaderRouterModule,
  POSITION,
  SPINNER
} from 'ngx-ui-loader';
import {TestPagesComponent} from './test-pages/test-pages.component';
import {RouterModule} from "@angular/router";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {AuthService} from "./auth/auth.service";

/**
 * The http loader factory : Loads the files from define path.
 * @param {HttpClient} http
 * @returns {TranslateHttpLoader}
 * @constructor
 */
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/translations/', '.json');
}

export function initKeycloack(keyCloakInitService:KeyCloakInitService){
  return () =>{
    keyCloakInitService.initialize()
    .catch(() => {
      window.location.href = `${window.location.origin}/50x.html`;
  });
  }
}
const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: "#C6A531",
  bgsOpacity: 1,
  bgsSize: 40,
  bgsType: SPINNER.threeStrings,
  bgsPosition: POSITION.bottomRight,
  fgsColor: "#C6A531",
  fgsType: SPINNER.threeStrings,
  fgsPosition: POSITION.centerCenter,
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TestPagesComponent,
  ],

  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],

  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TranslationModule.forRoot({locale_id: 'fr-SN'}),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RippleModule,
    ButtonModule,
    CoreModule,
    AuthModule,
    ConfirmDialogModule,
    ToastModule,
    NgxUiLoaderHttpModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule,
    FormsModule,
  ],

  providers: [
    MessageService,
    AuthService,
    KeycloakService,
    KeyCloakInitService,
    {
      provide: APP_INITIALIZER,
      useFactory: initKeycloack,
      deps: [KeyCloakInitService],
      multi: true,
    },
  ],

  bootstrap: [
    AppComponent,
  ],

  exports: [RouterModule],

})
export class AppModule {
}
