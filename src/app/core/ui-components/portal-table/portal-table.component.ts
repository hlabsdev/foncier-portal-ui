import {Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {PortalTableConfig} from "./portal-table-config.model";
import {PortalTableCols} from "./portal-table-cols.model";
import {RowSizes} from "../../app-layout/row-sizes.model";
import {PortalTableService} from "./portal-table.service";
import {PortalTableAction} from "./portal-table-action.model";
import {Subscription, timer} from "rxjs";
import Utils from "../../utils/utils";

@Component({
  selector: 'portal-table',
  templateUrl: './portal-table.component.html',
  styleUrls: ['./portal-table.component.scss']
})
export class PortalTableComponent implements OnInit {
  //Outputs (Event handlerd)
  @Output() reloadTable = new EventEmitter();
  @Output() selectRow = new EventEmitter();
  @Output() unselectRow = new EventEmitter();
  @Output() selectedRow = new EventEmitter();
  @Output() actions = new EventEmitter();
  @Output() states = new EventEmitter();
  @Output() addCallBack = new EventEmitter();

  //Template ref
  @ContentChild("headerTemplate", { static: false })
  headerTemplateRef?: TemplateRef<any>;
  @ContentChild("states")
  statesRef?: TemplateRef<any>;
  @ContentChild("actions")
  actionsRef?: TemplateRef<any>;
  @ContentChild("body")
  bodyRef?: TemplateRef<any>;
  @ContentChild("rowexpansion")
  rowexpansionRef?: TemplateRef<any>;

  //Inputs
  _tableConfig= new PortalTableConfig();
  @Input() isAddBtnEnabled = true;
  @Input()
  set tableConfig(tableConf: PortalTableConfig) {
    this._tableConfig = tableConf;
    if(tableConf.initialShowDatas==true)
    {
      this.datas=this.allDatas;
    }
  }
  // style for prevent text from overlap table td width
  style = 'max-width: 150px !important; min-height: 300px !important; overflow: auto; '
  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  get tableConfig() { return this._tableConfig; }

  @Input() datas: any[]=[];
  @Input() allDatas: any[]=[];
  @Input() cols?: PortalTableCols[];

  //Simple variables
  rowSizes: any = RowSizes;
  selected: any[] = [];
  exportColumns?: any[];
  expandedRows = {};
  isExpanded = false;

  //Loadind display delay
  countDown: Subscription | undefined;
  counter = 3;
  tick = 1000;

  constructor(private table: PortalTableService) { }

  ngOnInit(): void {
    this.exportColumns = this.cols?.map(col => ({title: col.header, dataKey: col.field}));
  }

  pdf(){
    this.table.toPdf(this.exportColumns, this.datas);
  }

  excel(){
    this.table.toExcel(this.datas);
  }

  showValues(data: any){
    console.log("Valeur", data);
  }

  onSelect(event: any) {
    this.selectRow.emit(event);
  }

  getSelectedRow() {
    this.selectedRow.emit(this.selected);
  }

  onUnselect(event: any) {
    this.unselectRow.emit(event);
  }

  reload(){
    this.reloadTable.emit();
    this.tableConfig.loading=true;

    //Loading display countdown
    this.countDown = timer(0, this.tick).subscribe(
      () => {
        this.counter>0?--this.counter:null;
        console.log(this.counter);
        if (this.counter==0){
          this.tableConfig.loading=false;
          this.countDown?.unsubscribe();
        }
      }
    );
    //stop ticker

    //Reinitialize counter for later use again
    this.counter = 3;
  }


  actionCallback(action: PortalTableAction, item: any){
    this.actions.emit([action.callback, item]);
  }

  stateCallback(state: PortalTableAction, item: any){
    this.states.emit([state.callback, item]);
  }

  add(){
    this.addCallBack.emit(true);
  }

  onRowExpand() {
    if(Object.keys(this.expandedRows).length === this.datas?.length){
      this.isExpanded = true;
    }
  }
  onRowCollapse() {
    if(Object.keys(this.expandedRows).length === 0){
      this.isExpanded = false;
    }
  }
  searchEventMethode(keyWord:any)
  {
    if(this.tableConfig.initialShowDatas)
    {
      console.log(this.tableConfig.initialShowDatas);
      if(keyWord)
        this.datas=this.allDatas;
      else
        this.datas=[]
    }

  }
  closeAll() {
    this.expandedRows={};
    this.isExpanded = false;
  }

  renderSubfield(data: any, field: any, subField: any) {
    let result = "";
    if (data !== null && field !== null) {
      if (data[field] !== null) {
        result = data[field][subField];

      }
    }
    return result;
  }

  setDate(s: string) {
    const date = Utils.setDate(s);
    s = <string>date?.toString().split(" (")[0].slice(3);
    return (s == null || s == "") ? "" : s.split(" GMT")[0];
    // return (s == null || s == "") ? "" : localDate.transform(s);
  }
}
