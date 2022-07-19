import {Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {PortalDialogConfig} from 'src/app/core/ui-components/portal-dialog/portal-dialog-config.model';
import {TranslationService} from "../../../../translation/translation.service";
import {Document} from '../../models/document.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TypeService} from "../../services/types.service";
import {Type} from '../../models/types.model';
import {DocumentService} from '../../services/document.service';
import {AlertService} from 'src/app/core/ui-components/alert/alert.service';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-document-detail-modal',
  templateUrl: './document-detail-modal.component.html',
  styleUrls: ['./document-detail-modal.component.scss']
})
export class DocumentDetailModalComponent implements OnInit {

  // @Output() save = new EventEmitter();
  // @Output() cancel = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() sourceDocumentEvent = new EventEmitter();
  // @Input() dialogConfig = new PortalDialogConfig();
  @Input() documentDetails!: Document;
  @Input() typeAction!: any;
  @Input() title!: string;
  disable?: boolean;
  @ContentChild("content")
  contentRef?: TemplateRef<any>;

  @ContentChild("tab")
  tabRef?: TemplateRef<any>;

  dialogConfig: PortalDialogConfig = {
    showAction: true,
    display: true,
    title: this.title,
    canSave: true,
    tabs: [],
  };

  registerForm: FormGroup = new FormGroup({});
  submitted = false;
  principalTypes: Type[] = [];
  principalType: any;
  processId = "";
  files: Type[] = [];
  file: any;
  fileData: any;
  document: any;
  sourceTypes: Type[] = [];
  sourceType: any;
  aff = true;
  source = environment.apiUrl + environment.apiVersion + "document";
  filename: string | undefined = "";


  constructor(
    private typeService: TypeService,
    private translateService: TranslationService,
    private alertService: AlertService,
    private documentService: DocumentService,
  ) {
  }

  ngOnInit(): void {
    if(this.typeAction === 'view'){
      this.dialogConfig.hideSave = true;
    }
    this.dialogConfig.title = this.title;
    this.principalType = this.documentDetails.principalType;
    this.file = this.documentDetails.fileName;
    this.sourceType = this.documentDetails.documentType;
    this.source = this.source + "/" + this.documentDetails.filePath + "/" + this.documentDetails.fileName?.value + "." + this.documentDetails.extension;
    this.filename = this.documentDetails.fileName?.value + "." + this.documentDetails.extension;
    this.getType();
    this.submitted = false;
    this.registerForm = new FormGroup({
      principalType: new FormControl('', [Validators.required]),
      file: new FormControl('', [Validators.required]),
      sourceType: new FormControl('', [Validators.required]),
      submissionDate: new FormControl('', [Validators.required]),
      regitreDate: new FormControl(''),
      acceptationDate: new FormControl()
    });
  }

  getType() {
    this.typeService.getAllByCode("principalType").subscribe((result) => {
      this.principalTypes = result;
    });
    this.typeService.getAllByCode("documentType").subscribe((result) => {
      this.sourceTypes = result;
    });
    this.typeService.getAllByCode("fileName").subscribe((result) => {
      this.files = result;
    });
  }

  onUpload(event: any) {
    this.aff = false;
    this.fileData = event.files[0];
  }

  get f() {
    return this.registerForm.controls;
  }

  goSave() {
    this.documentDetails.principalType = this.principalType;
    this.documentDetails.fileName = this.file;
    this.documentDetails.documentType = this.sourceType;
    this.documentService.updateDocument(this.documentDetails);
    this.goCancel();
  }

  goCancel = () => {
    this.submitted = false;
    // this.dialogConfig.display = false;
    this.close.emit();
  };

  submit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    if (this.documentDetails.fileName != this.file) {
      return this.alertService.showAlert({
        type: 'error',
        title: this.translateService.translate('ERROR.ERROR'),
        message: this.translateService.translate('ERROR.FILE'),
      });
    }
    this.goSave();
  }
}
