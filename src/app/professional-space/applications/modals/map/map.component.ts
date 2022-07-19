import {Component, ContentChild, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import {PortalDialogConfig} from 'src/app/core/ui-components/portal-dialog/portal-dialog-config.model';
import {Identification} from '../../models/identification.model';
import {IdentificationService} from '../../services/identification.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {
  @Output() next = new EventEmitter();
  @Output() previous = new EventEmitter();
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() identificationEvent = new EventEmitter();
  @Input() config = new PortalDialogConfig();
  disable?: boolean;
  @ContentChild("content")
  contentRef?: TemplateRef<any>;

  @ContentChild("tab")
  tabRef?: TemplateRef<any>;

  activeTab = 0;
  identifications: Identification[] = [];
  identification?: any;
  showIdentification?: boolean;
  constructor(private identificationService: IdentificationService) { }
  ngOnInit(): void {
    this.showIdentification = false
    this.identification === undefined ? this.identification = {} : this.identification
  }
  submit() {

  }


  goSave = () => {
    // this.dialogConfig.canSave ? this.save.emit(this.identification) : false;
    this.config.display = false;
    this.identificationEvent.emit(this.identification);
  }


  goCancel = () => {
    this.config.display = false;
    this.cancel.emit();
  };
  goClose = () => {
    this.config.display = false;
    this.identification = {};
    this.close.emit();
  };

}
