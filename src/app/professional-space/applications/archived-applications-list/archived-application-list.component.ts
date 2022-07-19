import {Component, OnInit} from '@angular/core';
import {PortalTableCols} from 'src/app/core/ui-components/portal-table/portal-table-cols.model';
import {PortalTableConfig} from 'src/app/core/ui-components/portal-table/portal-table-config.model';
import {TranslationService} from 'src/app/translation/translation.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {UserApplication} from '../models/user-application.model';
import {UserApplicationService} from '../services/user-application.service';

@Component({
  selector: 'app-archived-applications-list',
  templateUrl: './archived-application-list.component.html',
  styleUrls: ['./archived-application-list.component.scss'],
})
export class ArchivedApplicationListComponent implements OnInit {
  preloaderMessage = '...';
  userApplications: UserApplication[] = [];
  tableConfig: PortalTableConfig = {
    title: this.translateService.translate('HEADER.APPLICATION_ARCHIVED'),
    titleTooltip: this.translateService.translate('HEADER.APPLICATION_LIST_ARCHIVED'),
    loading: false,
    key: 'applications',
    // key: 'applicationsArchived',
    paginationRow: 10,
    enablePagination: true,
    enableSearchBar: true,
    enableExport: true,
    enableReload: true,
    dataKey: 'id',
    searchBarField: [
      'application',
      'applicantName',
      'applicationNumber',
      'creationDate',
      'lastUpdateDate',
      'applicationReceptionDate',
    ]
  };

  cols: PortalTableCols[] = [];
  totalRecords?: number;

  constructor(
    private userApplicationService: UserApplicationService,
    private ngxLoader: NgxUiLoaderService,
    private translateService: TranslationService,

  ) {}

  ngOnInit(): void {
    this.loadArchivedUserApplications();
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
      }
    ];

  }

  loadArchivedUserApplications = () => {
    this.userApplicationService
      .getArchivedUserApplications()
      .subscribe((result) => {
        this.tableConfig.loading = true;
        this.ngxLoader.start();
        this.userApplications = [];
        this.userApplications = result.content;

        // setting the preloader message
        this.preloaderMessage = this.getPreloaderMessage();

        // stopping the preloading
        this.ngxLoader.stop();
        this.tableConfig.loading = false;

        this.totalRecords = result.totalElements;
      });
  };

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
    this.loadArchivedUserApplications()
  }
}
