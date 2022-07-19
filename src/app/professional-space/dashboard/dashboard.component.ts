import {Component, OnInit} from '@angular/core';
import {Application} from '../applications/models/application.model';
import {UserApplicationService} from '../applications/services/user-application.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  tab: Array<string>[][] = [];
  elemtents: Array<string>[] = [];
  elemtents2: Array<string>[] = [];
  applications: Application[] = [];
  pending!: number;
  validated!: number;
  rejected!: number;
  completed!: number;

  constructor(private applicationService: UserApplicationService) {
    this.elemtents.push(["En ce moment à Dakar Plateau"]);
    this.elemtents.push(["Etat des lieux", "12"]);
    this.elemtents.push(["Recensement", "20"]);
    this.elemtents.push(["Situation Foncière", "20"]);
    this.elemtents.push(["Autres", "3"]);
    this.tab.push(this.elemtents);
    this.elemtents2.push(["En ce moment à Ngor Almadie"]);
    this.elemtents2.push(["Etat des lieux", "22"]);
    this.elemtents2.push(["Recensement", "10"]);
    this.elemtents2.push(["Situation Foncière", "15"]);
    this.elemtents2.push(["Autres", "3"]);
    this.tab.push(this.elemtents2);
  }

  ngOnInit(): void {
    localStorage.removeItem('steperState');
    // this.applicationService.getApplicationsStatus().subscribe((result) => {
    //   console.log('result ',result);

    //   this.applications = [];
    //   this.applications = result.content;
    //   let statusAll = this.applications.map(el => el.status);
    //   this.rejected = this.numberStates(statusAll, 'rejected');
    //   this.pending = this.numberStates(statusAll, 'pending');
    //   this.validated = this.numberStates(statusAll, 'validated');

    // });
  }

  numberStates = (arr: any, val: any) => arr.reduce(
    (a: any, v: any) => (v === val ? a + 1 : a), 0);


}
