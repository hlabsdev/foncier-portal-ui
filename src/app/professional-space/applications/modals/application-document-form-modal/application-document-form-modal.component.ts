import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {LazyLoadEvent, SelectItem} from "primeng/api";
import {RowSizes} from "../../../../core/app-layout/row-sizes.model";
import {PortalDialogConfig} from "../../../../core/ui-components/portal-dialog/portal-dialog-config.model";
import {PortalTableConfig} from "../../../../core/ui-components/portal-table/portal-table-config.model";
import {PortalTableCols} from "../../../../core/ui-components/portal-table/portal-table-cols.model";
import {Table} from "primeng/table";
import {TranslationService} from "../../../../translation/translation.service";
import {ProcedureService} from "../../services/procedure.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {UtilService} from "../../../../core/utils/util.service";
import {DocumentSourceService} from "../../../documents/services/document-source.service";
import {Document} from '../../../documents/models/document.model';
import {AlertService} from "../../../../core/ui-components/alert/alert.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DocumentSource} from "../../../documents/models/document-source.model";
import {UserApplication} from "../../models/user-application.model";
import {DocumentService} from '../../../documents/services/document.service';
import {TypeService} from '../../../documents/services/types.service';
import {Type} from '../../../documents/models/types.model';

@Component({
  selector: 'app-application-document-form-modal',
  templateUrl: './application-document-form-modal.component.html',
  styleUrls: ['./application-document-form-modal.component.scss']
})
export class ApplicationDocumentFormModalComponent implements OnInit {


  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() sourceDocumentEvent = new EventEmitter();
  @Output() identificationEvent = new EventEmitter();
  @Input() applicationDetails: UserApplication | undefined;
  @Input() isFormEnabled: boolean | undefined;
  disable?: boolean;
  /*
  @ContentChild("content")
  contentRef?: TemplateRef<any>;

  @ContentChild("tab")
  tabRef?: TemplateRef<any>;*/

  activeTab = 0;
  identification?: any;
  // new field
  showIdentification = false;
  isPanelAddDocument = false;
  isAddDocumentSourceFormVisible = false;
  uploadedFiles: any[] = [];
  principalTypes: Type[] = [];
  principalTypeItem: any;
  files: any[] = [];
  file: any;
  fileData: any;
  document: any;
  documentModel: Document = {};
  sourceTypes: Type[] = [];
  sourceType: any;
  documentsSource: DocumentSource[] = [];
  documentSource: DocumentSource = new DocumentSource();
  submitted = false;
  // documentForm!: FormArray

  documentSourceForm!: FormGroup;
  addDocumentForm!: FormGroup
  currentSource: any;
  // new field source document
  sourceDocument: DocumentSource;
  roleItem: any;
  roles: Type[] = [];
  documents!: any[];
  procedure: Document = new Document();
  totalRecords?: number;
  clicked = false;
  variablesCamunda?: any;
  rowSizes: any = RowSizes;
  locale: any;
  today?: Date;
  yearRange?: string;
  date1?: Date;
  mainTypes?: SelectItem[];
  id = 0;
  //Search variables

  searchPrincipalType = '';
  searchSubmissionDate = '';
  searchSourceType = '';
  searchFileName = '';

  // preloader message
  preloaderMessage = '...';
  @ViewChild('dt') table?: Table;

  cols: PortalTableCols[] = [];
  colsDocumentSource: PortalTableCols[] = [];


