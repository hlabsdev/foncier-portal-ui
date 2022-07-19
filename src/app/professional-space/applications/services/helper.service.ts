import {Injectable} from '@angular/core';
import {Applicant} from '../models/applicant.model';
import {Application} from '../models/application.model';
import {ProcedureService} from './procedure.service';
import {Identification} from "../models/identification.model";
import {Procedure} from '../models/procedure.model';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  private currentObjIdentification: any;

  constructor(private procedureService: ProcedureService) {
  }

  stepDone = [-1, -1, -1];
  objetCamunda: any;
  currentObjApplicant: any;
  currentObjApplication: any;
  currentObjectProcess:any;

  /**
   * Current Procedure
   */
  currentObjProcess:Procedure = new Procedure();
  /**
   * Current User Application
   */
  currentObjectApplicant: Applicant = new Applicant();
  currentObjectApplication: Application = new Application();

  /**
   * Current User Identification
   */
  currentObjectIdentification: Identification = new Identification();


  setSteperStateSessionStorage = (data: any) => {
    localStorage.setItem('steperState', data);
    this.setVariableCamunda(JSON.parse(JSON.stringify(this.procedureService.data)));
  }

  getSteperStateSessionStorage = () => {
    if (this.stepDone.every(element => element == -1)) {
      localStorage.getItem('steperState')?.split(",", this.stepDone.length).map(Number).map((el, index) => {
        this.stepDone[index] = el;
      })
    } else {
      this.stepDone
    }
  }
  removeSteperState = () => {
    localStorage.removeItem('steperState');
  }

  loadVariableCamunda() {
    this.objetCamunda = localStorage.getItem('variablesCamunda');
    return JSON.parse(this.objetCamunda);
  }

  setVariableCamunda(data: string) {
    return localStorage.setItem('variablesCamunda', JSON.stringify(data));
  }

  removeVariableCamunda() {
    return localStorage.removeItem('variablesCamunda');
  }

  setCurrentObjectApplicant = (data: any) => {
    sessionStorage.setItem('currentObjectApplicant', JSON.stringify(data));
  }
  removeCurrentObjectApplicant = () => {
    sessionStorage.removeItem('currentObjectApplicant');
  }
  loadCurrentObjectApplicant() {
    this.currentObjApplicant = sessionStorage.getItem('currentObjectApplicant');
    return JSON.parse(this.currentObjApplicant);
  }

  setCurrentObjectApplication = (data: any) => {
    sessionStorage.setItem('currentObjectApplication', JSON.stringify(data));
  }
  removeCurrentObjectApplication = () => {
    sessionStorage.removeItem('currentObjectApplication');
  }
  loadCurrentObjectApplication() {
    this.currentObjApplication = sessionStorage.getItem('currentObjectApplication');
    return JSON.parse(this.currentObjApplication);
  }

  setProcess = (data: any) => {
    sessionStorage.setItem('currentObjectProcess', JSON.stringify(data));
  }

  removeProcess = () => {
    sessionStorage.removeItem('currentObjectProcess');
  }
  /*loadProcess() {
    this.currentObjProcess = sessionStorage.getItem('currentObjectProcess');
    return JSON.parse(this.currentObjProcess);
  }*/
  setCurrentObjectIdentification = (data: any) => {
    sessionStorage.setItem('currentObjectIdentification', JSON.stringify(data));
  }
  removeCurrentObjectIdentification = () => {
    sessionStorage.removeItem('currentObjectIdentification');
  }

  loadCurrentObjectIdentification() {
    this.currentObjIdentification = sessionStorage.getItem('currentObjectIdentification');
    return JSON.parse(this.currentObjIdentification);
  }


}
