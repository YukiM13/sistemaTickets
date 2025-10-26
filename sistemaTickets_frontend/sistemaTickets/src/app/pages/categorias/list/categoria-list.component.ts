import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ActionMenuModule } from '../../../shared/components/action-menu/action-menu.module';
import { MessageService } from 'primeng/api';
import { CategoriaService } from '../../../services/categoria.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, ToastModule, ProgressSpinnerModule, ActionMenuModule],
  providers: [MessageService],
  templateUrl: './categoria-list.component.html',
  styleUrls: ['./categoria-list.component.scss']
})
export class CategoriaListComponent implements OnInit {
  categorias: any[] = [];
  isLoading = false;
  showDialog = false;
  saving = false;
  editing: any = null;
  model: any = { cate_nombre: '' };
  // Delete modal state
  showDeleteDialog = false;
  deleteCandidate: any = null;

  constructor(private service: CategoriaService, private messageService: MessageService, private auth: AuthService) {}

  // Return type as any to avoid strict template type-checking mismatches with ActionMenuItem union types
  getActionMenuItems(cat: any): any {
    return [
      { label: 'Editar', icon: 'pi pi-pencil', action: 'edit' },
      { label: 'Eliminar', icon: 'pi pi-trash', action: 'delete', severity: 'danger' }
    ];
  }

  onActionMenuClick(event: any) {
    const action = event.action;
    const data = event.data;
    if (action === 'edit') this.edit(data);
    if (action === 'delete') this.confirmDelete(data);
  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.isLoading = true;
    this.service.listarCategorias().subscribe({
      next: (res) => {
        if (Array.isArray(res)) this.categorias = res;
        else if (res && Array.isArray(res.data)) this.categorias = res.data;
        else if (res && Array.isArray(res.response)) this.categorias = res.response;
        else this.categorias = [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando categorias', err);
        this.categorias = [];
        this.isLoading = false;
      }
    });
  }

  openNew() {
    this.editing = null;
    this.model = { cate_nombre: '' };
    this.showDialog = true;
  }

  edit(cat: any) {
    this.editing = cat;
    this.model = { cate_nombre: cat.cate_nombre || cat.nombre || '' };
    this.showDialog = true;
  }

  save() {
    if (!this.model || !this.model.cate_nombre || !this.model.cate_nombre.toString().trim()) return;
    this.saving = true;
    const userId = this.auth.getUserId();
    if (this.editing) {
      const payload = {
        Id: this.editing.Id || this.editing.id || this.editing.cate_id,
        cate_nombre: this.model.cate_nombre,
        usua_modificacion: userId || null,
        cate_fechaModificacion: new Date()
      };
      this.service.actualizarCategoria(payload).subscribe({
        next: (res) => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Categoría actualizada', life: 3000 });
          this.showDialog = false;
          this.saving = false;
          this.load();
        },
        error: (err) => {
          console.error('Error actualizando categoria', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar', life: 4000 });
          this.saving = false;
        }
      });
    } else {
      const payload = {
        cate_nombre: this.model.cate_nombre,
        usua_creacion: userId || null,
        cate_fechaCreacion: new Date()
      };
      this.service.crearCategoria(payload).subscribe({
        next: (res) => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Categoría creada', life: 3000 });
          this.showDialog = false;
          this.saving = false;
          this.load();
        },
        error: (err) => {
          console.error('Error creando categoria', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear', life: 4000 });
          this.saving = false;
        }
      });
    }
  }

  /**
   * Trigger the confirm-delete modal for the given category.
   */
  confirmDelete(cat: any) {
    this.deleteCandidate = cat;
    this.showDeleteDialog = true;
  }

  /**
   * Called when the user confirms deletion in the modal.
   */
  proceedDelete() {
    const cat = this.deleteCandidate;
    const id = cat?.Id || cat?.id || cat?.cate_id;
    if (!id) {
      this.showDeleteDialog = false;
      this.deleteCandidate = null;
      return;
    }
    this.service.eliminarCategoria(id).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Categoría eliminada', life: 3000 });
        this.showDeleteDialog = false;
        this.deleteCandidate = null;
        this.load();
      },
      error: (err) => {
        console.error('Error eliminando categoria', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar', life: 4000 });
        this.showDeleteDialog = false;
        this.deleteCandidate = null;
      }
    });
  }

  cancelDelete() {
    this.showDeleteDialog = false;
    this.deleteCandidate = null;
  }
}
