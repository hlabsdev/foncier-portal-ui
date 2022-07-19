import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AlertService} from "../../../core/ui-components/alert/alert.service";
import {TranslationService} from "../../../translation/translation.service";
import {Observable, throwError as observableThrowError} from "rxjs";
import {PaginatedResults} from "../../../core/utils/paginated-result.model";
import {catchError, map} from "rxjs/operators";
import {Document} from "../models/document.model";
import {environment} from 'src/environments/environment';
import Utils from "../../../core/utils/utils";

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private requestUrl = `${environment.apiUrl}${environment.apiVersion}document`;

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

  addDocument(formData: FormData) {
    return this.http.post<Document>(`${this.requestUrl}`, formData).pipe(
      map((response) => {
        this.handleSuccess();
        return response
      }),
      catchError((e) => this.handleError(e)),
    );
  }

  deleteDocument(document: Document) {
    return this.http
      .delete(`${this.requestUrl}`,{body:document}).pipe(
        map((response: any) => {
          this.handleSuccess();
          return response;
        }), catchError(this.handleError));
  }

  updateDocument(document: Document) {
    return this.http
      .put(`${this.requestUrl}`,document).pipe(
        map((response: any) => {
          this.handleSuccess();
          return response;
        }), catchError(this.handleError));
  }

  getAll(args: any = {}): Observable<PaginatedResults> {
    let params = new HttpParams();
    const result: PaginatedResults = new PaginatedResults();

    if (args.searchPrincipalType !== '') {
      params = params.set('principalType', args.searchPrincipalType);
    }
    if (args.searchSourceType !== '') {
      params = params.set('sourceType', args.searchSourceType);
    }
    if (args.searchSubmissionDate !== '') {
      params = params.set('submission_date', args.searchSubmissionDate);
    }
    if (args.searchFileName !== '') {
      params = params.set('fileName', args.searchFileName);
    }
    params = Utils.setParamsFromArgs(params, args);
    return this.http.get<any>(`${this.requestUrl}`, { params }).pipe(
      map((response) => {
        result.content = response.map((app: any) => new Document(app));
        return new PaginatedResults(result);
      }),
      catchError(this.notFoundError)
    );
  }
  getAllByProcessInstanceId(args: any = {}, processInstanceId:string): Observable<PaginatedResults> {
    let params = new HttpParams();
    const result: PaginatedResults = new PaginatedResults();

    if (args.searchPrincipalType !== '') {
      params = params.set('principalType', args.searchPrincipalType);
    }
    if (args.searchSourceType !== '') {
      params = params.set('sourceType', args.searchSourceType);
    }
    if (args.searchSubmissionDate !== '') {
      params = params.set('submission_date', args.searchSubmissionDate);
    }
    if (args.searchFileName !== '') {
      params = params.set('fileName', args.searchFileName);
    }
    params = Utils.setParamsFromArgs(params, args);
    return this.http.get<any>(`${this.requestUrl}/${processInstanceId}`, { params }).pipe(
      map((response) => {
        result.content = response.map((app: any) => new Document(app));
        return new PaginatedResults(result);
      }),
      catchError(this.notFoundError)
    );
  }

  getFile(document: Document): Observable<Blob> {
    const src= document.filePath+"/"+document.fileName?.value+"."+document.extension;
      return this.http
        .get(`${this.requestUrl}/${src}`, { responseType: 'blob' })
        .pipe(
          map((response) => {
            const file: any = Utils.getFileMimeType(document.fileName?.value+"."+document.extension);
            return new Blob([response], { type: file.type });
          }),
          catchError(this.notFoundError)
        );
    }

  handleError(error: any) {
    this.alertService.showAlert({
      type: 'error',
      title: 'SERVER ERROR',
      message: this.translator.translate('ERROR.REGISTRE'),
    });
    return observableThrowError(error);
  }
  private handleSuccess() {
    this.alertService.showAlert({
      type: 'success',
      title: 'SUCCESS',
      message: this.translator.translate('SUCCESS.SUCCESS')
    });
  }

  private notFoundError(error: any) {
    this.alertService.showAlert({
      type: 'error',
      title: 'SERVER ERROR',
      message: this.translator.translate('ERROR.SERVER_ERROR'),
    });
    return observableThrowError(error);
  }
}
