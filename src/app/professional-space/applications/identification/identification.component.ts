import {Component, OnInit} from '@angular/core';
import {PortalDialogConfig} from 'src/app/core/ui-components/portal-dialog/portal-dialog-config.model';
import {Identification} from '../models/identification.model';
import {IdentificationService} from '../services/identification.service';
import {Router} from "@angular/router";
import {ProcedureService} from "../services/procedure.service";
import {TranslationService} from 'src/app/translation/translation.service';
import {HelperService} from '../services/helper.service';
import {AlertService} from "../../../core/ui-components/alert/alert.service";
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-identification',
  templateUrl: './identification.component.html',
  styleUrls: ['./identification.component.scss']
})
export class IdentificationComponent implements OnInit {
  dialogConfig?: PortalDialogConfig;
  identifications: Identification[] = [];
  identification?: any;
  nicad = "";
  titleNumber = "";
  nLot = "";
  allotment = "";
  optionsRadio = "";
  currentSpace="";
  isIdentificationStepPassed = false;
  isActiveFormNicad = false
  isActiveFormLtPlot = false
  isActiveFormNLot = false
  constructor(private identificationService: IdentificationService,
    private router: Router,
    private procedureService: ProcedureService,
    private translateService: TranslationService,
    private helperService: HelperService,
    private alert: AlertService
  ) {
    this.currentSpace =<string> localStorage.getItem('currentSpace');
  }

  ngOnInit(): void {
    const camundaObject: any = this.helperService.loadVariableCamunda();
    if (camundaObject.nicad !== undefined && camundaObject.nicad !== '') {
      this.identification = this.helperService.loadCurrentObjectIdentification();
      this.nicad = camundaObject.nicad;
      this.updateIsActiveForm(true, false, false)
      this.isIdentificationStepPassed = true
    } else
      if (camundaObject.titleNumber !== undefined && camundaObject.titleNumber !== '') {
        this.identification = this.helperService.loadCurrentObjectIdentification();

        this.titleNumber = camundaObject.titleNumber;
        this.updateIsActiveForm(false, true, false)
        this.isIdentificationStepPassed = true
      } else
        if (camundaObject.nLot !== undefined && camundaObject.allotment !== undefined
          && camundaObject.nLot !== '' && camundaObject.allotment !== '') {
          this.identification = this.helperService.loadCurrentObjectIdentification();
          // console.log(this.identification)
          this.nLot = camundaObject.nLot
          this.allotment = camundaObject.allotment;
          this.updateIsActiveForm(false, true, true)
          this.isIdentificationStepPassed = true
        } else
          if (this.identification === undefined) {
            this.identification = {}
          }
    // this.identification === undefined ? this.identification = {} :this.identification= this.procedureService.currentObjectIdentification

    this.helperService.getSteperStateSessionStorage();
  }

  // check the option to search
  check(event: any) {
    this.optionsRadio = event.target.value;
    this.updateIsActiveForm(false, false, false);
  }

  //Format date to dd/MM/yyyy
  formatDateValue(value:string){
    return formatDate(value, 'dd/MM/yyyy', 'en');
  }