  documentTableConfig: PortalTableConfig = {
    title: this.translateService.translate('HEADER.DOCUMENT'),
    loading: false,
    selectByCheckBox: false,
    rowSelect: false,
    key: 'DOCUMENT',
    addBtn: true,
    addBtnTitle: this.translateService.translate('COMMON.ACTIONS.ADD'),
    displayAction: true,
    paginationRow: 10,
    enablePagination: true,
    enableSearchBar: true,
    enableExport: false,
    enableReload: true,
    extraFilter: false,
    dataKey: 'id',
    searchBarField: ['sourceType', 'principalType', 'submission_date', 'fileName'],
    actions: [{
      type: 'edit',
      mini: true,
      callback: '',
    }, {
      type: 'open',
      mini: true,
      callback: ''
    },
      {
        type: 'delete',
        mini: true,
        callback: '',
      },]
  };
  documentSourceTableConfig: PortalTableConfig = {
    title: this.translateService.translate('DOCUMENT.DOCUMENT_SOURCE'),
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
      callback: 'startFn',
    }, {
      type: 'delete',
      mini: true,
      callback: 'startFn'
    }]


  }
  dialogConfig!: PortalDialogConfig;

  constructor(
    private translateService: TranslationService,
    private documentService: DocumentService,
    private ngxLoader: NgxUiLoaderService,
    protected utilService: UtilService,
    private procedureService: ProcedureService,
    private sourceDocumentService: DocumentSourceService,
    private typeService: TypeService,
    private alert: AlertService,
  ) {
    this.document = {};
    // source document's fields
    this.sourceDocument = {};
    this.id = 0;
  }



  ngOnInit(): void {
    this.sourceType = null;
    this.roleItem = null;
    this.file = null;
    this.principalTypeItem = null;
    this.roleItem = this.sourceDocument.role;
    this.getRoles();
    this.getType();

    this.dialogConfig = {
      showAction: true,
      display: true,
      title: `${this.translateService.translate('APPLICATION.FOLDER')} No ${this.applicationDetails!.applicationNumber}`,
      hideSave: !this.isFormEnabled,
      canSave: true,
      tabs: [
        {name: 'Application details', required: true},
        {name: 'Document form', required: true},
        {name: 'Source form', required: false},
      ],
    };
    this.addDocumentForm = new FormGroup({
      principalTypeFormControl: new FormControl('', Validators.required),
      file: new FormControl('', Validators.required),
      sourceType: new FormControl('', Validators.required),
      submissionDate: new FormControl('', Validators.required),
      registrationDate: new FormControl(''),
      acceptationDate: new FormControl('')
    });
    this.documentSourceForm = new FormGroup({
      individualName: new FormControl('', Validators.required),
      positionName: new FormControl(''),
      organizationName: new FormControl(''),
      roleControlName: new FormControl('', Validators.required),
      address: new FormControl(''),
      contactInstruction: new FormControl(''),
      serviceHour: new FormControl(''),
      onlineRessource: new FormControl(''),
      phone: new FormControl(''),
    })
    this.identification === undefined ? this.identification = {} : this.identification
    this.cols = [
      {
        field: 'principalType',
        subField: 'value',
        header: this.translateService.translate('DOCUMENT.PRINCIPAL_TYPE'),
        sortable: true,
        type: 'text',
        width: "50px"
      },
      {
        field: 'documentType',
        subField: 'value',
        header: this.translateService.translate('DOCUMENT.SOURCE_TYPE'),
        sortable: true,
        type: 'text'
      },
      {
        field: 'submissionDate',
        header: this.translateService.translate('DOCUMENT.SUBMISSION_DATE'),
        sortable: true,
        type: 'text'
      },
      {
        field: 'fileName',
        subField: 'value',
        header: this.translateService.translate('DOCUMENT.FILE_NAME'),
        sortable: true,
        type: 'text'
      },
    ];
    this.colsDocumentSource = [
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
        header: this.translateService.translate('HEADER.ROLE'),
        sortable: true,
        filterable: false,
        type: 'text',
        width: '5 px'
      }
    ]
    this.loadDocuments();
  }


  getControl(controlName: string) {
    return this.documentSourceForm.get(controlName)
  }


  get documentSourceFormControls() {
    return this.documentSourceForm.controls;
  }

  get addDocumentFormControls() {
    return this.addDocumentForm.controls;
  }


  onRowSelect = (event: any) => console.log(event.data);
  onRowUnselect = (event: any) => console.log(event.data);
  selectedRow = (event: any) => console.log(event);

  getType() {
    this.typeService.getAllByCode("principalType").subscribe((result) => {
      this.principalTypes = result;
    });
    this.typeService.getAllByCode("documentType").subscribe((result) => {
      this.sourceTypes = result;
    });
    this.typeService.getAllByCode("fileName").subscribe((result) => {
      // console.log('files result',result)
      this.files = result;
    });
  }

  getRoles() {
    this.typeService.getAllByCode("role").subscribe((result) => {
      this.roles = result;
    });

  }

  loadDocuments(event: LazyLoadEvent = {}) {
    const args = {
      page: event.first! / event.rows!,
      perPage: event.rows ? event.rows : this.rowSizes.SMALL,
      orderBy: event.sortField,
      direction: event.sortOrder,
      searchPrincipalType: this.searchPrincipalType,
      searchSubmissionDate: this.searchSubmissionDate,
      searchSourceType: this.searchSourceType,
      searchFileName: this.searchFileName,
    };
    this.documentService.getAll(args).subscribe((result) => {
      // preloading init
      this.documentTableConfig.loading = true;
      this.ngxLoader.start();
      this.documents = [];
      this.documents = <Document[]>result.content;
      // console.log('document here',this.documents)
      // setting the preloader message
      this.preloaderMessage = this.getPreloaderMessage();

      // stopping the preloading
      this.ngxLoader.stop();
      this.documentTableConfig.loading = false;

      this.totalRecords = result.totalElements;
    });
  }

  // Return loading message according to situation
  getPreloaderMessage() {
    if (this.documents.length === 0) {
      return '...';
    } else if (this.documents.length === 1) {
      return (
        this.translateService.translate('PRELOADER.ONE_MOMENT') +
        ', ' +
        this.documents.length +
        ' ' +
        this.translateService.translate('PRELOADER.DOCUMENT') +
        ' ' +
        this.translateService.translate('PRELOADER.IS_LOADING') +
        '.'
      );
    } else {
      return (
        this.translateService.translate('PRELOADER.ONE_MOMENT') +
        ', ' +
        this.documents.length +
        ' ' +
        this.translateService.translate('PRELOADER.DOCUMENTS') +
        ' ' +
        this.translateService.translate('PRELOADER.ARE_LOADING') +
        '.'
      );
    }
  }

  reload = () => this.loadDocuments();


  call = ($event: any[]) => {
    const fn = $event[0];
    // @ts-ignore
    this[fn]($event[1]);
  }

  addDocument = () => {
    if (this.isFormEnabled) {
      this.isPanelAddDocument = this.isFormEnabled
    }
    return null;

    // console.log(this.showPanelAddDocument)
  }


  submit = () => {
  }

  // new methods

  onUpload = (event: any) => {
    this.fileData = event.files[0];
  }


  goCancel = () => {
    this.isPanelAddDocument = false;
    this.identification = {};
    this.goClose();
  };
  goClose = () => this.close.emit();

  openDialog = () => {
    this.dialogConfig = {
      showAction: true,
      display: true,
      title: this.translateService.translate('DOCUMENT.ADD_SOURCE_DOCUMENT'),
      canSave: false,
      tabs: []
    };
  }

  closeDialog = () => {
    this.dialogConfig = {
      showAction: false,
      display: false,
      title: this.translateService.translate('DOCUMENT.ADD_SOURCE_DOCUMENT'),
      canSave: false,
      tabs: []
    };
  }

  //new methods


  onAddDocumentSource(documentSourceFormValue: any) {
    console.log(documentSourceFormValue)

    this.sourceDocument.id = this.id + 1;
    this.sourceDocument.role = this.roleItem.name;
    this.sourceDocument.individualName = documentSourceFormValue.individualName
    this.sourceDocumentEvent.emit(this.sourceDocument);
    console.log(this.sourceDocument);
    this.currentSource = this.sourceDocument
    // this.documentsSource.push(this.currentSource)
    this.documentsSource.push(this.sourceDocument)
    this.documentSourceForm.reset()
    console.log('document Source array', this.documentsSource)
    this.roleItem = {};
    this.sourceDocument = {};
    // this.goCancel();
  }

  onSubmitAddDocument(addDocumentForm: any) {
    console.log(addDocumentForm);
    // this.goCancel()
    this.goSave()
  }


  /*goSave = () => {
    // this.dialogConfig.canSave ? this.save.emit(this.identification) : false;
    this.dialogConfig.display = false;
    this.identificationEvent.emit(this.identification);
  }*/
  goSave() {

    // this.ngOnInit();

    console.log("file", this.fileData)
    this.submitted = true;
    if (this.addDocumentForm.invalid) {
      return;
    }
    console.log(this.sourceType);

    this.document.filePath = "process";
    this.document.documentType = this.sourceType;
    this.document.fileName = this.file;
    this.document.principalType = this.principalTypeItem;
    console.log(this.document);

    const documentJson = JSON.stringify(this.document);

    const formData: FormData = new FormData();

    if (this.fileData != null) {
      formData.set("document", documentJson);
      formData.set("file", this.fileData);
    }

    this.documentService.addDocument(formData).subscribe((result) => {
      console.log(formData)
      /*console.log('document JSON',formData.get('document'))
      console.log('document JSON',formData.get('file'))*/
      if (result != null) {
        this.document = result;
        console.log(" document", this.document)
        for (let i = 0; i < this.documentsSource.length; i++) {
          this.documentsSource[i].document = this.document;
          console.log("list source document", this.documentsSource[i]);
          const response = this.sourceDocumentService.addDocumentSource(this.documentsSource[i]);
          console.log("source document", response)
        }
      }
    }, erreur => {
      console.log("Erreur lors de la création: ", erreur);
    });
    this.document = {};
    this.documentsSource = [];
    this.submitted = false;
    this.addDocumentForm.reset();
  }

  /* this.sourceDocument.id = this.id + 1;
  this.sourceDocument.role = this.roleItem.name;
  this.sourceDocument.individualName = documentSourceFormValue.individualName
  this.sourceDocumentEvent.emit(this.sourceDocument);
  console.log(this.sourceDocument);
  this.currentSource = this.sourceDocument
  this.documentsSource.push(this.currentSource)
  this.roleItem = {};
  this.sourceDocument = {};
  // this.goCancel();
}*/
}
