import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {OfficeService} from "../services/office.service";
import {LazyLoadEvent, SelectItem} from "primeng/api";
import {Table} from "primeng/table";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {Office} from "../models/office.model";
import {ActivatedRoute, Router} from '@angular/router';
import {UtilService} from "../../../core/utils/util.service";
import {PortalDialogConfig} from "../../../core/ui-components/portal-dialog/portal-dialog-config.model";
import {TranslationService} from "../../../translation/translation.service";
import {ProcedureService} from "../services/procedure.service";
import {PortalTableConfig} from "../../../core/ui-components/portal-table/portal-table-config.model";
import {RowSizes} from "../../../core/app-layout/row-sizes.model";
import {PortalTableCols} from "../../../core/ui-components/portal-table/portal-table-cols.model";
import {HelperService} from '../services/helper.service';
import {AlertService} from 'src/app/core/ui-components/alert/alert.service';

@Component({
  selector: 'app-office',
  templateUrl: './office.component.html',
  styleUrls: ['./office.component.scss']
})
export class OfficeComponent implements OnInit {

  offices: Office[] = [];
  office: Office = new Office();
  totalRecords?: number;
  rowSizes: any = RowSizes;
  locale: any;
  today?: Date;
  yearRange?: string;
  date1?: Date;
  mainTypes?: SelectItem[];
  //Search variables
  searchName = '';
  searchCode = '';
  searchDate = '';
  searchRegister = '';
  currentSpace="";

  preloaderMessage = '...';

  dialogConfig?: PortalDialogConfig;
  startFn = (item: any) => {
    this.router.navigate(['/'+this.currentSpace+"/demande-application"])
  };
  onRowSelect = (event: any) => {
    this.procedureService.data.setOfficeId(event.data.id);
  };
  onRowUnselect = (event: any) => {
  }
  selectedRow = (event: any) => {
  }

  tableConfig: PortalTableConfig = {
    title: this.translateService.translate('HEADER.OFFICES'),
    titleTooltip: this.translateService.translate('HEADER.OFFICE_LIST'),
    loading: false,
    selectByRadio: true,
    rowSelect: false,
    key: 'office',
    displayAction: false,
    paginationRow: 5,
    enablePagination: true,
    enableSearchBar: true,
    enableExport: true,
    enableReload: true,
    extraFilter: false,
    dataKey: 'id',
    searchBarField: ['code', 'name', 'registre', 'dateCreation'],
    actions: []
  }

  cols: PortalTableCols[] = [];

  @ViewChild('dt') table?: Table;


  constructor(
    private translateService: TranslationService,
    private officeService: OfficeService,
    private ngxLoader: NgxUiLoaderService,
    protected utilService: UtilService,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private procedureService: ProcedureService,
    private helperService: HelperService,
    private alert: AlertService,
  ) {
    this.currentSpace =<string> localStorage.getItem('currentSpace');
  }

  ngOnInit() {
    this.helperService.getSteperStateSessionStorage();

    this.today = new Date();
    this.yearRange = `1900:${new Date().getFullYear().toString()}`;
    this.cols = [
      {
        field: 'name',
        header: this.translateService.translate('OFFICE.NAME'),
        sortable: true,
        filterable: false,
        type: 'text',
        width: "50px"
      },
      {
        field: 'code',
        header: this.translateService.translate('OFFICE.CODE'),
        sortable: true,
        filterable: false,
        type: 'text',
        width: "50px"
      },
      {
        field: 'registry',
        header: this.translateService.translate('OFFICE.REGISTER'),
        sortable: true,
        filterable: false,
        type: 'text'
      }
    ];
    this.loadOffices();
  }

  loadOffices(event: LazyLoadEvent = {}) {
    const args = {
      page: event.first! / event.rows!,
      perPage: event.rows ? event.rows : this.rowSizes.SMALL,
      orderBy: event.sortField,
      direction: event.sortOrder,
      searchName: this.searchName,
      searchCode: this.searchCode,
      searchDate: this.searchDate,
      searchRegister: this.searchRegister,
    };
    this.officeService.getOffices(args).subscribe((result) => {
      this.tableConfig.loading = true;
      this.ngxLoader.start();
      this.offices = [];
      this.offices = result.content;
      this.preloaderMessage = this.getPreloaderMessage();
      this.ngxLoader.stop();
      this.tableConfig.loading = false;

      this.totalRecords = result.totalElements;
    });
  }

  getPreloaderMessage() {
    if (this.offices.length === 0) {
      return '...';
    } else if (this.offices.length === 1) {
      return (
        this.translateService.translate('PRELOADER.ONE_MOMENT') +
        ', ' +
        this.offices.length +
        ' ' +
        this.translateService.translate('PRELOADER.OFFICE') +
        ' ' +
        this.translateService.translate('PRELOADER.IS_LOADING') +
        '.'
      );
    } else {
      return (
        this.translateService.translate('PRELOADER.ONE_MOMENT') +
        ', ' +
        this.offices.length +
        ' ' +
        this.translateService.translate('PRELOADER.OFFICES') +
        ' ' +
        this.translateService.translate('PRELOADER.ARE_LOADING') +
        '.'
      );
    }
  }

  reload() {
    this.loadOffices();
  }


  call($event: any[]) {
    const fn = $event[0];
    // @ts-ignore
    this[fn]($event[1]);
  }


  navigateToIdentificationComponent = () => {
    if (this.procedureService.data.getOfficeId() !== undefined) {
      this.helperService.stepDone[1] = 1;
      this.helperService.setSteperStateSessionStorage(this.helperService.stepDone);
      this.router.navigate(['/'+this.currentSpace+"/application-identification"]);
    }
    else {
      this.alert.showAlert({
        type: 'warn',
        title: this.translateService.translate('OFFICE.NOT_FOUND_ID_TITLE'),
        message: this.translateService.translate('OFFICE.NOT_FOUND_ID'),
      })
    }

  }


  navigateToApplicationComponent = () => {
    this.helperService.stepDone[0] = 0;
    this.helperService.setSteperStateSessionStorage(this.helperService.stepDone);
    this.router.navigate(['/'+this.currentSpace+"/application"]);
  }

}
