import {Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {AlertService} from "../core/ui-components/alert/alert.service";
import {KeyCloakInitService} from '../auth/app-init';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  backgroundImg: string;
  sgfLogo: string;
  isConnected = false;

  constructor(private alertService: AlertService, private router: Router, private keycloak: KeyCloakInitService) {
    this.backgroundImg = '/assets/img/home-background.png';
    this.sgfLogo = '/assets/img/logo-sgf.png';
  }

  ngOnInit(): void {

  }

  navigateProfessional() {
    //Set the urrent space to professional
    localStorage.setItem('currentSpace', 'professional-space');
    //Check if there is a connected user
    if (this.keycloak.isAuthenticated()) {
      this.router.navigate(['/professional-space/dashboard']);
    }
    else this.router.navigate(['/login'], {queryParams:{returnUrl: '/professional-space/dashboard'}})
  }

  navigatePublic() {
    //Set the urrent space to public
    localStorage.setItem('currentSpace', 'public-space');
    //Check if there is a connected user
    if (this.keycloak.isAuthenticated()) {
      this.router.navigate(['/public-space/dashboard']);
    }
    else this.router.navigate(['/login'], {queryParams:{returnUrl: '/public-space/dashboard'}})
  }

}
