import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { UsuarioService } from '../../../services/usuario_services';
import { ActionMenuItem } from '../../../shared/components/action-menu/action-menu.component';
import { ActionMenuConfigService } from '../../../services/action-menu-config.service';
import { finalize } from 'rxjs/operators';
import { UsuarioCreateComponent } from '../../usuarios/create/usuarioCreate.component';
@Component({
    templateUrl: './usuarioList.component.html',
    styleUrls: ['./usuarioList.component.scss']
})
export class UsuarioListComponent implements OnInit {
    constructor(
        private usuarioService: UsuarioService,
        private actionMenuConfigService: ActionMenuConfigService
    ) { }
    usuarios: any[] = [];
    // ya no usamos pestañas (docentes/alumnos) — mostramos la lista completa que devuelve el backend
    isLoading: boolean = false; // Estado de carga
    
    // Acciones del menú desplegable
    actionMenuItems: ActionMenuItem[] = [];
    // Modal/new user
    showNewModal: boolean = false;
    creatingUser: boolean = false;
    newUsuario: any = { usua_usuario: '', email: '', role_nombre: '', usua_EsAdmin: false };
    @Output() openNew: EventEmitter<void> = new EventEmitter();
    @ViewChild('userCreate') userCreate!: UsuarioCreateComponent;
    listarUsuarios() {
        this.isLoading = true; // Iniciar el spinner
        
        this.usuarioService.listarUsuarios().subscribe({
            next: (response) => {
                console.log('Respuesta completa del servicio:', response);
                console.log('Tipo de respuesta:', typeof response);
                
                // The backend may return either an array or an object with a `data` array.
                if (Array.isArray(response)) {
                    this.usuarios = response;
                    console.log('Respuesta es array directo, usuarios:', this.usuarios);
                } else if (response && response.data && Array.isArray(response.data)) {
                    this.usuarios = response.data;
                    console.log('Respuesta tiene propiedad data, usuarios:', this.usuarios);
                } else if (response && Array.isArray(response.response)) {
                    // fallback shape
                    this.usuarios = response.response;
                } else {
                    console.warn('La respuesta no es un array válido, asignando vacío:', response);
                    this.usuarios = [];
                }
                console.log('Total usuarios asignados:', this.usuarios.length);
                
                // Log para ver qué campos de imagen tienen los usuarios
                this.usuarios.forEach((usuario, index) => {
                    console.log(`Usuario ${index + 1}:`, {
                        usua_IMg: usuario.usua_IMg,
                        usua_ImagenUrl: usuario.usua_ImagenUrl,
                        usua_Usuario: usuario.usua_usuario
                    });
                });
                
                // Pequeño delay para mostrar el spinner (opcional, remover en producción)
                setTimeout(() => {
                    this.isLoading = false; // Detener el spinner
                }, 300);
            },
            error: (error) => {
                console.error('Error al listar usuarios:', error);
                this.usuarios = [];
                setTimeout(() => {
                    this.isLoading = false; // Detener el spinner también en caso de error
                }, 300);
            }
        });
    }

    ngOnInit() {
        // Inicializar las acciones del menú usando el servicio
        this.actionMenuItems = this.actionMenuConfigService.getUsuarioActions();
        this.listarUsuarios();
    }

    // Create new user (from modal)
    crearUsuario() {
        if (!this.newUsuario || !this.newUsuario.usua_usuario) {
            console.warn('Datos incompletos para crear usuario', this.newUsuario);
            return;
        }

        this.creatingUser = true;
        this.usuarioService.crearUsuario(this.newUsuario)
            .pipe(finalize(() => this.creatingUser = false))
            .subscribe({
                next: (res) => {
                    console.log('Usuario creado:', res);
                    // Refrescar lista para que el nuevo usuario aparezca
                    this.showNewModal = false;
                    // Reset form
                    this.newUsuario = { usua_usuario: '', email: '', role_nombre: '', usua_EsAdmin: false };
                    this.listarUsuarios();
                },
                error: (err) => {
                    console.error('Error creando usuario:', err);
                }
            });
    }

