import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError as observableThrowError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {TranslationService} from '../../../translation/translation.service';
import {PaginatedResults} from '../../../core/utils/paginated-result.model';
import {AlertService} from '../../../core/ui-components/alert/alert.service';
import {environment} from 'src/environments/environment';
import Utils from '../../../core/utils/utils';
import {UserApplication} from '../models/user-application.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class UserApplicationService {
  private requestUrl = `${environment.apiUrl}${environment.apiVersion}userapplication`;
  private currentUser: any = localStorage.getItem('currentUser');
  private userName = JSON.parse(this.currentUser).username;

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private translator: TranslationService
  ) {}


  getApplicationsStatus(args: any = {}): Observable<PaginatedResults> {
    let params = new HttpParams();
    const result: PaginatedResults = new PaginatedResults();
    params = Utils.setParamsFromArgs(params, args);

    const currentUser: any = localStorage.getItem('currentUser');
    const userName = JSON.parse(currentUser).username;

    // return this.http.get<any>(`${this.requestUrl}/userapplication`, {params}).pipe(
    return this.http.get<any>(`${this.requestUrl}/username/${userName}`, {
        params,
      }).pipe(
        map((response) => {
          result.content = response.map((app: any) => new UserApplication(app));
          this.handleSuccess('SUCCESS.DATA_FETCHED');
          return new PaginatedResults(result);
        }),
        catchError((e) => this.notFoundError(e, 'ERROR.NOT_FOUND'))
      );
  }

  getApplications(args: any = {}): Observable<PaginatedResults> {
    let params = new HttpParams();
    const result: PaginatedResults = new PaginatedResults();
    const fomattFiltreLang = 'fr-CA';
    const fomattJsonFiltre = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };

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

    return this.http
      // .get<any>(`${this.requestUrl}/username/${this.userName}/not_archived`, {
      .get<any>(`assets/applications.json`, {
        params,
      })
      .pipe(
        map((response) => {
          console.log('API response', response);
          result.content = response.map((app: any) => new UserApplication(app));
          this.handleSuccess('SUCCESS.DATA_FETCHED');
          return new PaginatedResults(result);
        }),
        catchError((e) => this.notFoundError(e, 'ERROR.NOT_FOUND'))
      );
  }

  archiveApplication(item: UserApplication) {
    return this.http.post(`${this.requestUrl}/archive`, item).pipe(
      map((response) => {
        this.handleSuccess('SUCCESS.APPLICATION_ARCHIVED');
        return response;
      }),
      catchError((e) => this.handleError(e, 'ERROR.ARCHIVING'))
    );
  }

  getArchivedUserApplications(args: any = {}): Observable<PaginatedResults>{
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
    return this.http
      .get<any>(`${this.requestUrl}/username/${this.userName}/archived`, {
        params,
      })
      .pipe(
        map((response) => {
          console.log('API response', response);
          result.content = response.map((app: any) => new UserApplication(app));
          this.handleSuccess('SUCCESS.DATA_FETCHED');
          return new PaginatedResults(result);
        }),
        catchError((e) => this.notFoundError(e, 'ERROR.NOT_FOUND'))
      );
  }

  private translateMessage = (message: string) => this.translator.translate(message)

  private handleSuccess(message: string) {
    // console.log('All good');
    this.alertService.showAlert({
      type: 'success',
      title: 'SUCCESS',
      message: this.translateMessage(message)
    });
  }

  private handleError(error: any, message: string) {
    this.alertService.showAlert({
      type: 'error',
      title: 'SERVER ERROR',
      message: this.translateMessage(message)
    });
    return observableThrowError(error);
  }

  private notFoundError(error: any, message: string) {
    this.alertService.showAlert({
      type: 'warn',
      title: 'NOT FOUND',
      message: this.translateMessage(message),
    });
    return observableThrowError(error);
  }
}
