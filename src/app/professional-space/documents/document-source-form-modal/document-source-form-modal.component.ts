import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PortalDialogConfig} from 'src/app/core/ui-components/portal-dialog/portal-dialog-config.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TranslationService} from "../../../translation/translation.service";
import {TypeService} from "../services/types.service";
import {Type} from "../models/types.model";

@Component({
  selector: 'app-document-source-form-modal',
  templateUrl: './document-source-form-modal.component.html',
  styleUrls: ['./document-source-form-modal.component.scss']
})
export class DocumentSourceFormModalComponent implements OnInit {
  @Output() sourceDocumentEvent = new EventEmitter();
  @Output() close = new EventEmitter();
  @Input() documentSourceDetails: any;

  dialogConfig: PortalDialogConfig = {
    showAction: true,
    display: true,
    title: this.translateService.translate('DOCUMENT.ADD_SOURCE_DOCUMENT'),
    canSave: true,
    tabs: [],
  };
  registerForm: FormGroup = new FormGroup({});
  roles: Type[] = [];
  role: any;
  submitted = false;
  id = 0;

  constructor(
    private typeService: TypeService,
    private translateService: TranslationService,
  ) {
  }

  ngOnInit(): void {
    this.role = this.documentSourceDetails.role;
    this.getRoles();
    this.submitted = false;
    this.registerForm = new FormGroup({
      individualName: new FormControl('', [Validators.required]),
      postName: new FormControl(''),
      organizationName: new FormControl(''),
      role: new FormControl('', [Validators.required]),
      address: new FormControl(''),
      contactInstruction: new FormControl(''),
      serviceHour: new FormControl(''),
      onlineRessource: new FormControl(''),
      phone: new FormControl('')
    });
  }

  getRoles() {
    this.typeService.getAllByCode("role").subscribe((result) => {
      this.roles = result;
    });
  }

  get f() { return this.registerForm.controls; }

  submit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    } else {
      this.save();
    }
  }

  save() {
    this.documentSourceDetails.role = this.role;
    this.sourceDocumentEvent.emit(this.documentSourceDetails);
    this.cancel();
  }

  cancel = () => {
    this.submitted = false;
    this.role = {};
    this.documentSourceDetails = {};
    this.registerForm.reset();
    this.close.emit();
  };
}
