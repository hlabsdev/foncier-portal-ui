import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApplicationListComponent} from './application-list/application-list.component';
import {UserApplicationService} from "./services/user-application.service";
import {CoreModule} from "../../core/core.module";
import {NgxUiLoaderModule} from "ngx-ui-loader";
import {ProcedureListComponent} from './procedure-list/procedure-list.component';
import {
  ApplicationDocumentFormModalComponent
} from './modals/application-document-form-modal/application-document-form-modal.component';
import {ApplicationStateModalComponent} from './modals/application-state-modal/application-state-modal.component';
import {DialogModule} from 'primeng/dialog';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FileUploadModule} from "primeng/fileupload";
import {DropdownModule} from "primeng/dropdown";
import {CalendarModule} from "primeng/calendar";
import {InputNumberModule} from "primeng/inputnumber";
import {ArchivedApplicationListComponent} from './archived-applications-list/archived-application-list.component';
import {HelperService} from "./services/helper.service";
import {ProcedureService} from "./services/procedure.service";
import {ApplicationComponent} from "./application/application.component";
import {OfficeComponent} from "./office/office.component";
import {IdentificationComponent} from "./identification/identification.component";
import {MapComponent} from "./modals/map/map.component";
import {RippleModule} from "primeng/ripple";


// @ts-ignore
@NgModule({
  declarations: [
    ApplicationListComponent,
    ProcedureListComponent,
    ApplicationStateModalComponent,
    ApplicationDocumentFormModalComponent,
    ArchivedApplicationListComponent,
    ApplicationComponent,
    OfficeComponent,
    IdentificationComponent,
    MapComponent,
  ],

  imports: [
    CommonModule,
    DialogModule,
    TranslateModule,
    CoreModule,
    NgxUiLoaderModule,
    ReactiveFormsModule,
    FileUploadModule,
    DropdownModule,
    CalendarModule,
    InputNumberModule,
    FormsModule,
    RippleModule,
  ],

  providers:[
    UserApplicationService,
    HelperService,
    ProcedureService
  ],

  exports: [
    ApplicationListComponent,
    ProcedureListComponent,
    ApplicationStateModalComponent,
    ApplicationDocumentFormModalComponent,
    ApplicationComponent,
    OfficeComponent,
    IdentificationComponent,
    MapComponent,
    ArchivedApplicationListComponent,
  ]

})
export class ApplicationsModule { }
