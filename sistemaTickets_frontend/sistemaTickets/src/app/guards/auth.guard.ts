import { Injectable } from '@angular/core';
import {  Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard  {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean | UrlTree {
    // debug
    console.log('[AuthGuard] canActivate -> url=', state.url);
    // If token local check passes, allow immediately
    const local = this.auth.isLoggedIn();
    console.log('[AuthGuard] isLoggedIn=', local);
    if (local) return true;

    // Otherwise attempt server-side validation (if available)
    console.log('[AuthGuard] attempting server-side validateToken');
    return this.auth.validateToken().pipe(
      map(valid => {
        console.log('[AuthGuard] validateToken result=', valid);
        if (valid) return true;
        // return an UrlTree so the router redirects cleanly
        return this.router.parseUrl('/login?returnUrl=' + encodeURIComponent(state.url));
      }),
      catchError((e) => {
        console.warn('[AuthGuard] validateToken error', e);
        return of(this.router.parseUrl('/login?returnUrl=' + encodeURIComponent(state.url)));
      })
    );
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean | UrlTree {
    // Delegate to canActivate so child routes are protected the same way
    return this.canActivate(childRoute, state);
  }
}
