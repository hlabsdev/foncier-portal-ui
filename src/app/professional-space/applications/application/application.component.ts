import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {formatDate} from '@angular/common';
import {AlertService} from 'src/app/core/ui-components/alert/alert.service';
import {Type} from 'src/app/professional-space/documents/models/types.model';
import {TypeService} from 'src/app/professional-space/documents/services/types.service';
import {TranslationService} from 'src/app/translation/translation.service';
import {HelperService} from '../services/helper.service';
import {ProcedureService} from "../services/procedure.service";
import {Applicant, MoralApplicant, PhysicalApplicant} from '../models/applicant.model';
import {Application} from '../models/application.model';
import {ApplicantService} from '../services/applicant.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {
  applicant: Applicant = new Applicant();
  application: Application = new Application();
  physicalApplicant?: PhysicalApplicant;
  moralApplicant?: MoralApplicant;
  applicantTypes: Type[] = [];
  applicantType?: Type;
  submitted = false;
  currentSpace="";
  applicantId?: string = "";
  registerForm: FormGroup = new FormGroup({});

  constructor(private helperService: HelperService,
    private router: Router,
    private applicantService: ApplicantService,
    private procedureService: ProcedureService,
    private alert: AlertService,
    private typeService: TypeService,
    private translator: TranslationService,
    private formbuilder: FormBuilder
  ) {
    this.applicantType = new Type;
    this.getApplicationType();
    this.currentSpace =<string> localStorage.getItem('currentSpace');

  }

  ngOnInit(): void {
    this.submitted = false;
    this.registerForm = this.formbuilder.group({
      applicantType: ['', Validators.required],
      applicantId: ['', Validators.required]
    });
    this.helperService.stepDone;
    if (this.helperService.loadCurrentObjectApplicant()) {
      this.applicant = this.helperService.loadCurrentObjectApplicant();
      this.application = this.helperService.loadCurrentObjectApplication();
      this.registerForm = this.formbuilder.group({
        applicantType: [this.applicant.applicantType, Validators.required],
        applicantId: [this.applicant.applicantId, Validators.required]
      });
      this.applicantId = this.applicant.applicantId;


      this.applicantType = this.applicant.applicantType;
    } else {
      this.applicant = {}
    }

  }

  get f() {
    return this.registerForm.value;
  }

  submit() {
    if (this.applicantType!.value == "enterprises") {
      this.applicantService.getMoralApplicant(this.applicantId).subscribe((result) => {
        if (result != null) {
          this.moralApplicant = result;
          this.applicant.applicantId = this.moralApplicant?.fiscalId;
          this.applicant.applicantType = this.applicantType;
          this.applicant.registredName = this.moralApplicant?.registredName;
          this.applicant.enterpriseType = this.moralApplicant?.enterpriseType;
          this.applicant.region = this.moralApplicant?.region;
          this.applicant.streetName = this.moralApplicant?.streetName;
          //variable to send camunda applicantID AND applicantType
          this.procedureService.data.setApplicantId(this.moralApplicant.fiscalId!);
          this.procedureService.data.setApplicantType(this.applicant.applicantType!.value!);

          if (this.applicant.applicantId != null) {
            this.application.applicationDate = formatDate(new Date(), 'dd/MM/yyyy', 'en');
            //variable to send camunda ApplicationDate
            this.procedureService.data.setApplicationDate(this.application.applicationDate),
              this.applicantService.getApplicationNumber().subscribe((result) => {
                this.application.applicationNumber = ""+result;
                //variable Camunde applicationNumber
                this.procedureService.data.setApplicationNumber(this.application.applicationNumber)
              })
          }
        } else {
          this.applicant = {};
          this.application = {};
          this.applicantService.notFoundError(result);
        }
      });
    } else {
      this.applicantService.getPhysicalApplicant(this.applicantId).subscribe((result) => {
        if (result != null) {
          this.physicalApplicant = result;
          this.applicant.applicantId = this.physicalApplicant?.fiscalId;
          this.applicant.applicantType = this.applicantType;
          this.applicant.firstName = this.physicalApplicant?.firstName
          this.applicant.lastName = this.physicalApplicant?.lastName;
          this.applicant.civility = this.physicalApplicant?.civility;
          //variable to send camunda applicantID AND applicantType
          this.procedureService.data.setApplicantId(this.physicalApplicant.fiscalId!);
          this.procedureService.data.setApplicantType(this.applicant.applicantType!.value!);

          if (this.applicant.applicantId != null) {
            this.application.applicationDate = formatDate(new Date(), 'dd/MM/yyyy', 'en');
            //variable to send camunda ApplicationDate
            this.procedureService.data.setApplicationDate(this.application.applicationDate),
              this.applicantService.getApplicationNumber().subscribe((result) => {
                this.application.applicationNumber = ""+result;
                //variable Camunde applicationNumber
                this.procedureService.data.setApplicationNumber(this.application.applicationNumber)
              })
          }
        } else {
          this.applicant = {};
          this.application = {};
          this.applicantService.notFoundError(result);
        }
      });
    }


  }

  getApplicationType() {
    this.typeService.getAllByCode("applicantType").subscribe((result) => {
      this.applicantTypes = result;
      // console.log(this.applicantTypes)
    });
  }

  onKeyUpEventEmail(event: any) {
    this.procedureService.data.setApplicantEmail(event.target.value);
    this.applicant.email = event.target.value
  }


  onKeyUpEventObject(event: any) {
    this.procedureService.data.setApplicationObject(event.target.value);
    this.application.object = event.target.value

  }

  navigateToOfficeComponent = () => {
    if (this.applicant.applicantId !== undefined) {
      this.helperService.stepDone[0] = 1;
      this.helperService.setSteperStateSessionStorage(this.helperService.stepDone);
      this.helperService.setCurrentObjectApplicant(this.applicant);
      this.helperService.setCurrentObjectApplication(this.application);
      this.router.navigate(['/'+this.currentSpace+"/application-office"])
    } else {
      this.alert.showAlert({
        type: 'warn',
        title: this.translator.translate('APPLICATION.NOT_FOUND_ID_TITLE'),
        message: this.translator.translate('APPLICATION.NOT_FOUND_ID'),
      })
    }
  }
}
