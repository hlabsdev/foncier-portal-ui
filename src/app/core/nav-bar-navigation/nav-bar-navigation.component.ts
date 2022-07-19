import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-nav-bar-navigation',
  templateUrl: './nav-bar-navigation.component.html',
  styleUrls: ['./nav-bar-navigation.component.scss']
})
export class NavBarNavigationComponent implements OnInit {
  @Output() previous = new EventEmitter();
  @Output() next = new EventEmitter();
  @Output() submit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Input() buttonState!: number;
  isNextDisabled!: boolean;
  isPrevDisabled!: boolean;
  isSubmitDisabled!: boolean;
  isCancelDisabled!: boolean;


  constructor() {}

  ngOnInit(): void {
    this.isNextDisabled = !this.buttonStates[this.buttonState].next;
    this.isPrevDisabled = !this.buttonStates[this.buttonState].prev;
    this.isSubmitDisabled = !this.buttonStates[this.buttonState].submit;
    this.isCancelDisabled = !this.buttonStates[this.buttonState].cancel;
  }

/*
Array state component button
0: ApplicationComponent, 1: OfficeComponent, 2:IdentificationComponent,
 3:DocumentListComponent, 4: DocumentFormComponent
 */
buttonStates = [
     {
      "next": true,
      "prev": false,
      "cancel": false,
      "submit": false,
    },
     {
      "next": true,
      "prev": true,
      "cancel": false,
      "submit": false,
    },
     {
      "next": true,
      "prev": true,
      "cancel": false,
      "submit": false,
    },
     {
      "next": false,
      "prev": true,
      "cancel": false,
      "submit": true,
    },
     {
      "next": false,
      "prev": true,
      "cancel": false,
      "submit": false,
    }
  ]


  onNext() {
    this.next.emit();
  }
  onPrevious() {
    this.previous.emit();
  }
  onSubmit() {
    this.submit.emit();
  }
  onCancel() {
    this.cancel.emit();
  }


}
