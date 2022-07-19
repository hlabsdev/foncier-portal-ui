import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, throwError as observableThrowError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {Type} from "../models/types.model";
import {environment} from 'src/environments/environment';


//Class TypeService
@Injectable({
  providedIn: 'root'
})
export class TypeService {
  private requestUrl = `${environment.apiUrl}${environment.apiVersion}types`;

  constructor(protected http: HttpClient) {
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return observableThrowError(error);
  }

  getAll(args: any = {}): Observable<Type[]> {
    return this.http
      .get<any[]>(`${this.requestUrl}`)
      .pipe(
        map(response => response.map(st => new Type(st))),
        catchError(this.handleError)
      );
  }

  getAllByCode(code:string): Observable<Type[]> {
    return this.http
      .get<any[]>(`${this.requestUrl}/${code}`)
      .pipe(
        map(response =>  response.map(st => new Type(st))),
        catchError(this.handleError)
      );
  }

}