  onSubmit() {
    // console.log(this.procedureService.data);
    this.isIdentificationStepPassed = false;
    if (this.optionsRadio === "nicad") {
      this.identificationService.getIdByNicad(this.nicad).subscribe(
        (result) => {
          if (result != null) {
            if (result.nicad) this.isIdentificationStepPassed = true
            this.identification = result;
            this.identification.creationDate=this.formatDateValue(this.identification.creationDate);
            this.identification.issueDate=this.formatDateValue(this.identification.issueDate);
            this.helperService.currentObjectIdentification = this.identification;
            this.updateDataValues(this.identification.nicad, '', '', '');
            this.updateIsActiveForm(true, false, false);
          } else {
            this.identificationService.notFoundError(result);

          }

        }
      )
    } else if (this.optionsRadio === "titleNumber") {
      this.identificationService.getIdByTitleNumber(this.titleNumber).subscribe(
        (result) => {
          if (result.titleNumber) this.isIdentificationStepPassed = true;
          this.identification = result;
          this.identification.creationDate=this.formatDateValue(this.identification.creationDate);
          this.identification.issueDate=this.formatDateValue(this.identification.issueDate);
          this.helperService.currentObjectIdentification = this.identification;
          this.updateDataValues(this.identification.nicad, this.identification.titleNumber, '', '');
          this.updateIsActiveForm(false, true, false);
        }
      )
    } else if (this.optionsRadio === "nLot") {
      this.identificationService.getIdByLotNameLotNumber(this.nLot, this.allotment).subscribe(
        (result) => {
          if (result.lotName && result.lotNumber) this.isIdentificationStepPassed = true
          this.identification = result;
          this.identification.creationDate=this.formatDateValue(this.identification.creationDate);
          this.identification.issueDate=this.formatDateValue(this.identification.issueDate);
          this.helperService.currentObjectIdentification = this.identification;
          this.updateDataValues('', '', this.identification.nLot, this.identification.allotment);
          this.updateIsActiveForm(false, false, true);

        }
      )
    }
  }
  /**
   * update the values to send to camunda according to the choice
   * @param  {string} nicadValue
   * @param  {string} ltPlotValue
   * @param  {string} nlotValue
   * @param  {string} allotementValue
   */
  updateDataValues(nicadValue: string, ltPlotValue: string, nlotValue: string, allotementValue: string) {
    this.procedureService.data.setNicad(nicadValue);
    this.procedureService.data.setLtPlot(ltPlotValue);
    this.procedureService.data.setNlot(nlotValue);
    this.procedureService.data.setAllotment(allotementValue);
  }
  /**
   *
   * @param  {boolean} isActiveFormNicad
   * @param  {boolean} isActiveFormLtPlot
   * @param  {boolean} isActiveFormNLot
   */
  updateIsActiveForm(isActiveFormNicad: boolean, isActiveFormLtPlot: boolean, isActiveFormNLot: boolean) {
    this.isActiveFormNicad = isActiveFormNicad;
    this.isActiveFormLtPlot = isActiveFormLtPlot;
    this.isActiveFormNLot = isActiveFormNLot;
  }


  redisplayInfos(data: Identification) {
    this.identification = data
  }


  openDialog = () => {
    this.dialogConfig = {
      showAction: true,
      display: true,
      title: this.translateService.translate('IDENTIFICATION.MAP'),
      canSave: false,
      tabs: [
        { name: 'Item 1', required: true },
        { name: 'Item 2', required: true, warning: true, disabled: false },
        { name: 'Item 3', required: false, warning: true, disabled: false },
        { name: 'Item 4', required: false, disabled: true },
      ]
    };
  }

  next(activeTab: number) {
    this.dialogConfig!.tabs![activeTab].warning! = false; // unlock tab
    this.dialogConfig!.canSave = true; //enable save
  }

  previous = (activeTab: number) => console.log(activeTab);

  save = () => {
    this.dialogConfig!.display = false;
  };

  navigateToDocumentComponent = () => {
    if (this.isIdentificationStepPassed) {
      this.helperService.stepDone[2] = 1;
      this.helperService.setCurrentObjectIdentification(this.helperService.currentObjectIdentification)
      this.helperService.setSteperStateSessionStorage(this.helperService.stepDone)

      this.router.navigate(['/'+this.currentSpace+"/document-list"])
    } else {
      this.alert.showAlert({
        type: 'warn',
        title: this.translateService.translate('IDENTIFICATION.FAIL_TITLE'),
        message: this.translateService.translate('IDENTIFICATION.ERROR_IDENTIFY_PLATE'),
      })
    }
  }

  navigateToOfficeComponent = () => {
    this.helperService.stepDone[1] = 0;
    this.helperService.setCurrentObjectIdentification(this.helperService.currentObjectIdentification)
    this.helperService.setSteperStateSessionStorage(this.helperService.stepDone);

    this.router.navigate(['/'+this.currentSpace+"/application-office"])
  }



}
