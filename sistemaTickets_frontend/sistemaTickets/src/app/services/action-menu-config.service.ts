import { Injectable } from '@angular/core';
import { ActionMenuItem } from '../shared/components/action-menu/action-menu.component';

@Injectable({
  providedIn: 'root'
})
export class ActionMenuConfigService {

  // Configuraciones predefinidas para diferentes tipos de entidades
  getUsuarioActions(): ActionMenuItem[] {
    return [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        action: 'edit',
        severity: 'info'
      },
      {
        label: 'Cambiar Estado',
        icon: 'pi pi-refresh',
        action: 'toggle-status',
        severity: 'warning'
      },
      {
        label: 'Cambiar Clase',
        icon: 'pi pi-users',
        action: 'change-class',
        severity: 'info'
      },
      {
        label: 'Ver Detalles',
        icon: 'pi pi-eye',
        action: 'view',
        severity: 'primary'
      }
    ];
  }

  getProductoActions(): ActionMenuItem[] {
    return [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        action: 'edit',
        severity: 'info'
      },
      {
        label: 'Duplicar',
        icon: 'pi pi-copy',
        action: 'duplicate',
        severity: 'success'
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        action: 'delete',
        severity: 'danger'
      },
      {
        label: 'Ver Detalles',
        icon: 'pi pi-eye',
        action: 'view',
        severity: 'primary'
      }
    ];
  }

  getGenericActions(): ActionMenuItem[] {
    return [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        action: 'edit',
        severity: 'info'
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        action: 'delete',
        severity: 'danger'
      },
      {
        label: 'Ver Detalles',
        icon: 'pi pi-eye',
        action: 'view',
        severity: 'primary'
      }
    ];
  }

  // Método para personalizar acciones según condiciones
  customizeActions(baseActions: ActionMenuItem[], conditions: any): ActionMenuItem[] {
    return baseActions.map(action => ({
      ...action,
      disabled: this.isActionDisabled(action, conditions),
      visible: this.isActionVisible(action, conditions)
    }));
  }

  private isActionDisabled(action: ActionMenuItem, conditions: any): boolean {
    // Ejemplo de lógica para deshabilitar acciones
    switch (action.action) {
      case 'delete':
        return conditions.isProtected || conditions.hasRelatedRecords;
      case 'change-class':
        return conditions.isDocente === true;
      default:
        return false;
    }
  }

  private isActionVisible(action: ActionMenuItem, conditions: any): boolean {
    // Ejemplo de lógica para ocultar acciones
    switch (action.action) {
      case 'change-class':
        return conditions.entityType === 'usuario';
      default:
        return true;
    }
  }
}