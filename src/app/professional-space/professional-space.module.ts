/* eslint-disable @typescript-eslint/no-explicit-any */

import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ZonesStatsComponent} from './dashboard/zones-stats/zones-stats.component';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ProfessionalSpaceRoutingModule} from "./professional-space-routing.module";
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {CoreModule} from "../core/core.module";
import {NgxUiLoaderModule} from "ngx-ui-loader";
import {ApplicationsModule} from "./applications/applications.module";
import {MortgagesModule} from './mortgages/mortgages.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';
import {CascadeSelectModule} from 'primeng/cascadeselect';
import {FileUploadModule} from 'primeng/fileupload';
import {HttpClientModule} from '@angular/common/http';
import {InputNumberModule} from 'primeng/inputnumber';
import {TranslateModule} from '@ngx-translate/core';
import {NgxIntlTelInputModule} from 'ngx-intl-tel-input';
import {ToastModule} from "primeng/toast";
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {RippleModule} from "primeng/ripple";
import {StyleClassModule} from "primeng/styleclass";
import {DocumentsModule} from "./documents/documents.module";

@NgModule({
  declarations: [
    DashboardComponent,
    ZonesStatsComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    NgxUiLoaderModule,
    ProfessionalSpaceRoutingModule,
    ApplicationsModule,
    DocumentsModule,
    MortgagesModule,
    ReactiveFormsModule,
    DialogModule,
    TranslateModule,
    FormsModule,
    DropdownModule,
    CalendarModule,
    CascadeSelectModule,
    FileUploadModule,
    FormsModule,
    HttpClientModule,
    InputNumberModule,
    NgxIntlTelInputModule,
    ConfirmDialogModule,
    PdfViewerModule,
    ToastModule,
    RippleModule,
    StyleClassModule
  ],
  exports: [

  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProfessionalSpaceModule {
}
