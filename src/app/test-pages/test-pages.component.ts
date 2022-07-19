import {Component, OnInit} from '@angular/core';
import {PortalTableConfig} from "../core/ui-components/portal-table/portal-table-config.model";
import {PortalTableCols} from "../core/ui-components/portal-table/portal-table-cols.model";
import {PortalDialogConfig} from "../core/ui-components/portal-dialog/portal-dialog-config.model";

@Component({
  selector: 'app-test-pages',
  templateUrl: './test-pages.component.html',
  styleUrls: ['./test-pages.component.scss']
})
export class TestPagesComponent implements OnInit {

  tableConfig: PortalTableConfig = {
    title: 'Table example',
    titleTooltip: 'My tooltips',
    loading: false,
    addBtn: true,
    selectByCheckBox: false,
    selectByRadio: false,
    rowSelect: false,
    key: 'movies',
    displayAction: true,
    paginationRow: 10,
    enablePagination: true,
    enableSearchBar: true,
    enableExport: true,
    enableReload: true,
    extraFilter: false,
    searchBarField: ['title', 'type', 'writer', 'country', 'year'],
    actions: [
      {
        type: 'start',
        callback: 'startFn',
      },
      {
        type: 'download',
        mini: true,
        callback: 'downloadFn',
      },
      {
        type: 'view',
        mini: true,
        callback: 'viewFn',
      },
      {
        type: 'edit',
        mini: true,
        callback: 'editFn',
      },
      {
        type: 'delete',
        mini: true,
        callback: 'deleteFn',
      },
    ]
  }

  items: any[] = [];
  cols: PortalTableCols[] = [];


  dialogConfig?: PortalDialogConfig;

  constructor() {
  }

  ngOnInit(): void {
    this.getItems();

    this.cols = [
      {field: 'title', header: 'Title', sortable: true, filterable: true, type: 'text'},
      {field: 'country', header: 'Country', sortable: true, filterable: true, type: 'text'},
      {field: 'type', header: 'Type', sortable: true, filterable: true, type: 'text'},
      {field: 'language', header: 'Language', sortable: true, filterable: true, type: 'text'},
      {field: 'year', header: 'Year', sortable: true, filterable: true, type: 'text'}
    ];
  }

  getItems() {
    this.items = [
      {
        title: 'Avengers',
        //writer: 'English',
        country: 'France, Canada, United States',
        type: 'Series',
        language: 'English',
        year: '2021'
      },
      {
        title: 'Hulk',
        //writer: 'English',
        country: 'United States',
        type: 'Films',
        language: 'English',
        year: '2020'
      },
      {
        title: 'Hulk',
        //writer: 'English',
        country: 'United States',
        type: 'Films',
        language: 'English',
        year: '2020'
      },
      {
        title: 'Hulk',
        //writer: 'English',
        country: 'United States',
        type: 'Films',
        language: 'English',
        year: '2020'
      },
      {
        title: 'Hulk',
        //writer: 'English',
        country: 'United States',
        type: 'Films',
        language: 'English',
        year: '2020'
      },
      {
        title: 'Hulk',
        //writer: 'English',
        country: 'United States',
        type: 'Films',
        language: 'English',
        year: '2020'
      },
      {
        title: 'Hulk',
        //writer: 'English',
        country: 'United States',
        type: 'Films',
        language: 'English',
        year: '2020'
      },
      {
        title: 'Hulk',
        //writer: 'English',
        country: 'United States',
        type: 'Films',
        language: 'English',
        year: '2020'
      },
      {
        title: 'Hulk',
        //writer: 'English',
        country: 'United States',
        type: 'Films',
        language: 'English',
        year: '2020'
      },
      {
        title: 'Hulk',
        //writer: 'English',
        country: 'United States',
        type: 'Films',
        language: 'English',
        year: '2020'
      },
      {
        title: 'Hulk',
        //writer: 'English',
        country: 'United States',
        type: 'Films',
        language: 'English',
        year: '2020'
      },
      {
        title: 'Hulk',
        //writer: 'English',
        country: 'United States',
        type: 'Films',
        language: 'English',
        year: '2020'
      },
      {
        title: 'Hulk',
        //writer: 'English',
        country: 'United States',
        type: 'Films',
        language: 'English',
        year: '2020'
      },
      {
        title: 'Hulk',
        //writer: 'English',
        country: 'United States',
        type: 'Films',
        language: 'English',
        year: '2020'
      },
      {
        title: 'Hulk',
        //writer: 'English',
        country: 'United States',
        type: 'Films',
        language: 'English',
        year: '2020'
      },
    ]
  }


  onRowSelect = (event: any) => console.log(event.data);
  onRowUnselect = (event: any) => console.log(event.data);
  selectedRow = (event: any) => console.log(event);

  reload = () => this.getItems;

  call(event: any[]) {
    const fn = event[0];
    // this[fn]($event[1]);
  }

  startFn = (item: any) => console.log(item);
  editFn = (item: any) => console.log(item);
  deleteFn = (item: any) => console.log(item);

  //Dialog
  openDialog = () => {
    this.dialogConfig = {
      showAction: true,
      display: true,
      title: 'Modal example',
      canSave: false,
      tabs: [
        {name: 'Item 1', required: true},
        {name: 'Item 2', required: true, warning: true, disabled: false},
        {name: 'Item 3', required: false, warning: true, disabled: false},
        {name: 'Item 4', required: false, disabled: true},
      ]
    };
  };

  next(activeTab: number) {
    this.dialogConfig!.tabs![activeTab].warning! = false; // unlock tab
    this.dialogConfig!.canSave = true; //enable save
  }

  previous = (activeTab: number) => console.log(activeTab);

  save = () => {
    this.dialogConfig!.display = false;
  };

  cancel = () => console.log('cancel');


}
