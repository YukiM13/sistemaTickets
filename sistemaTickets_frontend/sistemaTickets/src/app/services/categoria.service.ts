import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environment/enviroment';


@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private apiUrl = environment.apiUrl + '/api/categoria'; // URL base de la API
  private headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'X-Api-Key': environment.apiKey 
});

  constructor(private http: HttpClient) { }

    private handleError(error: HttpErrorResponse) {
    console.error('Error en el servicio Categoria:', error);
    return throwError(() => new Error(error.message || 'Error desconocido'));
    }

    private extractData(res: any) {
    return res || {};
  }

  listarCategorias(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Listar`, { headers: this.headers })
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  

  crearCategoria(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Insertar`, data, { headers: this.headers })
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  actualizarCategoria(data: any): Observable<any> {
    // Backend expects a viewmodel with Id in the body (categoriasViewModel_Update)
    return this.http.put(`${this.apiUrl}/Actualizar`, data, { headers: this.headers })
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  eliminarCategoria(data: any): Observable<any> {

    let body: any;
    if (typeof data === 'number' || typeof data === 'string') {
      body = { Id: String(data) };
    } else if (data && typeof data === 'object') {
      // Prefer existing Id or id property, ensure it's a string
      if (data.Id !== undefined) body = { ...data, Id: String(data.Id) };
      else if (data.id !== undefined) body = { ...data, Id: String(data.id) };
      else body = data;
    } else {
      body = data;
    }
    return this.http.delete(`${this.apiUrl}/Eliminar`, { headers: this.headers, body })
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
}
