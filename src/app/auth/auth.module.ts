import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {LostPasswordComponent} from './lost-password/lost-password.component';
import {RegisterComponent} from './register/register.component';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TranslationModule} from '../translation/translation.module';
import {AuthService} from "./auth.service";
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {NgxUiLoaderModule} from "ngx-ui-loader";


@NgModule({
  declarations: [
    LoginComponent,
    LostPasswordComponent,
    RegisterComponent,
    ResetPasswordComponent,
  ],

    imports: [
        CommonModule,
        TranslationModule,
        FormsModule,
        RouterModule,
        NgxUiLoaderModule
    ],

  providers:[
    AuthService,
  ],
})
export class AuthModule { }
