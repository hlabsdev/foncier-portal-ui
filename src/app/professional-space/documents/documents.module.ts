import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DocumentDetailModalComponent} from "./document-detail-modal/document-detail-modal.component";
import {DocumentFormComponent} from "./document-form/document-form.component";
import {DocumentListComponent} from "./document-list/document-list.component";
import {DocumentSourceFormModalComponent} from "./document-source-form-modal/document-source-form-modal.component";
import {DialogModule} from "primeng/dialog";
import {TranslateModule} from "@ngx-translate/core";
import {CoreModule} from "../../core/core.module";
import {NgxUiLoaderModule} from "ngx-ui-loader";
import {ReactiveFormsModule} from "@angular/forms";
import {FileUploadModule} from "primeng/fileupload";
import {DropdownModule} from "primeng/dropdown";
import {CalendarModule} from "primeng/calendar";
import {InputNumberModule} from "primeng/inputnumber";
import {DocumentService} from "./services/document.service";
import {DocumentSourceService} from "./services/document-source.service";
import {TypeService} from "./services/types.service";
import {PdfViewerModule} from "ng2-pdf-viewer";
import {RippleModule} from "primeng/ripple";

const components = [
  DocumentDetailModalComponent,
  DocumentFormComponent,
  DocumentListComponent,
  DocumentSourceFormModalComponent,
];

@NgModule({
  declarations: [...components,],
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
    PdfViewerModule,
    RippleModule,
  ],
  exports: [...components,],
  providers: [
    DocumentService,
    DocumentSourceService,
    TypeService,
  ],
})
export class DocumentsModule { }
