import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environment/enviroment';


@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = environment.apiUrl + '/api/ticket';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'X-Api-Key': environment.apiKey
  });

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en TicketService:', error);
    return throwError(() => new Error(error.message || 'Error desconocido'));
  }

  private extractData(res: any) {
    return res || {};
  }

  listarTickets(status?: number): Observable<any> {
    let params = undefined as any;
    if (status !== undefined && status !== null) {
      params = { status: String(status) };
    }
    return this.http.get(`${this.apiUrl}/Listar`, { headers: this.headers, params })
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  

  crearTicket(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Insertar`, data, { headers: this.headers })
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  actualizarTicket(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/Actualizar/${id}`, data, { headers: this.headers })
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  eliminarTicket(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Eliminar/${id}`, { headers: this.headers })
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  tomarTicket(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/Tomar`, data, { headers: this.headers })
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
}
