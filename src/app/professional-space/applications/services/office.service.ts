import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, throwError as observableThrowError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {Office} from "../models/office.model";
import {TranslationService} from "../../../translation/translation.service";
import {PaginatedResults} from "../../../core/utils/paginated-result.model";
import {AlertService} from "../../../core/ui-components/alert/alert.service";
import Utils from "../../../core/utils/utils";
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfficeService {

  private requestUrl =`${environment.apiUrl}${environment.apiVersion}offices`

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private translator: TranslationService,
  ) {
  }

  //Get all offices to be used in Bureau components
  getOffices(args: any = {}): Observable<PaginatedResults> {
    let params = new HttpParams();
    const result:PaginatedResults= new PaginatedResults();
    if (args.searchName !== '') {
      params = params.set('name', args.searchName);
    }
    if (args.searchCode !== '') {
      params = params.set('code', args.searchCode);
    }
    if (args.searchDate !== '') {
      params = params.set('sigtasId', args.searchDate);
    }
    if (args.searchRegister !== '') {
      params = params.set('registry', args.searchRegister);
    }

    params = Utils.setParamsFromArgs(params, args);


    return this.http.get<any>(`${this.requestUrl}`, {params}).pipe(
      map((response) => {
        result.content = response.map((app: any) => new Office(app));
        return new PaginatedResults(result);
      }),
      catchError(this.notFoundError)
    );
}

  private handleSuccess() {
    console.log('All good');
    this.alertService.showAlert({
      type: 'success',
      title: 'SUCCESS',
      message: this.translator.translate('SUCCESS.DATA_FETCHED')
    });
  }

  private handleError(error: any) {
    this.alertService.showAlert({
      type: 'error',
      title: 'SERVER ERROR',
      message: this.translator.translate('ERROR.SERVER_ERROR'),
    });
    return observableThrowError(error);
  }

  private notFoundError(error: any) {
    this.alertService.showAlert({
      type: 'warn',
      title: 'NOT FOUND',
      message: this.translator.translate('ERROR.NOT_FOUND'),
    });
    return observableThrowError(error);
  }

}
