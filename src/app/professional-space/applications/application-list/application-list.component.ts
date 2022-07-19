import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {UserApplication} from '../models/user-application.model';
import {LazyLoadEvent, SelectItem} from 'primeng/api';
import {Table} from 'primeng/table';
import {TranslationService} from '../../../translation/translation.service';
import {PortalTableConfig} from '../../../core/ui-components/portal-table/portal-table-config.model';
import {PortalTableCols} from '../../../core/ui-components/portal-table/portal-table-cols.model';
import {UserApplicationService} from '../services/user-application.service';
import {RowSizes} from '../../../core/app-layout/row-sizes.model';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {UtilService} from '../../../core/utils/util.service';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss'],
})
export class ApplicationListComponent implements OnInit {
  userApplications: UserApplication[] = [];
  userApplication: UserApplication = new UserApplication();
  applicationDetails!: UserApplication;
  isFormEnabled = false;
  totalRecords?: number;
  rowSizes: any = RowSizes;
  locale: any;
  today?: Date;
  yearRange?: string;
  date1?: Date;
  mainTypes?: SelectItem[];
  //Search variables
  searchapplicant = '';
  searchfolder = '';
  searchtransactionName = '';
  searchdateOfChange = '';
  searchdateOfPickUp = '';
  searchdateOfSubmission = '';
  searchStatus: any;
  stateValue: any[] = [];
  stateBtnValue = 0;
  // preloader message
  preloaderMessage = '...';
  tableConfig: PortalTableConfig = {
    title: this.translateService.translate('HEADER.APPLICATIONS'),
    titleTooltip: this.translateService.translate('HEADER.APPLICATIONS'),
    loading: false,
    key: 'applications',
    displayAction: true,
    displayState: true,
    paginationRow: 10,
    enablePagination: true,
    enableSearchBar: true,
    enableExport: true,
    enableReload: true,
    dataKey: 'id',
    // searchBarField: ['applicantName', 'applicationNumber', 'transactionName', 'lastUpdateDate', 'creationDate', 'applicationReceptionDate'],
    searchBarField: [
      'application',
      'applicantName',
      'applicationNumber',
      'creationDate',
      'lastUpdateDate',
      'applicationReceptionDate',
    ],
    states: [],
    actions: [
      {
        type: 'edit',
        callback: 'editApplication',
        // mini: true,
      },
      {
        type: 'archive',
        callback: 'archiveApplication',
        // mini: true,
      },
      {
        type: 'view',
        callback: 'viewApplication',
        // mini: true,
      },
    ],
  };
  showStateDialog = false;
  showDocumentDialog = false;
  cols: PortalTableCols[] = [];

  @ViewChild('dt') table?: Table;
  @ViewChild('lazyApplication', { read: ViewContainerRef })
  private lazyApplicationVcRef?: ViewContainerRef;

  constructor(
    private translateService: TranslationService,
    private applicationService: UserApplicationService,
    private ngxLoader: NgxUiLoaderService,
    protected utilService: UtilService
  ) {}

  ngOnInit() {
    // console.log('my var in application-list', this.isFormEnabled)
    this.today = new Date();
    this.yearRange = `1900:${new Date().getFullYear().toString()}`;
    this.cols = [
      {
        field: 'application',
        subField: 'name',
        header: this.translateService.translate('APPLICATION.TRANSACTION_NAME'),
        sortable: true,
        filterable: true,
        type: 'text',
      },
      {
        field: 'applicantName',
        header: this.translateService.translate('APPLICATION.APPLICANT'),
        sortable: true,
        filterable: true,
        type: 'text',
      },
      {
        field: 'applicationNumber',
        header: this.translateService.translate('APPLICATION.FOLDER'),
        sortable: true,
        filterable: true,
        type: 'text',
      },
      {
        field: 'creationDate',
        header: this.translateService.translate(
          'APPLICATION.DATE_OF_SUBMISSION'
        ),
        sortable: true,
        filterable: true,
        type: 'text',
      },
      {
        field: 'lastUpdateDate',
        header: this.translateService.translate(
          'APPLICATION.DATE_OF_CHANGE_STATUS'
        ),
        sortable: true,
        filterable: true,
        type: 'text',
      },
      // { field: 'applicationReceptionDate', header: this.translateService.translate('APPLICATION.DATE_OF_SUBMISSION'), sortable: true, filterable: true, type: 'text' },
      // { field: 'status', header: this.translateService.translate('APPLICATION.STATUS'), sortable: true, filterable: true, type: 'text' },
    ];

    this.loadApplications();
  }

