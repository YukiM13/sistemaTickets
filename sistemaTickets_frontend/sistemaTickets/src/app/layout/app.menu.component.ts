import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(private auth: AuthService, private router: Router) {
        // rebuild menu on navigation end to reflect current auth state
        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => this.buildModel());
    }

    ngOnInit() {
        this.buildModel();
    }

    private buildModel() {
        const user = this.auth.getUser();
        const isAdmin = !!(user && (user.usua_EsAdmin === true || user.usua_EsAdmin === 'true'));
        // role name normalization
        const roleName = (user?.role_nombre || user?.roleName || user?.rol_Nombre || user?.role || '').toString().toLowerCase();

        // Build a single-level menu where items appear at the same level.
        const items: any[] = [];
        items.push({ label: 'Tickets', icon: 'pi pi-fw pi-ticket', routerLink: ['/tickets'] });

        if (isAdmin) {
            items.push({ label: 'Usuarios', icon: 'pi pi-fw pi-users', routerLink: ['/usuarios'] });
            items.push({ label: 'Categorias', icon: 'pi pi-fw pi-tags', routerLink: ['/categorias'] });
        }

        this.model = [
            {
                label: '',
                icon: 'pi pi-ticket',
                items: items
            }
        ];
    }
}
