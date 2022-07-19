import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { Router } from '@angular/router';


@Component({
  selector: 'app-geoportal',
  templateUrl: './geoportal.component.html',
  styleUrls: ['./geoportal.component.scss']
})
export class GeoportalComponent implements OnInit {
  geoportalAppUrl: SafeResourceUrl;
  constructor(private sanitizer: DomSanitizer, protected router: Router) {
    //TODO add logic to show pro geoportal for authenticated pro users
    //This url is not bound to any bouton 
    if (router.url.includes('professional-space/geoportal')) {
      this.geoportalAppUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.geoportalProApp);
    } else {
      this.geoportalAppUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.geoportalApp);
    }
  }

  ngOnInit(): void {
  }

}
