import { Component } from '@angular/core';
import {FieldConfig} from "../field.model";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  field?: FieldConfig;
  group?: FormGroup;
  click?: (event?: any) => void;

  constructor() {}

  onClick(event: any){
    this.click!(event);
  }

}
