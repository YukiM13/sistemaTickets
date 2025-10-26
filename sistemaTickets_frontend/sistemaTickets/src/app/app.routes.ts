import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { TicketListComponent } from './pages/tickets/list/ticket-list.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';

@Component({
  template: `<h1>Dashboard</h1>`,
  standalone: true
})
export class DashboardComponent {}

@Component({
  template: `<h1>Tickets</h1>`,
  standalone: true
})
export class TicketsComponent {}

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'tickets', component: TicketListComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/tickets', pathMatch: 'full' },
  { path: '**', redirectTo: '/tickets' }
];
