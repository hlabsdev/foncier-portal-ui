import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AppAuthGuard} from "../auth/auth.guard";
import {ApplicationComponent} from "./applications/application/application.component";
import {ProcedureListComponent} from "./applications/procedure-list/procedure-list.component";
import {ApplicationListComponent} from "./applications/application-list/application-list.component";
import {OfficeComponent} from "./applications/office/office.component";
import {IdentificationComponent} from "./applications/identification/identification.component";
import {DocumentFormComponent} from "./documents/document-form/document-form.component";
import {DocumentListComponent} from "./documents/document-list/document-list.component";
import {MortgageListComponent} from "./mortgages/mortgage-list/mortgage-list.component";
import {
  ArchivedApplicationListComponent
} from "./applications/archived-applications-list/archived-application-list.component";

const professionalSpaceRoutes: Routes = [
  // Root path
  {path: "", component: DashboardComponent},
  {path: "dashboard", component: DashboardComponent},
  {path: "procedure-list", component: ProcedureListComponent, canActivate: [AppAuthGuard]},
  {path: "application-list", component: ApplicationListComponent, canActivate: [AppAuthGuard]},
  {path: "archived-application-list", component: ArchivedApplicationListComponent, canActivate: [AppAuthGuard]},
  {path: "application", component: ApplicationComponent, canActivate: [AppAuthGuard]},
  {path: "application-office", component: OfficeComponent, canActivate: [AppAuthGuard]},
  {path: "application-identification", component: IdentificationComponent, canActivate: [AppAuthGuard]},
  {path: "add-document", component: DocumentFormComponent, canActivate: [AppAuthGuard]},
  {path: "document-list", component: DocumentListComponent, canActivate: [AppAuthGuard]},
  {path: "mortgage-list", component: MortgageListComponent, canActivate: [AppAuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(professionalSpaceRoutes)],
  exports: [RouterModule],
})
export class ProfessionalSpaceRoutingModule {
}
