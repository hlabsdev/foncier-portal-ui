import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-zones-stats',
  templateUrl: './zones-stats.component.html',
  styleUrls: ['./zones-stats.component.scss']
})
export class ZonesStatsComponent implements OnInit {

  @Input() zoneDetails: Array<string>[]= [];
  title="";
  splittedArray: Array<string>[]= [];

  constructor() {

   }

  ngOnInit(): void {
    this.title = this.zoneDetails[0][0];
    this.splittedArray= this.zoneDetails.slice(1,this.zoneDetails.length);
  }


}
