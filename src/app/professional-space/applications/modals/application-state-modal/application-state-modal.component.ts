import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PortalDialogConfig} from 'src/app/core/ui-components/portal-dialog/portal-dialog-config.model';
import {UserApplication} from "../../models/user-application.model";
import {TranslationService} from "../../../../translation/translation.service";

@Component({
  selector: 'app-application-state-modal',
  templateUrl: './application-state-modal.component.html',
  styleUrls: ['./application-state-modal.component.scss']
})
export class ApplicationStateModalComponent implements OnInit {

  @Output() close = new EventEmitter();
  @Output() identificationEvent = new EventEmitter();
  @Input() applicationDetails!: UserApplication;

  dialogConfig!: PortalDialogConfig;

  constructor(
    private translateService: TranslationService,
  ) {}

  ngOnInit(): void {
    this.dialogConfig = {
      showAction: true,
      display: true,
      title: `${this.translateService.translate('APPLICATION.FOLDER')} No ${this.applicationDetails?.applicationNumber}`,
      canSave: false,
      hideSave: true,
      tabs: [],
    };
  }

}
