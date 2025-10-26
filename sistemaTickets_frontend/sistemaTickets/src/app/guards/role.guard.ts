import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard  {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean | UrlTree {
    console.log('[RoleGuard] canActivate -> url=', state.url);
    const user = this.auth.getUser();
    console.log('[RoleGuard] current user=', user);
    if (!user) {
      console.warn('[RoleGuard] no user found, redirecting to login');
      return this.redirect(state.url);
    }

    // Check requireAdmin flag
  const requireAdmin = route.data && (route.data as any)['requireAdmin'] === true;
    if (requireAdmin) {
      const isAdmin = this.isAdmin(user);
      console.log('[RoleGuard] requireAdmin=', requireAdmin, 'isAdmin=', isAdmin);
      if (!isAdmin) return this.redirect(state.url);
      return true;
    }

    // Check roles array if provided
  const roles: string[] | undefined = route.data && (route.data as any)['roles'];
    if (Array.isArray(roles) && roles.length > 0) {
      const roleName = this.getRoleName(user);
      const normalized = (roleName || '').toString().toLowerCase();
      const ok = roles.some(r => r.toString().toLowerCase() === normalized);
      console.log('[RoleGuard] roles required=', roles, 'user role=', normalized, 'ok=', ok);
      if (!ok) return this.redirect(state.url);
    }

    return true;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(childRoute, state);
  }

  private getRoleName(user: any): string {
    return user?.role_nombre || user?.roleName || user?.rol_Nombre || user?.role || user?.role_id || '';
  }

  private isAdmin(user: any): boolean {
    if (user?.usua_EsAdmin === true || user?.usua_EsAdmin === 'true') return true;
    const r = this.getRoleName(user).toLowerCase();
    return r === 'admin' || r === 'administrador' || r === 'administration';
  }

  private redirect(url: string) {
    // redirect to login or tickets
    return this.router.parseUrl('/login');
  }
}
