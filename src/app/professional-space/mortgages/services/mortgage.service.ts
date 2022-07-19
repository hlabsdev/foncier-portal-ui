import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError as observableThrowError } from 'rxjs';
import { User } from 'src/app/auth/models/user.model';
import { AlertService } from 'src/app/core/ui-components/alert/alert.service';
import { PaginatedResults } from 'src/app/core/utils/paginated-result.model';
import Utils from 'src/app/core/utils/utils';
import { TranslationService } from 'src/app/translation/translation.service';
import { environment } from 'src/environments/environment';
import { Mortgage } from '../models/mortgage.model';

/**
 * Here we manage all the authentication process, be it keycloak or other services.
 */
@Injectable({
  providedIn: 'root'
})
export class MortgageService {
  private requestUrl = `${environment.apiUrl}${environment.apiVersion}mortgages`;

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': '*/*',

  });
  options = {
    observe: 'response' as 'response',
    headers: this.headers,
  };
  endpoint: string;
  myMortgages: User[] = [];
  constructor(private http: HttpClient, private translator: TranslationService, private alertService: AlertService) {
    this.endpoint = '';
  }
  //Get Mortgage by Title Number
  getMortgageByTitleNumber(titleNumber: string): Observable<any> {
    return this.http
      .get<any[]>(`${this.requestUrl}?titleNumber=${titleNumber}`)
      .pipe(
        map(response => response.map(st => new Mortgage(st))),
        catchError(this.handleError)
      );
  }
   // Filter Multi
   getMortgageByMultiFilter(data:any){
    const url = `${this.requestUrl}`;
    return this.http.post<any>(`${url}`, data, this.options).pipe(
      map((response) => {
        return response
      }),
      catchError((e)=>this.handleError(e)),
    );
  }
  getMortgageList(args: any = {}): Observable<PaginatedResults> {
    let params = new HttpParams();
    const result: PaginatedResults = new PaginatedResults();
    if (args.searchName !== '') {
      params = params.set('name', args.searchName);
    }
    if (args.searchRole !== '') {
      params = params.set('role', args.searchRole);
    }
    if (args.searchDoamin !== '') {
      params = params.set('domain', args.searchDoamin);
    }
    if (args.searchStatus !== '') {
      params = params.set('status', args.searchStatus);
    }
    params = Utils.setParamsFromArgs(params, args);
    return this.http.get<any>('assets/mortgage-data.json', { params }).pipe(
      map((response) => {
        result.content = response.data.map((mg: any) => new Mortgage(mg));
        this.handleSuccess();
        return new PaginatedResults(result);
      }),
      catchError((e) => this.notFoundError(e))
    )
  }
  private handleSuccess() {
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
