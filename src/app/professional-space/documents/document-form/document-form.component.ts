import {Component, OnInit, ViewChild} from '@angular/core';
import {PortalTableConfig} from "../../../core/ui-components/portal-table/portal-table-config.model";
import {TranslationService} from "../../../translation/translation.service";
import {PortalTableCols} from "../../../core/ui-components/portal-table/portal-table-cols.model";
import {Table} from "primeng/table";
import {ConfirmationService} from "primeng/api";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {DocumentSourceService} from "../services/document-source.service";
import {DocumentSource} from '../models/document-source.model';
import {Document} from '../models/document.model';
import {Router} from "@angular/router";
import {HelperService} from '../../applications/services/helper.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TypeService} from "../services/types.service";
import {Type} from '../models/types.model';
import {DocumentService} from '../services/document.service';
import {AlertService} from 'src/app/core/ui-components/alert/alert.service';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.scss']
})
export class DocumentFormComponent implements OnInit {

  uploadedFiles: any[] = [];
  principalTypes: Type[] = [];
  principalType: any;
  processId = "";
  files: any[] = [];
  file: any;
  fileData: any;
  document: any;
  documentModel: Document = {};
  sourceTypes: Type[] = [];
  sourceType: any;
  documentsSource: DocumentSource[] = [];
  documentSource: any = new DocumentSource();
  documentSourceDetails: any;
  submitted = false;
  currentSpace = "";
  registerForm: FormGroup = new FormGroup({});
  tableConfig: PortalTableConfig = {
    loading: false,
    selectByCheckBox: false,
    rowSelect: false,
    key: 'document_source',
    displayAction: true,
    paginationRow: 5,
    enablePagination: false,
    enableSearchBar: true,
    enableExport: false,
    enableReload: false,
    extraFilter: false,
    dataKey: 'id',
    searchBarField: ['id', 'individualName', 'role'],
    actions: [{
      type: 'edit',
      mini: true,
      callback: 'openDialog',
    }, {
      type: 'delete',
      mini: true,
      callback: 'deleteSourceDocument'
    }]


  }
  cols: PortalTableCols[] = [];
  id = 0;
  showDialog = false;

  @ViewChild('dt') table?: Table;

  constructor(
    private translateService: TranslationService,
    private ngxLoader: NgxUiLoaderService,
    private alertService: AlertService,
    private sourceDocumentService: DocumentSourceService,
    private confirmationService: ConfirmationService,
    private router: Router, private typeService: TypeService,
    private helperService: HelperService, private documentService: DocumentService) {
    this.document = {};
    this.id = 0;
    this.documentSource.id = this.id;
    this.currentSpace = <string>localStorage.getItem('currentSpace');
  }

  ngOnInit(): void {
    let variablesCamunda: any;
    // eslint-disable-next-line prefer-const
    variablesCamunda = localStorage.getItem("variablesCamunda")
    this.processId = JSON.parse(variablesCamunda).processInstanceId;
    this.sourceType = null;
    this.file = null;
    this.principalType = null;
    this.getType();
    this.helperService.getSteperStateSessionStorage();
    this.submitted = false;
    this.registerForm = new FormGroup({
      principalType: new FormControl('', [Validators.required]),
      file: new FormControl('', [Validators.required]),
      sourceType: new FormControl('', [Validators.required]),
      submissionDate: new FormControl('', [Validators.required]),
      regitreDate: new FormControl(''),
      acceptationDate: new FormControl('')
    });
    this.cols = [
      {
        field: 'id',
        header: 'ID',
        sortable: true,
        filterable: false,
        type: 'text',
        width: "5px"
      },
      {
        field: 'individualName',
        header: this.translateService.translate('DOCUMENT.INDIVIDUAL_NAME'),
        sortable: true,
        filterable: false,
        type: 'text',
        width: "5 px"
      },
      {
        field: 'role',
        subField: 'value',
        header: this.translateService.translate('HEADER.ROLE'),
        sortable: true,
        filterable: false,
        type: 'text',
        width: '5 px'
      }
    ];
    this.loadSourceDocument(this.documentsSource);
  }

  get f() { return this.registerForm.controls; }


  onUpload(event: any) {
    this.fileData = event.files[0];
  }

  openDialog = (data: DocumentSource) => {
    this.documentSourceDetails = data;
    this.showDialog = true;
  }

  closeDialog = () => {
    this.showDialog = false;
  }

  deleteSourceDocument = (data: DocumentSource) => {
    this.confirmationService.confirm({
      message: this.translateService.translate('COMMON.MESSAGE.CONFIRM_REMOVE'),
      accept: () => {
        this.documentsSource.splice(this.documentsSource.indexOf(data), 1);
      }
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

  goSave() {
    this.loadSourceDocument(this.documentsSource);
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    if (this.fileData == null) {
      return this.alertService.showAlert({
        type: 'error',
        title: this.translateService.translate('ERROR.ERROR'),
        message: this.translateService.translate('ERROR.FILE'),
      });
    }
    if (this.documentsSource.length == 0) {
      return this.alertService.showAlert({
        type: 'error',
        title: this.translateService.translate('ERROR.ERROR'),
        message: this.translateService.translate('ERROR.SOURCE'),
      });
    }
    this.document.filePath = this.processId;
    this.document.documentType = this.sourceType;
    this.document.fileName = this.file;
    this.document.principalType = this.principalType;
    const documentJson = JSON.stringify(this.document);
    const formData: FormData = new FormData();
    if (this.fileData != null) {
      formData.set("document", documentJson);
      formData.set("file", this.fileData);
    }
    this.documentService.addDocument(formData).subscribe((result) => {
      this.loadSourceDocument(this.documentsSource);
      if (result != null) {
        this.document = result;
        for (let i = 0; i < this.documentsSource.length; i++) {
          this.documentsSource[i].document = this.document;
          const response = this.sourceDocumentService.addDocumentSource(this.documentsSource[i]).subscribe((resultSource) => {
            this.documentSource = resultSource ? resultSource : new DocumentSource();
          });
        }
      }
    }, erreur => {
      console.log("Erreur lors de la création: ", erreur);
    });
    this.router.navigate(['/' + this.currentSpace + "/document-list"]).then((res) =>

      window.location.reload());
  }

  call($event: any[]) {
    const fn = $event[0];
    // @ts-ignore
    this[fn]($event[1]);
  }

  loadSourceDocument(documentsSource: DocumentSource[]) {
    this.tableConfig.loading = true;
    this.ngxLoader.start();
    this.documentsSource = [];
    this.documentsSource = documentsSource;
    this.ngxLoader.stop();
    this.tableConfig.loading = false;
  }

  redisplayInfos(data: DocumentSource) {
    if (data.id == null || data.id == 0) {
      this.id = this.id + 1;
      data.id = this.id;
      this.documentsSource.push(data);
    } else {
      this.documentsSource[data.id - 1] = data;
    }
    this.loadSourceDocument(this.documentsSource);
  }

  navigateToIdentificationComponent = () => {
    this.helperService.stepDone[2] = 0;
    this.helperService.setSteperStateSessionStorage(this.helperService.stepDone)
    this.router.navigate(['/' + this.currentSpace + "/application-identification"])
  };

}
