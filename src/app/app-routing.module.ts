import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AppAuthGuard} from './auth/auth.guard';
import {LoginComponent} from './auth/login/login.component';
import {HomeComponent} from './home/home.component';
import {NotFoundComponent} from "./core/not-found/not-found.component";
import {LostPasswordComponent} from './auth/lost-password/lost-password.component';
import {RegisterComponent} from './auth/register/register.component';
import {TestPagesComponent} from "./test-pages/test-pages.component";
import {ResetPasswordComponent} from "./auth/reset-password/reset-password.component";
import {GeoportalComponent} from './core/geoportal/geoportal.component';

const routes: Routes = [
  // Root path
  { path: '', pathMatch: 'full', redirectTo: '/home' },

  //Testing
  { path: 'test', component: TestPagesComponent },

  //Geoportal
  { path: 'public-space/geoportal', component: GeoportalComponent },
  { path: 'professional-space/geoportal', component: GeoportalComponent },

  // Home path
  { path: 'home', component: HomeComponent },

  // Auth paths
  { path: 'login', component: LoginComponent },
  { path: 'lost-password', component: LostPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'register', component: RegisterComponent },

  //Espace professionel
  {
    path: 'professional-space',
    loadChildren: () => import('./professional-space/professional-space.module').then((m) => m.ProfessionalSpaceModule),
    canActivate: [AppAuthGuard],
  },

  //Espace publique
  {
    path: 'public-space',
    loadChildren: () => import('./public-space/public-space.module').then((m) => m.PublicSpaceModule),
    canActivate: [AppAuthGuard],
  },


  //Error handling
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    AppAuthGuard,
  ]
})
export class AppRoutingModule { }
