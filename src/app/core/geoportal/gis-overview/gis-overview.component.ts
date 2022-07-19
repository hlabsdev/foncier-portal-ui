import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-gis-overview',
  templateUrl: './gis-overview.component.html',
  styleUrls: ['./gis-overview.component.scss']
})
export class GisOverviewComponent implements OnInit {

  gisOverviewUrl:SafeResourceUrl;
  constructor(private sanitizer: DomSanitizer) { 
    this.gisOverviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.gisOverviewApp);
  }

  ngOnInit(): void {
  }

}
