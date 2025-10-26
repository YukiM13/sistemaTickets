import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environment/enviroment';


@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private apiUrl = environment.apiUrl + '/api/rol';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'X-Api-Key': environment.apiKey
  });

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en el servicio Role:', error);
    return throwError(() => new Error(error.message || 'Error desconocido'));
  }

  private extractData(res: any) {
    return res || {};
  }

  listarRoles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Listar`, { headers: this.headers })
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

}
