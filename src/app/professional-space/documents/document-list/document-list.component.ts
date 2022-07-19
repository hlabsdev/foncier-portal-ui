import {Component, OnInit, ViewChild} from '@angular/core';
import {RowSizes} from "../../../core/app-layout/row-sizes.model";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {PortalTableConfig} from "../../../core/ui-components/portal-table/portal-table-config.model";
import {PortalTableCols} from "../../../core/ui-components/portal-table/portal-table-cols.model";
import {Table} from "primeng/table";
import {TranslationService} from "../../../translation/translation.service";
import {ProcedureService} from "../../applications/services/procedure.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {Router} from "@angular/router";
import {DocumentService} from "../services/document.service";
import {Document} from '../models/document.model';
import {HelperService} from '../../applications/services/helper.service';
import {AlertService} from "../../../core/ui-components/alert/alert.service";
import {saveAs} from 'file-saver';
import {UserApplication} from '../../applications/models/user-application.model';
import {Procedure} from "../../applications/models/procedure.model";

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit {

  tableConfig: PortalTableConfig = {
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
    searchBarField: ['principalType.value', 'documentType.value', 'submission_date', 'fileName.value'],
    actions: [
      {
        type: 'edit',
        mini: true,
        callback: 'updateDocument',
      },
      {
        type: 'download',
        mini: true,
        callback: 'downloadDocument',
      },
      {
        type: 'delete',
        mini: true,
        callback: 'deleteDocument',
      },]
  }
  documents: Document[] = [];
  procedure: Document = new Document();
  totalRecords?: number;
  rowSizes: any = RowSizes;
  today?: Date;
  yearRange?: string;
  documentDetails: Document = {};
  //Search variables
  currentSpace = "";
  searchPrincipalType = '';
  searchSubmissionDate = '';
  searchDocumentType = '';
  searchFileName = '';

  // preloader message
  preloaderMessage = '...';
  processId = "";
  title = "";
  variablesCamunda?: any;
  userApplication: UserApplication = {};
  typeAction: any;
  showDialog = false;
  process:Procedure={};
  cols: PortalTableCols[] = [];

  @ViewChild('dt') table?: Table;

  constructor(
    private translateService: TranslationService,
    private documentService: DocumentService,
    private ngxLoader: NgxUiLoaderService,
    private router: Router,
    private procedureService: ProcedureService,
    private helperService: HelperService,
    private alert: AlertService,
    private confirmationService: ConfirmationService
  ) {
    const variablesCamunda = <string>localStorage.getItem("variablesCamunda")
    this.processId = JSON.parse(variablesCamunda).processInstanceId;
    this.reload();
    this.currentSpace = <string>localStorage.getItem('currentSpace');
  }

  ngOnInit() {
    if (this.procedureService.data.getTaskId() == undefined && this.procedureService.data.getApplicantId() == undefined &&
      this.procedureService.data.getApplicantType() == undefined && this.procedureService.data.getOfficeId() == undefined &&
      this.procedureService.data.getApplicationDate() == undefined && this.procedureService.data.getApplicationNumber() == undefined
    ) {
      // After refresh page
      this.variablesCamunda = this.helperService.loadVariableCamunda()

    } else {
      // without refresh'
      this.variablesCamunda = this.procedureService.data
    }
    this.helperService.getSteperStateSessionStorage();
    this.today = new Date();
    this.yearRange = `1900:${new Date().getFullYear().toString()}`;
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
        type: 'date'
      },
      {
        field: 'fileName',
        subField: 'value',
        header: this.translateService.translate('DOCUMENT.FILE_NAME'),
        sortable: true,
        type: 'text'
      }
    ];
    this.loadDocuments();
  }

  loadDocuments(event: LazyLoadEvent = {}) {
    const args = {
      page: event.first! / event.rows!,
      perPage: event.rows ? event.rows : this.rowSizes.SMALL,
      orderBy: event.sortField,
      direction: event.sortOrder,
      searchPrincipalType: this.searchPrincipalType,
      searchSubmissionDate: this.searchSubmissionDate,
      searchDocumentType: this.searchDocumentType,
      searchFileName: this.searchFileName,
    };

    this.documentService.getAllByProcessInstanceId(args, this.processId).subscribe((result) => {
      this.tableConfig.loading = true;
      this.ngxLoader.start();
      this.documents = [];
      this.documents = <Document[]>result.content;
      this.documents.forEach(el => {
        if (el.extension == "pdf") {
          el.btnExtension = {
            type: 'support',
            callback: 'viewDocument',
          }
        } else if (el.extension == 'png' || el.extension == 'jpg' || el.extension === 'jpeg' || el.extension === 'gif') {
          el.btnExtension = {
            type: 'support',
            callback: 'viewDocument',
          }
        } else
          el.btnExtension = {
            type: 'unsupport',
            callback: 'viewDocument',
          }
      });
      this.preloaderMessage = this.getPreloaderMessage();
      this.ngxLoader.stop();
      this.tableConfig.loading = false;
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

  reload() {
    this.loadDocuments();
  }

  completeTaskCamunda() {
    const variablesCamunda = <string>localStorage.getItem("variablesCamunda")
    this.userApplication.processInstanceId = JSON.parse(variablesCamunda).processInstanceId;
    const currentUser = <string>localStorage.getItem('currentUser');
    this.userApplication.username = JSON.parse(currentUser).username;
    const currentObjectProcess = <string> sessionStorage.getItem("currentObjectProcess");
    this.process.uuid = JSON.parse(currentObjectProcess).uuid;
    this.userApplication.application=this.process;
    let currentObjectApplicant: any;
    currentObjectApplicant = sessionStorage.getItem("currentObjectApplicant");
    currentObjectApplicant = JSON.parse(currentObjectApplicant);
    if (currentObjectApplicant.applicantType.value == "individuals") {
      this.userApplication.applicantName = currentObjectApplicant.firstName + " " + currentObjectApplicant.lastName;
    } else {
      this.userApplication.applicantName = currentObjectApplicant.registredName;
    }
    let currentObjectApplication: any;
    currentObjectApplication = sessionStorage.getItem("currentObjectApplication");
    currentObjectApplication = JSON.parse(currentObjectApplication);
    this.userApplication.applicationNumber = currentObjectApplication.applicationNumber;
    this.userApplication.status = "submitted";
    const variable = {
      variables: {
        taskId: {
          value: this.variablesCamunda['taskId'],
          type: "String"
        },
        applicantId: {
          value: this.variablesCamunda['applicantId'],
          type: "String"
        },
        applicantType: {
          value: this.variablesCamunda['applicantType'],
          type: "String"
        },
        applicantEmail: {
          value: this.variablesCamunda['applicantEmail'],
          type: "String"
        },
        applicationNumber: {
          value: this.variablesCamunda['applicationNumber'],
          type: "String"
        },
        applicationDate: {
          value: this.variablesCamunda['applicationDate'],
          type: "String"
        },
        applicationObject: {
          value: this.variablesCamunda['applicationObject'],
          type: "String"
        },
        officeId: {
          value: this.variablesCamunda['officeId'],
          type: "String"
        },
        nicad: {
          value: this.variablesCamunda['nicad'],
          type: "String"
        },
        titleNumber: {
          value: this.variablesCamunda['titleNumber'],
          type: "String"
        },
        allotment: {
          value: this.variablesCamunda['allotment'],
          type: "String"
        },
        nLot: {
          value: this.variablesCamunda['nLot'],
          type: "String"
        },
        isRequisitionRequired: {
          value: false,
          type: "Boolean"
        },

      },
      "withVariablesInReturn": true
    }
    this.procedureService.createUserApplication(this.userApplication).subscribe((result) => {
      this.procedureService.completeTaskCamunda(variable).subscribe((res => {
          if (res.status === 200) {
            this.helperService.removeVariableCamunda();
            this.helperService.removeSteperState();
            this.router.navigate(['/'+this.currentSpace+"/dashboard"])
            this.helperService.stepDone = [-1, -1, -1]
            const sessionStorageVariables = ['procedures', 'currentObjectApplicant', 'office', 'currentObjectIdentification']
            sessionStorageVariables.forEach(item => sessionStorage.removeItem(item))
          }
        }),
        (error) => {
          this.alert.showAlert({
            type: 'error',
            title: 'SERVER ERROR',
            message: '',
          })
        })
    });
  }

  startFn = (item: any) => {
    this.router.navigate(['/' + this.currentSpace + "/demande-application"])
  };
  onRowSelect = (event: any) => console.log(event.data);
  onRowUnselect = (event: any) => console.log(event.data);
  selectedRow = (event: any) => console.log(event);

  call($event: any[]) {
    const fn = $event[0];
    // @ts-ignore
    this[fn]($event[1]);
  }

  downloadDocument = (data: Document) => {
    this.documentDetails = data;
    this.documentService.getFile(this.documentDetails).subscribe(val => {
      return saveAs(val, this.documentDetails.fileName?.value);
    });

  }

  updateDocument = (data: Document) => {
    this.documentDetails = data;
    this.typeAction = "edit";
    this.showDialog = true;
    this.title = this.translateService.translate('DOCUMENT.UPDATE_DOCUMENT');
  }

  viewDocument = (data: Document) => {
    this.typeAction = "view";
    this.documentDetails = data;
    if (this.documentDetails.extension == 'pdf' || this.documentDetails.extension == 'png' || this.documentDetails.extension == 'jpg' || this.documentDetails.extension !== 'jpeg') {
      this.showDialog = true;
      this.title = this.translateService.translate('DOCUMENT.VIEW_DOCUMENT')
    }
  }

  closeDialog() {
    this.showDialog = false;
  }

  deleteDocument = (data: Document) => {
    this.confirmationService.confirm({
      message: this.translateService.translate('COMMON.MESSAGE.CONFIRM_REMOVE'),
      accept: () => {
        this.documentService.deleteDocument(data).subscribe((result) => {
          if (result != null) {
            window.location.reload();
          }
        });
      }
    });
  }

  navigateToAddDocumentComponent = () => {
    this.router.navigate(['/' + this.currentSpace + '/add-document'])
  };

  navigateToIdentificationComponent() {
    this.helperService.stepDone[2] = 0;
    this.helperService.setSteperStateSessionStorage(this.helperService.stepDone)
    this.router.navigate(['/' + this.currentSpace + '/application-identification']);
  }
}
