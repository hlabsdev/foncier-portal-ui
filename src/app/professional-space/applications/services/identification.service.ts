import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, of, throwError as observableThrowError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {TranslationService} from "../../../translation/translation.service";
import {AlertService} from "../../../core/ui-components/alert/alert.service";
import {environment} from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8'
  })
};


@Injectable({
  providedIn: 'root'
})
export class IdentificationService {
  private requestUrl = `${environment.apiUrl}${environment.apiVersion}property/`;

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private translator: TranslationService,
  ) {
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(error as T);
    };
  }



  getIdByNicad(nicad: string): Observable<any> {
    return this.http
      .get<any>(`${this.requestUrl}parcel?nicad=${nicad}`)
      .pipe(
        map(response => {
          this.handleSuccess();
          return response
        }),
        catchError((e) => this.notFoundError(e))
      );
  }

  getIdByTitleNumber(titleNumber: string): Observable<any> {
    return this.http
      .get(`${this.requestUrl}title?titleNumber=${titleNumber}`)
      .pipe(
        map(response => {
          this.handleSuccess();
          return response
        }
        ),
        catchError((e) => this.notFoundError(e))
      );
  }

  getIdByLotNameLotNumber(lotName: any, lotNumber: any): Observable<any> {
    return this.http
      .get(`${this.requestUrl}title?titleNumber=${lotName}?lotNumber=${lotNumber}`)
      .pipe(
        map(response => {
          this.handleSuccess();
          return response
        }),
        catchError((e) => this.notFoundError(e))
      );
  }


  private handleSuccess() {
    this.alertService.showAlert({
      type: 'success',
      title: 'SUCCESS',
      message: this.translator.translate('SUCCESS.DATA_FETCHED')
    });
  }


  notFoundError(error: any) {
    this.alertService.showAlert({
      type: 'warn',
      title: 'NOT FOUND',
      message: this.translator.translate('ERROR.NOT_FOUND'),
    });
    return observableThrowError(error);
  }
}
