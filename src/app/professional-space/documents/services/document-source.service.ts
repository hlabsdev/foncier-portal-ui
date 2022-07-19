import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AlertService} from "../../../core/ui-components/alert/alert.service";
import {TranslationService} from "../../../translation/translation.service";
import {Observable, throwError as observableThrowError} from "rxjs";
import {PaginatedResults} from "../../../core/utils/paginated-result.model";
import {catchError, map} from "rxjs/operators";
import {DocumentSource} from "../models/document-source.model";
import {environment} from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DocumentSourceService {
  private requestUrl = `${environment.apiUrl}${environment.apiVersion}source_document`;

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

  //appel api
  addDocumentSource(data:DocumentSource){
    return this.http.post<DocumentSource>(`${this.requestUrl}`, data, this.options).pipe(
      map((response) => {
        return response.body
      }),
      catchError((e)=>this.handleError(e)),
    );
  }
  //Get all sources document to be used in Bureau components
  getSourcesDocument(documentsSource:DocumentSource[]): Observable<PaginatedResults> {
    const result: PaginatedResults = new PaginatedResults();
    return this.http.get<any>('').pipe(
      map((response) => {
        result.content = documentsSource;
        return new PaginatedResults(result);
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
