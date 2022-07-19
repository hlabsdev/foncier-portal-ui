import {Injectable, Optional, SkipSelf} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {TranslationServiceConfig} from './translation-config.service';

/**
 * Class representing the translation services.
 */
@Injectable()
export class TranslationService {
  private _localeId = 'fr-SN'; // default

  /**
   * @constructor
   * @param {TranslationService} singleton - the localization services
   * @param {TranslationServiceConfig} config - the localization dialogConfig
   * @param {TranslateService} translateService - the translate services
   */
  constructor(
    @Optional() @SkipSelf() private singleton: TranslationService,
    private config: TranslationServiceConfig,
    private translateService: TranslateService
  ) {
    if (this.singleton) {
      throw new Error(
        'TranslationService is already provided by the root module'
      );
    }
    this._localeId = this.config.locale_id;
  }

  /**
   * Initialize the services.
   * @returns {Observable<void>}
   */
  public initService(): Observable<void> {
    // language code same as file name.
    this._localeId = localStorage.getItem('language') || 'fr-SN';
    return this.useLanguage(this._localeId);
  }

  /**
   * change the selected language
   * @returns {Observable<void>}
   */
  public useLanguage(lang: string): Observable<void> {
    this.translateService.setDefaultLang(lang);
    try {
      localStorage.setItem('language', lang);
      return this.translateService.use(lang);
    } catch {
      throw new Error('TranslationService.init failed');
    }
  }

  /**
   * Gets the instant translated value of a key (or an array of keys).
   * @param key
   * @param interpolateParams
   * @returns {string|any}
   */
  public translate(key: string | string[], interpolateParams?: any): string {
    return this.translateService.instant(key, interpolateParams) as string;
  }
}
