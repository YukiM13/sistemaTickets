import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = [
    // Minimal routing: the demo/components folder was removed from the project.
    // Keep only the usuarios feature routes that exist in this codebase.
    {
        path: '', component: AppLayoutComponent, canActivateChild: [AuthGuard],
        children: [
            { path: '', redirectTo: 'tickets', pathMatch: 'full' },
            { path: 'usuarios', data: { breadcrumb: 'Usuarios', requireAdmin: true }, canActivate: [ RoleGuard ], loadChildren: () => import('./pages/usuarios/list/usuarioList.module').then(m => m.UsuarioModule) },
            { path: 'tickets', data: { breadcrumb: 'Tickets' }, loadComponent: () => import('./pages/tickets/list/ticket-list.component').then(c => c.TicketListComponent) },
            { path: 'categorias', data: { breadcrumb: 'Categorias', requireAdmin: true }, canActivate: [ RoleGuard ], loadComponent: () => import('./pages/categorias/list/categoria-list.component').then(c => c.CategoriaListComponent) },
            // You can add other feature routes here as you recreate them.
        ]
    },
    // Public login route
    { path: 'login', loadComponent: () => import('./pages/auth/login/login.component').then(c => c.LoginComponent) },
    // Fallback: redirect unknown routes to login
    { path: '**', redirectTo: '/login' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