  displayStateDialog() {
    this.showStateDialog = true;
  }

  validated = (item: any) => console.log('Started', item.toString());
  pending = (item: UserApplication) => {this.applicationDetails = item; this.displayStateDialog();};
  rejected = (item: UserApplication) => {this.applicationDetails = item; this.displayStateDialog();};
  completed = (item: UserApplication) => { this.applicationDetails = item; this.displayStateDialog();};

  closeStateDialog = () => {
    this.showStateDialog = false;
  };

  displayAddDocmentDialog(item: UserApplication) {
    this.applicationDetails = item;
    this.showDocumentDialog = true;
  }

  editApplication = (item: UserApplication) => { this.isFormEnabled = true; this.displayAddDocmentDialog(item);};
  viewApplication = (item: UserApplication) => {this.isFormEnabled = false; this.displayAddDocmentDialog(item);};
  archiveApplication = (item: UserApplication) => {
    this.applicationService.archiveApplication(item).subscribe((value: any) => {
      const index = this.userApplications.indexOf(item);
      this.userApplications.splice(index, 1);
      // console.log('response POST',value);
      item.status = 'archived';
      this.userApplications.filter(
        (userApplication: UserApplication) => {
          return !userApplication.archived;
        }
      );
    });
  };

  closeDocumentDialog = () => {
    this.showDocumentDialog = false;
  };

  setStatus = (userApplication: UserApplication, status: string | undefined) => {
    userApplication.btnStatus = {
      type: status,
      callback: status,
    };
  };

  loadApplications(event: LazyLoadEvent = {}) {
    const args = {
      page: event.first! / event.rows!,
      perPage: event.rows ? event.rows : this.rowSizes.SMALL,
      orderBy: event.sortField,
      direction: event.sortOrder,
      searchapplicant: this.searchapplicant,
      searchfolder: this.searchfolder,
      searchtransactionName: this.searchtransactionName,
      searchdateOfChange: this.searchdateOfChange,
      searchdateOfPickUp: this.searchdateOfPickUp,
      searchdateOfSubmission: this.searchdateOfSubmission,
      // searchStatus: this.searchStatus ? this.searchStatus : 0,
    };
    this.applicationService.getApplications(args).subscribe((result) => {
      // console.log('applications loaded',result)
      // preloading init
      this.tableConfig.loading = true;
      this.ngxLoader.start();
      this.userApplications = [];
      this.userApplications = result.content;

      this.userApplications.forEach((userApplication) => {
        this.setStatus(userApplication, userApplication?.status)
      });

      // setting the preloader message
      this.preloaderMessage = this.getPreloaderMessage();

      // stopping the preloading
      this.ngxLoader.stop();
      this.tableConfig.loading = false;

      this.totalRecords = result.totalElements;
    });
  }

  // Return loading message according to situation

  getPreloaderMessage() {
    if (this.userApplications.length === 0) {
      return '...';
    } else if (this.userApplications.length === 1) {
      return (
        this.translateService.translate('PRELOADER.ONE_MOMENT') +
        ', ' +
        this.userApplications.length +
        ' ' +
        this.translateService.translate('PRELOADER.APPLICATION') +
        ' ' +
        this.translateService.translate('PRELOADER.IS_LOADING') +
        '.'
      );
    } else {
      return (
        this.translateService.translate('PRELOADER.ONE_MOMENT') +
        ', ' +
        this.userApplications.length +
        ' ' +
        this.translateService.translate('PRELOADER.APPLICATIONS') +
        ' ' +
        this.translateService.translate('PRELOADER.ARE_LOADING') +
        '.'
      );
    }
  }

  reload() {
    this.loadApplications();
  }

  onStatusCahnge(event: any) {
    this.table?.filter(event.value, 'status', 'in');
  }

  call($event: any[]) {
    const fn = $event[0];
    // @ts-ignore
    this[fn]($event[1]);
  }

  startedit = (item: any) => console.log('Started edit', item.toString());
  onRowSelect = (event: any) => console.log(event.data);
  onRowUnselect = (event: any) => console.log(event.data);
  selectedRow = (event: any) => console.log(event);
}
