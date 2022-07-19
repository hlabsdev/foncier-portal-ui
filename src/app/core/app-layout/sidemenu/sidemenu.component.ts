import {Component, Input, OnInit} from '@angular/core';
import {HelperService} from 'src/app/professional-space/applications/services/helper.service';
import {ProcedureService} from "../../../professional-space/applications/services/procedure.service";
import {TranslationService} from "../../../translation/translation.service";

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {

  @Input() applicationComponentState = false;
  @Input() officeComponentState = false;
  @Input() identificationComponentState = false;
  @Input() documentComponentState = false;
  @Input() applicationStepDone = false;
  @Input() applicationState = false;

  isApplicationState = true;
  isApplicationComponentLoaded = true;
  isOfficeComponentLoaded = false;
  isIdentificationComponentLoaded = false;
  isDocumentComponentLoaded = false;
  isApplicationStepDone = false;
  tabs: any;
  processName = '';
  sumStep = 0;

  constructor(private procedureService: ProcedureService, private helperService: HelperService, private translationService: TranslationService) {
  }

  ngOnInit(): void {
    this.processName = this.procedureService.data.getTaskName();
    this.isIdentificationComponentLoaded = this.identificationComponentState;
    this.isApplicationComponentLoaded = this.applicationComponentState;
    this.isOfficeComponentLoaded = this.officeComponentState;
    this.isDocumentComponentLoaded = this.documentComponentState;
    this.isApplicationState = this.applicationState;
    this.isApplicationStepDone = this.applicationStepDone;

    //for validate application step
    this.sumStep =this.helperService.stepDone.reduce(function(accumulateur, valeurCourante, index, array){
      return accumulateur + valeurCourante;
    });


    this.tabs = [
      {
        "id": 1,
        "name": this.translationService.translate('HEADER.APPLICATION') + " N°",
        "status": this.isApplicationStepDone,
        "stepApplicationDone": this.sumStep,
        "steps": [
          {
            "title": this.translationService.translate('HEADER.APPLICATION'),
            "componentState": this.isApplicationComponentLoaded,
            "stepDone": this.helperService.stepDone[0]
          },
          {
            "title": this.translationService.translate('OFFICE.RESPONSIBLE_OFFICE'),
            "componentState": this.isOfficeComponentLoaded,
            "stepDone": this.helperService.stepDone[1]
          },
          {
            "title": this.translationService.translate('IDENTIFICATION.PLATE_IDENTIFICATION'),
            "componentState": this.isIdentificationComponentLoaded,
            "stepDone": this.helperService.stepDone[2]
          },
        ],
      },
      {
        "id": 2,
        "name": this.translationService.translate('HEADER.DOCUMENT'),
        "status": !this.isApplicationStepDone,
        "tab": [
        ],
      }
    ]

  }


  loadApplicationComponent = () => {
    this.isApplicationComponentLoaded = true;
    this.isOfficeComponentLoaded = false;
    this.isIdentificationComponentLoaded = false;
  }
  loadOfficeComponent = () => {
    this.isApplicationComponentLoaded = false;
    this.isOfficeComponentLoaded = true;
    this.isIdentificationComponentLoaded = false;
  }
  loadIdentificationComponent = () => {
    this.isApplicationComponentLoaded = false;
    this.isOfficeComponentLoaded = false;
    this.isIdentificationComponentLoaded = true;
  }


}
