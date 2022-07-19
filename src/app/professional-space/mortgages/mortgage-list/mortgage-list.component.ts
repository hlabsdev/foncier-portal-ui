import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { result } from 'lodash';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import { Subscription, timer } from 'rxjs';
import {PortalDialogConfig} from 'src/app/core/ui-components/portal-dialog/portal-dialog-config.model';
import {PortalTableCols} from 'src/app/core/ui-components/portal-table/portal-table-cols.model';
import {PortalTableConfig} from 'src/app/core/ui-components/portal-table/portal-table-config.model';
import { PortalTableService } from 'src/app/core/ui-components/portal-table/portal-table.service';
import {TranslationService} from 'src/app/translation/translation.service';
import { TypeService } from '../../documents/services/types.service';
import {Mortgage} from '../models/mortgage.model';
import {MortgageService} from '../services/mortgage.service';
@Component({
  selector: 'app-mortgage-list',
  templateUrl: './mortgage-list.component.html',
  styleUrls: ['./mortgage-list.component.scss']
})

export class MortgageListComponent implements OnInit {
  tableConfig: PortalTableConfig = {
    title: this.translator.translate('MORTGAGE.TITLELISTE'),
    titleTooltip: this.translator.translate('MORTGAGE.TITLE_LISTE_TOOLTIP'),
    loading: false,
    addBtn: true,
    selectByCheckBox: false,
    selectByRadio: false,
    rowSelect: false,
    key: 'mortgage',
    displayAction: true,
    paginationRow: 10,
    enablePagination: true,
    enableSearchBar: true,
    enableExport: true,
    enableReload: true,
    //initialShowDatas: true,
    searchBarField: ['propriete', 'droitConserne', 'titulaireDroit','typeRestriction','typeHypotheque','titulaire','ordre'],
    actions: [
      {
        type: 'view',
        mini: true,
        callback: 'viewFn',
      }
    ]
  }
  items: any[] = [];
  selectedMortgage : Mortgage= new Mortgage();
  cols: PortalTableCols[] = [];
  totalRecords?: number;
  modalDisplay:boolean=false;
  dialogConfig?: PortalDialogConfig;
  multifilterSelect:boolean=false;
  typeRestrictions: any[] = [];
  submitted = false;
  countDown: Subscription | undefined;
  counter = 3;
  tick = 1000;
  mortgageFormGroup!:FormGroup;
  mortgageTitleNumberFormGroup!:FormGroup;
  principalRestrictionTypes:any[]=[];
  principalRestrictionType: any=null;
  restrictionTypes: any[] = [];
  restrictionType:any= null;
  filterObject:any;
  constructor(private translator:TranslationService,private mortgageService:MortgageService,private ngxLoader: NgxUiLoaderService,private table: PortalTableService,private formbuilder:FormBuilder,private typeService:TypeService) {
    this.cols = [
      {field: 'titleNumber', header: this.translator.translate('MORTGAGE.LAND_TITLE'), sortable: true, filterable: true, type: 'text'},
      {field: 'rightType', header: this.translator.translate('MORTGAGE.RETAINED_RIGHT'), sortable: true, filterable: true, type: 'text'},
      {field: 'rightHolder', header: this.translator.translate('MORTGAGE.RIGHT_HOLDER'), sortable: true, filterable: true, type: 'text'},
      {field: 'principalRestrictionType', header: this.translator.translate('MORTGAGE.RESTRICTION_TYPE'), sortable: true, filterable: true, type: 'text'},
      {field: 'restrictionType', header: this.translator.translate('MORTGAGE.TYPE'), sortable: true, filterable: true, type: 'text'}
    ];
   }

