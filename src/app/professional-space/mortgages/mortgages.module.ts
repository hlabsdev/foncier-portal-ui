/* eslint-disable @typescript-eslint/no-explicit-any */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MortgageListComponent} from './mortgage-list/mortgage-list.component';
import {CoreModule} from 'src/app/core/core.module';
import {MortgageService} from './services/mortgage.service';
import {TranslationModule} from 'src/app/translation/translation.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {DropdownModule} from 'primeng/dropdown';

@NgModule({
  declarations: [MortgageListComponent],
  imports: [CommonModule,CoreModule,TranslationModule,FormsModule,TableModule,NgbModule,DropdownModule,ReactiveFormsModule],
  exports: [],
  providers:[
    MortgageService,
  ],

})
export class MortgagesModule {}