    // Called when the left 'Nuevo' button is pressed; emit to parent so modal can live elsewhere
    openCreate() {
        // prefer emitting so a parent or a higher-level component can manage the modal
        this.openNew.emit();
        // If the embedded create component exists, open it directly (fallback)
        try {
            if (this.userCreate && typeof this.userCreate.open === 'function') {
                this.userCreate.open();
                return;
            }
        } catch (e) {
            // ignore and fallback to local flag
            console.warn('No se pudo abrir el modal embebido:', e);
        }
        // fallback: set local flag in case someone uses it here
        this.showNewModal = true;
    }

    // Obtener inicial (para avatar tipo initials)
    getInitial(usuario: any): string {
        const source = usuario?.usua_usuario || usuario?.usua_Usuario || usuario?.email || usuario?.id || '';
        const s = source ? source.toString() : '';
        return s ? s.charAt(0).toUpperCase() : '';
    }

    // No filters: mostramos la lista completa tal cual la devuelve el backend

    // Ya no manejamos imágenes; el backend no las ofrece y usamos iniciales en la tabla

    // Obtener nombre (simple): priorizamos usua_usuario (campo que usas en backend)
    getNombreCompleto(usuario: any): string {
        if (!usuario) return 'Sin nombre';
        if (usuario.usua_usuario) return usuario.usua_usuario;
        if (usuario.usua_Usuario) return usuario.usua_Usuario;
        if (usuario.usuaM_usuario) return usuario.usuaM_usuario;
        if (usuario.usuaC_usuario) return usuario.usuaC_usuario;
        if (usuario.email) {
            const local = usuario.email.split('@')[0];
            return local.charAt(0).toUpperCase() + local.slice(1);
        }
        if (usuario.id) return usuario.id;
        return 'Sin nombre';
    }

    // Manejar acciones del menú desplegable
    onActionMenuClick(event: {action: string, data: any}) {
        const usuario = event.data;
        console.log(`Acción: ${event.action}`, usuario);

        switch (event.action) {
            case 'edit':
                this.editarUsuario(usuario);
                break;
            case 'toggle-status':
                this.cambiarEstadoUsuario(usuario);
                break;
            case 'change-class':
                this.cambiarClaseUsuario(usuario);
                break;
            case 'view':
                this.verDetallesUsuario(usuario);
                break;
            default:
                console.warn('Acción no reconocida:', event.action);
        }
    }

    // Métodos para cada acción
    editarUsuario(usuario: any) {
        console.log('Editar usuario:', usuario);
        // TODO: Navegar a la página de edición o abrir modal
        // this.router.navigate(['/usuarios/edit', usuario.usua_Id]);
    }

    cambiarEstadoUsuario(usuario: any) {
        console.log('Cambiar estado del usuario:', usuario);
        // TODO: Implementar lógica para cambiar estado (activo/inactivo)
        // Aquí podrías llamar a un servicio para actualizar el estado
    }

    cambiarClaseUsuario(usuario: any) {
        console.log('Cambiar clase del usuario:', usuario);
        // TODO: Abrir modal para seleccionar nueva clase
    }

    verDetallesUsuario(usuario: any) {
        console.log('Ver detalles del usuario:', usuario);
        // TODO: Navegar a página de detalles o abrir modal
        // this.router.navigate(['/usuarios/view', usuario.usua_Id]);
    }

    // Obtener acciones específicas para cada tipo de usuario
    getActionMenuItems(usuario: any): ActionMenuItem[] {
        // Definir condiciones para personalizar las acciones
        const conditions = {
            isDocente: (usuario.role_nombre || '').toString().toLowerCase().includes('docente'),
            entityType: 'usuario',
            isProtected: false, // Ejemplo: si el usuario no se puede eliminar
            hasRelatedRecords: false // Ejemplo: si tiene registros relacionados
        };

        // Usar el servicio para personalizar las acciones según las condiciones
        return this.actionMenuConfigService.customizeActions(this.actionMenuItems, conditions);
    }
}
