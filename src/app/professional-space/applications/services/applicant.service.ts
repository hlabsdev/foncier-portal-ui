import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError as observableThrowError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {Applicant, MoralApplicant, PhysicalApplicant} from '../models/applicant.model';
import {TranslationService} from "../../../translation/translation.service";
import {PaginatedResults} from "../../../core/utils/paginated-result.model";
import {AlertService} from "../../../core/ui-components/alert/alert.service";
import {environment} from 'src/environments/environment';
import {HelperService} from './helper.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8'
  })
};



@Injectable({
  providedIn: 'root'
})
export class ApplicantService {
  private requestUrl = `${environment.apiUrl}${environment.apiVersion}`;

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private translator: TranslationService,
    private helperService:HelperService
  ) {
  }


  getPhysicalApplicant(id: any): Observable<PhysicalApplicant> {
    return this.http
      .get<MoralApplicant>(`${this.requestUrl}individuals/${id}`)
      .pipe(
        map(response =>{
          if (response != null) {
            return new PhysicalApplicant(response);
          }
          this.helperService.removeCurrentObjectApplicant();
          this.helperService.removeCurrentObjectApplication();
          this.handleSuccess();
          return response;
        }),
        catchError((e) => this.handleError(e))
      );
  }

  getMoralApplicant(id: any): Observable<MoralApplicant> {
    return this.http
      .get<MoralApplicant>(`${this.requestUrl}enterprises/${id}`)
      .pipe(
        map(response => {
          if (response != null) {
            return new MoralApplicant(response);
          }
          this.helperService.removeCurrentObjectApplicant();
          this.helperService.removeCurrentObjectApplication();
          this.handleSuccess();
          return response;
        }),
        catchError((e) => this.handleError(e))
      );
  }

  getApplicationNumber(): Observable<number> {
    return this.http
      .get<number>(`${this.requestUrl}userapplication/next-application-number`)
      .pipe(
        map(response => Number(response)),
        catchError(this.handleError)
      );
  }

  //Get all applicants to be used in Applicant components
  getApplicants(): Observable<PaginatedResults> {
    const result: PaginatedResults = new PaginatedResults();
    return this.http.get<any>('assets/applicant-data.json').pipe(
      map((response) => {
        result.content = response.data.map((app: any) => new Applicant(app));
        // this.handleSuccess();
        return new PaginatedResults(result);
      }),
      catchError((e) => this.notFoundError(e))
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
    console.error('An error occurred', error);
    return observableThrowError(error);
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
