import {Observable, throwError as observableThrowError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Procedure} from '../models/procedure.model';
import {PaginatedResults} from '../../../core/utils/paginated-result.model';
import Utils from '../../../core/utils/utils';
import {AlertService} from "../../../core/ui-components/alert/alert.service";
import {TranslationService} from "../../../translation/translation.service";
import {environment} from 'src/environments/environment';
import {UserApplication} from '../models/user-application.model';
import {DataAppCamunda} from '../models/data-app-camunda.model';

@Injectable({
  providedIn: 'root'
})
export class ProcedureService {

  private API_URL = `${environment.apiUrl}${environment.apiVersion}`;
  private resquetUserapplication =`${environment.apiUrl}${environment.apiVersion}userapplication`
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': '*/*',
  });
  options = {
    observe: 'response' as 'response',
    headers: this.headers,
  };

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private translator: TranslationService,
  ) {
  }

  // init Objet for submit task
  data:DataAppCamunda = new DataAppCamunda();

  //Get all procedure to be used in procedure components
  getProcedures(args: any = {}): Observable<PaginatedResults> {
    let params = new HttpParams();
    const result:PaginatedResults = new PaginatedResults();

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

    return this.http.get<any>(`${this.API_URL}/application`, {params}).pipe(
      map((response) => {
        result.content = response.map((app: any)=>new Procedure(app));
        // this.handleSuccess();
        return new PaginatedResults(result);
      }),
      catchError((e)=>this.notFoundError(e))
    );
  }

  //Run process in Camunda
  startProcess(data:any ): Observable<any> {
    const url = `${environment.apiUrlCamunda}process-definition/key/${data.variables.idProcessus.value}/start`;
    return this.http.post<any>(`${url}`, data, this.options).pipe(
      map((response) => {
        //this.handleSuccess();
        return response
      }),
      catchError((e)=>this.handleError(e)),
    );
  }

  //Get all task  by process idProcess camunda
  getAllTask(idProcess:any ): Observable<any> {
    const url = `${environment.apiUrlCamunda}task?processInstanceId=${idProcess}`
    return this.http.get<any>(`${url}`, this.options).pipe(
      map((response) => {
        return response
      }),
      catchError((e)=>this.handleError(e)),
    );
  }

  //
  completeTaskCamunda(data:any){
    const url = `${environment.apiUrlCamunda}task/${data?.variables?.taskId?.value}/complete`;
    return this.http.post<any>(`${url}`, data, this.options).pipe(
      map((response) => {
        this.handleSuccess();
        return response
      }),
      catchError((e)=>this.handleError(e)),
    );
  }

  // Creation of User-Application when the process starts
  createUserApplication(data:any){
    return this.http.post<any>(`${this.resquetUserapplication}`, data, this.options).pipe(
      map((response) => {
        return response
      }),
      //catchError((e)=>this.handleError(e)),
    );
  }
  private handleSuccess() {
    this.alertService.showAlert({
      type: 'success',
      title: 'SUCCESS',
      message: this.translator.translate('SUCCESS.DATA_FETCHED')
    });
  }

  updateUserApplication(data:any){
    return this.http.put<any>(`${this.resquetUserapplication}`, data, this.options).pipe(
      map((response) => {
        return response
      }),
      catchError((e)=>this.handleError(e)),
    );
  }
  getUserApplication(uuid:any): Observable<any> {
    return this.http
      .get<any>(`${this.resquetUserapplication}/uuid/${uuid}`)
      .pipe(
        map(response =>
           new UserApplication(response)),
        catchError(this.handleError)
      );
  }

  handleError(error: any) {
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