  ngOnInit(): void {
    this.mortgageTitleNumberFormGroup=this.formbuilder.group({
      titleNumber:[''],
    });

    this.mortgageFormGroup=this.formbuilder.group({
      titleId:[''],
      registryCode:[''],
      rightType:[''],
      rightHolder:[''],
      principalRestrictionType:[''],
      restrictionType:['']
    });

    this.getMortgageTypes();
    this.submitted = false;
    
  }
  excel(){
    this.table.toExcel(this.items);
  }
  reload(){
    // this.reloadTable.emit();
    // this.tableConfig.loading=true;
    
    //Loading display countdown
    this.countDown = timer(0, this.tick).subscribe(
      () => {
        this.counter>0?--this.counter:null;
        console.log(this.counter);
        if (this.counter==0){
          // this.tableConfig.loading=false;
          this.countDown?.unsubscribe();
        }
      }
    );
    //stop ticker

    //Reinitialize counter for later use again
    this.counter = 3;
  }
  getMortgageTypes() {
    this.typeService.getAllByCode("hypotheque").subscribe((result) => {
      this.principalRestrictionTypes = result;
    });

    this.typeService.getAllByCode("restriction").subscribe((result) => {
      this.restrictionTypes = result;
      
    });
  }

  filterTitleNumber(){
    this.mortgageService.getMortgageByTitleNumber(this.mortgageTitleNumberFormGroup.value.titleNumber).subscribe((result)=>{
        this.items=result;
        this.items.forEach(el=>{
          el.restrictionType=this.translator.translate("MORTGAGE."+el.restrictionType);
          el.rightType=this.translator.translate("MORTGAGE."+el.rightType);
          el.principalRightType=this.translator.translate("MORTGAGE."+el.principalRightType);
          el.principalRestrictionType=this.translator.translate("HEADER."+el.principalRestrictionType)
        })
    })
    
  }
  filterMultiParam(){
     this.filterObject ={
      titleId:this.mortgageFormGroup.value.titleId,
      registryCode:this.mortgageFormGroup.value.registryCode,
      rightType:this.mortgageFormGroup.value.rightType,
      rightHolder:this.mortgageFormGroup.value.rightHolder,
      mortgageHolder: "",
      principalRestrictionType:this.mortgageFormGroup.value.principalRestrictionType?.value==undefined?'':this.mortgageFormGroup.value.principalRestrictionType?.value,
      restrictionType:this.mortgageFormGroup.value.restrictionType?.value==undefined?'':this.mortgageFormGroup.value.restrictionType?.value
    };
    this.mortgageService.getMortgageByMultiFilter(this.filterObject).subscribe((result)=>{
      this.items=result.body;
      this.items.forEach(el=>{
        el.restrictionType=this.translator.translate("MORTGAGE."+el.restrictionType);
        el.rightType=this.translator.translate("MORTGAGE."+el.rightType);
        el.principalRightType=this.translator.translate("MORTGAGE."+el.principalRightType);
        el.principalRestrictionType=this.translator.translate("HEADER."+el.principalRestrictionType)
      })
    })
  }
  


  multifilterCheck(){
    return this.multifilterSelect=!this.multifilterSelect;

  }
 
  /* updateDatas(bool:boolean){
    if(bool)
      this.items=[];
    else
    this.getItems();
  } */
  onRowSelect = (event: any) => console.log(event.data);
  onRowUnselect = (event: any) => console.log(event.data);
  selectedRow = (event: any) => console.log(event);

  // reload = () => this.getItems;

  call(event: any[]) {
    const fn = event[0];
    // this[fn]($event[1]);
    console.log(event[1])
    if(event[0] == "viewFn")
    {
      // this.openDialog();
      this.selectedMortgage=event[1];
    }
  }

  startFn = (item: any) => console.log(item);
  editFn = (item: any) => console.log(item);
  deleteFn = (item: any) => console.log(item);

  //Dialog
  openDialog = (item:Mortgage) => {
    item.restrictionType=this.translator.translate(item.restrictionType)
    this.selectedMortgage=item;

    this.dialogConfig = {
      showAction: true,
      display: true,
      title: this.translator.translate('COMMON.LABELS.VISUALIZATION'),
      canSave: false,
      isDisable: true,
      tabs: [
        {name: this.translator.translate('COMMON.LABELS.GENERAL'), required: true},
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
