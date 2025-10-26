import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../environment/enviroment';

const TOKEN_KEY = 'ntoken';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
  private headers = new HttpHeaders({ 'Content-Type': 'application/json', 'X-Api-Key': environment.apiKey });

  constructor(private http: HttpClient) {}

  // Attempt login via backend. Expect response { ntoken: string, ... }
  login(email: string, password: string): Observable<any> {
    const payload = { email, password };
    return this.http.post(`${this.apiUrl}/api/usuario/IniciarSesion`, payload, { headers: this.headers }).pipe(
      map((res: any) => {
        const token = res?.ntoken || res?.token || res?.idToken || null;
        if (token) {
          localStorage.setItem(TOKEN_KEY, token);
        }
        // store user payload if returned
        try {
          // The backend may return the user under different keys, or return the user object at root.
          let user = res?.user || res?.usuario || res?.data || null;
          // if response itself looks like a user object (has id or usua_usuario etc), treat it as user
          const looksLikeUser = (obj: any) => {
            if (!obj || typeof obj !== 'object') return false;
            return !!(obj.Id || obj.id || obj._id || obj.usua_usuario || obj.usua_creacion || obj.role_nombre || obj.token);
          };
          if (!user && looksLikeUser(res)) {
            user = res;
          }
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
          }
        } catch (e) {}
        return res;
      }),
      catchError(err => { throw err; })
    );
  }

  // Logout helper: clear token and stored user info
  logout() {
    try { localStorage.removeItem(TOKEN_KEY); } catch (e) {}
    try { localStorage.removeItem('user'); } catch (e) {}
  }

  // Store token manually if login happens elsewhere (firebase sdk)
  setToken(token: string) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getUser(): any | null {
    const s = localStorage.getItem('user');
    if (!s) return null;
    try { return JSON.parse(s); } catch (e) { return null; }
  }

  // Return the canonical user id from stored user object if available
  getUserId(): string | null {
    const user = this.getUser();
    if (user) {
      // common id fields used across the project/backends
      const id = (user.Id || user.id || user._id || user.usua_Id || user.userId || null) as string | null;
      if (id) return id;
    }

    // If no stored user object, try to decode JWT token payload for common id claims
    const token = this.getToken();
    if (token && this.isJwt(token)) {
      try {
        const payload = JSON.parse(atob(this.padBase64(token.split('.')[1])));
        // common claim names
        const claimId = payload.user_id || payload.userId || payload.uid || payload.sub || payload.Id || payload.id || null;
        if (claimId) return claimId as string;
      } catch (e) {
        // ignore
      }
    }

    return null;
  }

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const t = this.getToken();
    if (!t) return false;
    // If token looks like JWT, check exp
    if (this.isJwt(t)) {
      try {
        const payload = JSON.parse(atob(this.padBase64(t.split('.')[1])));
        const exp = payload.exp;
        if (exp) {
          const now = Math.floor(Date.now() / 1000);
          return exp > now;
        }
      } catch (e) {
        return true; // can't parse, assume valid
      }
    }
    // otherwise assume token present = logged in
    return true;
  }

  // If you want server validation
  validateToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) return of(false);
    return this.http.post(`${this.apiUrl}/api/auth/validate`, { token }, { headers: this.headers }).pipe(
      map((res: any) => !!(res && (res.valid === true || res.ok === true || res.success === true))),
      catchError(() => of(false))
    );
  }

  private isJwt(token: string): boolean {
    return token.split('.').length === 3;
  }

  // pad base64 string for atob
  private padBase64(b: string) {
    // base64url -> base64
    b = b.replace(/-/g, '+').replace(/_/g, '/');
    while (b.length % 4) b += '=';
    return b;
  }
}
