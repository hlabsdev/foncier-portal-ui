/* eslint-disable @typescript-eslint/no-explicit-any */

import { APP_INITIALIZER, LOCALE_ID, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from './translation.service';
import { TranslationServiceConfig } from './translation-config.service';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule, TranslateModule.forChild()],
  exports: [TranslateModule]
})
export class TranslationModule {
  public static forRoot(config: any): ModuleWithProviders<TranslationModule> {
    return {
      ngModule: TranslationModule,
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: initLocalizationService,
          deps: [TranslationService],
          multi: true
        },
        TranslationService,
        { provide: LOCALE_ID, useValue: config.locale_id }, // using the initial value
        { provide: TranslationServiceConfig, useValue: config }
      ]
    };
  }
}

/**
  * Initialize the localization services.
  * @param {TranslationService} service
  * @returns {() => Observable<void>}
  */
export function initLocalizationService(service: TranslationService): () => Observable<void> {
  return () => service.initService();
}
