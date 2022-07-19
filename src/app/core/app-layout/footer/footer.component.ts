import { Component, OnInit } from '@angular/core';
import { KeyCloakInitService } from '../../../auth/app-init';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  isAuthenticated = false;

  constructor( private keycloak: KeyCloakInitService
    ) { }

  ngOnInit(): void {
    this.isAuthenticated =  this.keycloak.isAuthenticated();

  }

}
