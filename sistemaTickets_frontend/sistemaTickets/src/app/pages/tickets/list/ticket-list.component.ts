import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TicketService } from '../../../services/ticket.service';
import { CategoriaService } from '../../../services/categoria.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, DropdownModule, InputTextModule, ButtonModule, ProgressSpinnerModule, DialogModule, InputTextareaModule, ToastModule],
  providers: [MessageService],
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit {
  @ViewChild('dt') dt: any;
  tickets: any[] = [];
  filteredTickets: any[] = [];
  isLoading = false;
  globalFilter = '';
  statusOptions = [
    { label: 'Todos', value: null },
    { label: 'Pendiente', value: 0 },
    { label: 'En proceso', value: 1 },
    { label: 'Finalizado', value: 2 }
  ];
  selectedStatus: number | null = null;
  private searchDebounce: any = null;

  constructor(private ticketService: TicketService, private categoriaService: CategoriaService, private messageService: MessageService, private auth: AuthService) {}

  // current user / role info
  currentUser: any = null;
  isAdmin = false;
  roleName = '';
  currentUserId: string | null = null;
  roleId: string | null = null;

  get canCreate(): boolean {
    // Collaborator and Admin can create; Support cannot create new tickets
    return !this.isSoporte;
  }

  // role helpers by id
  get isSoporte(): boolean {
    return (this.roleId || '').toString() === '5SLlvfhyZD2nzu2Rxa5L';
  }

  get isColaborador(): boolean {
    return (this.roleId || '').toString() === 'toDnE1DeD788YnovrtbV';
  }

  // new ticket modal state
  showNewModal: boolean = false;
  creatingTicket: boolean = false;
  newTicket: any = {
    tick_titulo: '',
    tick_descripcion: '',
    cate_id: '',
    cate_nombre: '',
    usua_encargadoId: '',
    usua_encargadoNombre: '',
    tick_estado: 0,
    tick_prioridad: 'Baja',
    usua_creacion: this.auth.getUserId() || this.currentUserId || '',
    tick_fechaCreacion: new Date()
  };

  priorityOptions = [
    { label: 'Baja', value: 'Baja' },
    { label: 'Media', value: 'Media' },
    { label: 'Alta', value: 'Alta' }
  ];

  // categories
  categories: any[] = [];
  categoryOptions: { label: string, value: any }[] = [];

  openNewTicket() {
    // prepare a fresh ticket and ensure creator is set to current user
    this.resetNewTicket();
    this.showNewModal = true;
  }

  closeNewTicket() {
    this.showNewModal = false;
    this.resetNewTicket();
  }

  resetNewTicket() {
    this.newTicket = {
      tick_titulo: '',
      tick_descripcion: '',
      cate_id: '',
      cate_nombre: '',
      tick_estado: 0,
      tick_prioridad: '',
      usua_creacion: this.auth.getUserId() || this.currentUserId || '',
      tick_fechaCreacion: new Date()
    };
    this.creatingTicket = false;
  }

  crearTicket() {
    // basic validation
    if (!this.newTicket || !this.newTicket.tick_titulo || !this.newTicket.tick_titulo.toString().trim()) {
      // could show inline validation; for now, just return
      return;
    }
    this.creatingTicket = true;
    // attach category name from selected id if available
    const selCat = this.categories.find(c => c.Id === this.newTicket.cate_id || c.id === this.newTicket.cate_id || c.cate_id === this.newTicket.cate_id);
    if (selCat) this.newTicket.cate_nombre = selCat.cate_nombre || selCat.nombre || selCat.name || '';

    const payload = { ...this.newTicket };
    // ensure creator is the logged-in user and creation date exists
    const userIdFromAuth = this.auth.getUserId();
    const fallbackUser = this.auth.getUser();
    const resolvedUserId = this.currentUserId || userIdFromAuth || (fallbackUser?.Id || fallbackUser?.id || fallbackUser?.usua_Id || fallbackUser?.userId || null);
    if (resolvedUserId) {
      payload.usua_creacion = resolvedUserId;
      // also set modification to the same user for initial creation
      payload.usua_modificacion = resolvedUserId;
    } else {
      // Log a warning to help debugging if no id is found
      console.warn('[TicketList] crearTicket: no se encontró userId para usua_creacion');
    }
    if (!payload.tick_fechaCreacion) payload.tick_fechaCreacion = new Date();
    // debug: print resolved id and payload before sending
    console.debug('[TicketList] crearTicket payload.usua_creacion =', payload.usua_creacion, 'resolvedUserId =', resolvedUserId);
    this.ticketService.crearTicket(payload).subscribe({
      next: (res) => {
        // refresh full list from backend to ensure canonical data
        try {
          this.listar();
        } catch (e) {
          // fallback: add locally
          this.tickets.unshift(res || payload);
          this.applyFilters();
        }
        this.creatingTicket = false;
        this.showNewModal = false;
        this.resetNewTicket();
        // show success toast
        try {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Ticket creado correctamente.', life: 3000 });
        } catch (e) {}
      },
      error: (err) => {
        console.error('Error creando ticket:', err);
        this.creatingTicket = false;
        try {
          const msg = 'Error al crear el ticket.';
          this.messageService.add({ severity: 'error', summary: 'Error', detail: msg, life: 5000 });
        } catch (e) {}
      }
    });
  }

  ngOnInit(): void {
    this.currentUser = this.auth.getUser();
    this.isAdmin = !!(this.currentUser && (this.currentUser.usua_EsAdmin === true || this.currentUser.usua_EsAdmin === 'true'));
    this.roleName = (this.currentUser?.role_nombre || this.currentUser?.roleName || this.currentUser?.rol_Nombre || this.currentUser?.role || '').toString();
    // use centralized helper to obtain user id
    this.currentUserId = this.auth.getUserId();
    // read role id if available (backend uses role_id in your sample)
    this.roleId = this.currentUser?.role_id || this.currentUser?.roleId || this.currentUser?.role || null;

    this.listar();
    this.loadCategories();
  }

  // get canonical ticket id
  private getTicketId(ticket: any): string {
    return ticket?.Id ?? ticket?.id ?? ticket?.tick_id ?? ticket?.ticketId ?? '';
  }

  // Support: take a ticket (only when estado == 0)
  takeTicket(ticket: any) {
    if (!ticket) return;
    const estado = Number(ticket.tick_estado);
    if (estado !== 0) return;
    const id = this.getTicketId(ticket);
    if (!id) return;
    const userId = this.currentUserId || this.auth.getUserId();
    if (!userId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Usuario no identificado. Por favor inicia sesión.', life: 4000 });
      return;
    }
    const payload: any = {
      Id: id,
      usua_encargadoId: userId,
      tick_estado: 1,
      usua_modificacion: userId,
      tick_fechaModificacion: new Date()
    };
    console.debug('[TicketList] tomarTicket payload =', payload);
    this.ticketService.tomarTicket(payload).subscribe({
      next: (res) => {
        // update local ticket
        ticket.usua_encargadoId = userId;
        ticket.usua_encargadoNombre = this.currentUser?.usua_usuario || this.currentUser?.name || this.currentUser?.email || ticket.usua_encargadoNombre;
        ticket.tick_estado = 1;
        ticket.usua_modificacion = userId;
        ticket.tick_fechaModificacion = new Date();
        // invalidate cached actions for this ticket so UI recalculates available actions
        try { this._actionsCache.delete(id); } catch (e) {}
        try { this._actionsCache.delete(JSON.stringify(ticket)); } catch (e) {}
        this.applyFilters();
        try { this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Ticket tomado correctamente.', life: 3000 }); } catch (e) {}
      },
      error: (err) => {
        console.error('Error al tomar ticket', err);
        try { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo tomar el ticket.', life: 4000 }); } catch (e) {}
      }
    });
  }

  // Provide available actions for a given ticket (used by dropdown in table)
  private _actionsCache: Map<string, { label: string; value: string }[]> = new Map();

  getActionsForTicket(ticket: any) {
    try {
      if (!ticket) return [];
      const id = this.getTicketId(ticket) || (ticket && JSON.stringify(ticket));
      if (this._actionsCache.has(id)) return this._actionsCache.get(id)!;
      const actions: { label: string; value: string }[] = [];
      const estado = Number(ticket?.tick_estado);
      if (estado === 0) {
        actions.push({ label: 'Tomar', value: 'take' });
      }
      const encargadoId = ticket.usua_encargadoId || ticket.usua_encargado_id || ticket.encargadoId;
      if (estado === 1 && (encargadoId === this.currentUserId || encargadoId === this.currentUser?.Id)) {
        actions.push({ label: 'Completar', value: 'complete' });
      }
      this._actionsCache.set(id, actions);
      return actions;
    } catch (e) {
      console.error('[TicketList] getActionsForTicket error', e);
      return [];
    }
  }

  onTicketAction(action: string, ticket: any) {
    if (!action || !ticket) return;
    if (action === 'take') return this.takeTicket(ticket);
    if (action === 'complete') return this.completeTicket(ticket);
  }

  // trackBy for table rows to avoid excessive DOM churn
  trackByTicket(index: number, item: any) {
    return this.getTicketId(item) || index;
  }

  // Support owner: mark as completed (only if you are the encargado and estado == 1)
  completeTicket(ticket: any) {
    if (!ticket) return;
    const estado = Number(ticket.tick_estado);
    const encargadoId = ticket.usua_encargadoId || ticket.usua_encargado_id || ticket.encargadoId;
    if (estado !== 1) return;
    const userId = this.currentUserId || this.auth.getUserId();
    if (!userId || encargadoId !== userId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Solo el encargado puede completar el ticket.', life: 4000 });
      return;
    }
    const id = this.getTicketId(ticket);
    if (!id) return;
    const payload: any = {
      Id: id,
      usua_encargadoId: userId,
      tick_estado: 2,
      usua_modificacion: userId,
      tick_fechaModificacion: new Date()
    };
    console.debug('[TicketList] completarTicket payload =', payload);
    this.ticketService.tomarTicket(payload).subscribe({
      next: (res) => {
        ticket.tick_estado = 2;
        ticket.usua_modificacion = userId;
        ticket.tick_fechaModificacion = new Date();
        // invalidate cached actions for this ticket so UI recalculates available actions
        try { this._actionsCache.delete(id); } catch (e) {}
        try { this._actionsCache.delete(JSON.stringify(ticket)); } catch (e) {}
        this.applyFilters();
        try { this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Ticket marcado como completado.', life: 3000 }); } catch (e) {}
      },
      error: (err) => {
        console.error('Error al completar ticket', err);
        try { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo completar el ticket.', life: 4000 }); } catch (e) {}
      }
    });
  }

  loadCategories() {
    this.categoriaService.listarCategorias().subscribe({
      next: (res) => {
        if (Array.isArray(res)) this.categories = res;
        else if (res && Array.isArray(res.data)) this.categories = res.data;
        else if (res && Array.isArray(res.response)) this.categories = res.response;
        else this.categories = [];
        this.categoryOptions = this.categories.map((c: any) => ({ label: c.cate_nombre || c.nombre || c.name || 'Sin nombre', value: c.Id ?? c.id ?? c.cate_id ?? c }));
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
        this.categories = [];
        this.categoryOptions = [];
      }
    });
  }

  listar() {
    this.isLoading = true;
    this.ticketService.listarTickets().subscribe({
      next: (res) => {
        // backend might return array or { data: [] }
        if (Array.isArray(res)) this.tickets = res;
        else if (res && Array.isArray(res.data)) this.tickets = res.data;
        else if (res && Array.isArray(res.response)) this.tickets = res.response;
        else this.tickets = [];
        // initialize filtered list
        this.filteredTickets = [...this.tickets];
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error listando tickets:', err);
        this.tickets = [];
        this.filteredTickets = [];
        this.isLoading = false;
      }
    });
  }

  onStatusChange() {
    this.applyFilters();
  }

  onGlobalFilter(event: any) {
    const val = (event.target as HTMLInputElement).value;
    this.globalFilter = val;
    // debounce to avoid filtering on every keystroke
    if (this.searchDebounce) clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      this.applyFilters();
    }, 200);
  }

  applyFilters() {
    // start from full list
    let list = this.tickets || [];

    // filter by status if selected
    if (this.selectedStatus !== null && this.selectedStatus !== undefined) {
      list = list.filter(t => Number(t.tick_estado) === Number(this.selectedStatus));
    }

    // global search across several fields
    const q = (this.globalFilter || '').toString().trim().toLowerCase();
    if (q) {
      list = list.filter(t => {
        const fields = [t.tick_titulo, t.tick_descripcion, t.cate_nombre, t.usuaC_usuario, t.usua_encargadoNombre];
        return fields.some(f => (f || '').toString().toLowerCase().includes(q));
      });
    }

    this.filteredTickets = list;
  }

  // helper to display estado text
  estadoLabel(e: number) {
    switch (e) {
      case 0: return 'Pendiente';
      case 1: return 'En proceso';
      case 2: return 'Finalizado';
      default: return 'Desconocido';
    }
  }
}
