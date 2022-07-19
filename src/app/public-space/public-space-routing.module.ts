import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AppAuthGuard} from "../auth/auth.guard";
import {DashboardComponent} from "../professional-space/dashboard/dashboard.component";
import {ProcedureListComponent} from "../professional-space/applications/procedure-list/procedure-list.component";
import {ApplicationListComponent} from "../professional-space/applications/application-list/application-list.component";
import {ApplicationComponent} from "../professional-space/applications/application/application.component";
import {IdentificationComponent} from "../professional-space/applications/identification/identification.component";
import {DocumentListComponent} from "../professional-space/documents/document-list/document-list.component";
import {OfficeComponent} from "../professional-space/applications/office/office.component";
import {DocumentFormComponent} from "../professional-space/documents/document-form/document-form.component";
import {
  ArchivedApplicationListComponent
} from "../professional-space/applications/archived-applications-list/archived-application-list.component";

const publicSpaceRoutes: Routes = [
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
];

@NgModule({
  imports: [RouterModule.forChild(publicSpaceRoutes)],
  exports: [RouterModule],
})
export class PublicSpaceRoutingModule {
}
