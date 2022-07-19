import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Procedure } from "../models/procedure.model";
import { RowSizes } from "../../../core/app-layout/row-sizes.model";
import { LazyLoadEvent, SelectItem } from "primeng/api";
import { PortalDialogConfig } from "../../../core/ui-components/portal-dialog/portal-dialog-config.model";
import { PortalTableConfig } from "../../../core/ui-components/portal-table/portal-table-config.model";
import { PortalTableCols } from "../../../core/ui-components/portal-table/portal-table-cols.model";
import { Table } from "primeng/table";
import { TranslationService } from "../../../translation/translation.service";
import { ProcedureService } from "../services/procedure.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { UtilService } from "../../../core/utils/util.service";
import { Router } from '@angular/router';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-procedure-list',
  templateUrl: './procedure-list.component.html',
  styleUrls: ['./procedure-list.component.scss']
})
export class ProcedureListComponent implements OnInit {
  procedures: Procedure[] = [];
  procedure: Procedure = new Procedure();
  totalRecords?: number;
  rowSizes: any = RowSizes;
  locale: any;
  today?: Date;
  yearRange?: string;
  date1?: Date;
  mainTypes?: SelectItem[];
  currentSpace = "";
  searchName = '';
  searchRole = '';
  searchDomain = '';
  searchStatus = 0;
  // preloader message
  preloaderMessage = '...';
  currentUser: any;

  dialogConfig?: PortalDialogConfig;
  startFn = (item: any) => {
    this.helperService.setProcess(item);
    const variable = {
      variables: {
        idProcessus: {
          value: item.processId,
          type: "String"
        },
        domain: {
          value: item.domain,
          type: "String"
        },
        code: {
          value: item.code,
          type: "String"
        },
        isRequisitionRequired: {
          value: item.requisitionRequired,
          type: "Boolean"
        },
      },
      "withVariablesInReturn": true
    }

    this.procedureService.startProcess(variable).subscribe((res => {
      if (res.status === 200) {
        this.getTask(res.body.id);
        this.procedureService.data.setProcessInstanceId(res.body.id);
      }
    }),
      (error) => {
        console.log(error);
      })
  };

  getTask(idProcess: any) {
    this.procedureService.getAllTask(idProcess).subscribe((res) => {
      if (res.status === 200) {
        this.procedureService.data.setTaskName(res.body[0].name);
        this.procedureService.data.setTaskId(res.body[0].id)
        this.router.navigate(['/' + this.currentSpace + "/application"])
      }
    },
      (error) => {
        console.log(error);
      })
  }

  onRowSelect = (event: any) => console.log(event.data);
  onRowUnselect = (event: any) => console.log(event.data);
  selectedRow = (event: any) => console.log(event);

  tableConfig: PortalTableConfig = {
    title: this.translateService.translate('HEADER.PROCEDURES'),
    titleTooltip: this.translateService.translate('HEADER.PROCEDURE_LIST'),
    loading: false,
    selectByCheckBox: false,
    rowSelect: false,
    key: 'procedures',
    displayAction: true,
    paginationRow: 10,
    enablePagination: true,
    enableSearchBar: true,
    enableExport: true,
    enableReload: true,
    extraFilter: false,
    dataKey: 'id',
    searchBarField: ['name', 'function', 'domain'],
    actions: [{
      type: 'start',
      callback: 'startFn',
    }]
  }

  cols: PortalTableCols[] = [];

  @ViewChild('dt') table?: Table;


  constructor(private helperService: HelperService,
    private translateService: TranslationService,
    private procedureService: ProcedureService,
    private ngxLoader: NgxUiLoaderService,
    protected utilService: UtilService,
    private router: Router,
  ) {
    this.currentSpace = <string>localStorage.getItem('currentSpace');
  }

  ngOnInit() {
    this.currentUser = localStorage.getItem('currentUser');
    this.today = new Date();
    this.yearRange = `1900:${new Date().getFullYear().toString()}`;
    this.cols = [
      { field: 'name', header: this.translateService.translate('PROCEDURE.NAME'), sortable: true, filterable: true, type: 'text', width: "40%" },
      { field: 'function', header: this.translateService.translate('PROCEDURE.ROLE'), sortable: true, filterable: true, type: 'text' },
      { field: 'domain', header: this.translateService.translate('PROCEDURE.DOMAIN'), sortable: true, filterable: true, type: 'text' },
    ];
    this.loadProcedures();
  }

  loadProcedures(event: LazyLoadEvent = {}) {
    const args = {
      page: event.first! / event.rows!,
      perPage: event.rows ? event.rows : this.rowSizes.SMALL,
      orderBy: event.sortField,
      direction: event.sortOrder,
      searchName: this.searchName,
      searchRole: this.searchRole,
      searchDoamin: this.searchDomain,
      searchStatus: this.searchStatus ? this.searchStatus : 0,
    };
    this.procedureService.getProcedures(args).subscribe((result) => {
      // preloading init
      this.tableConfig.loading = true;
      this.ngxLoader.start();
      this.procedures = [];
      this.procedures = result.content;
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
    if (this.procedures.length === 0) {
      return '...';
    } else if (this.procedures.length === 1) {
      return (
        this.translateService.translate('PRELOADER.ONE_MOMENT') +
        ', ' +
        this.procedures.length +
        ' ' +
        this.translateService.translate('PRELOADER.PROCEDURE') +
        ' ' +
        this.translateService.translate('PRELOADER.IS_LOADING') +
        '.'
      );
    } else {
      return (
        this.translateService.translate('PRELOADER.ONE_MOMENT') +
        ', ' +
        this.procedures.length +
        ' ' +
        this.translateService.translate('PRELOADER.PROCEDURES') +
        ' ' +
        this.translateService.translate('PRELOADER.ARE_LOADING') +
        '.'
      );
    }
  }

  reload() {
    this.loadProcedures();
  }

  /*  onStatusCahnge(event: any) {
      this.table?.filter(event.value, 'status', 'in')
    }*/

  call($event: any[]) {
    const fn = $event[0];
    // @ts-ignore
    this[fn]($event[1]);
  }

}
