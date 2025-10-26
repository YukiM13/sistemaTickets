import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UsuarioService } from '../../../services/usuario_services';
import { RoleService } from '../../../services/role.service';
import { finalize } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-usuario-create',
    templateUrl: './usuarioCreate.component.html',
    styleUrls: ['./usuarioCreate.component.scss']
})
export class UsuarioCreateComponent implements OnInit {
    constructor(
        private usuarioService: UsuarioService,
        private roleService: RoleService
        , private messageService: MessageService
    ) { }

    // Modal/new user state
    showNewModal: boolean = false;
    creatingUser: boolean = false;
     successDialog: boolean = false;
    errorDialog: boolean = false;
    successMessage: string = '';
    errorMessage: string = '';

    // Form model (coincide con template: usua_usuario, email, password, role_id, usua_EsAdmin)
    newUsuario: any = {
        usua_usuario: '',
        email: '',
        password: '',
        role_id: null,
        role_nombre: '',
        usua_EsAdmin: false,
        usua_creacion: '7opwWTQ0zyax1sc8NTj2Yeh8HYO2',
        usua_fechaCreacion: new Date()
    };

    roles: any[] = [];
    roleOptions: { label: string, value: any }[] = [];
    formErrors: any = {};

    // Emit when a user is successfully created so the parent (list) can refresh
    @Output() created: EventEmitter<any> = new EventEmitter();

    ngOnInit() {
        this.loadRoles();
    }

    loadRoles() {
        this.roleService.listarRoles().subscribe({
            next: (res) => {
                if (Array.isArray(res)) this.roles = res;
                else if (res && Array.isArray(res.data)) this.roles = res.data;
                else if (res && Array.isArray(res.response)) this.roles = res.response;
                else this.roles = [];

                this.roleOptions = this.roles.map((r: any) => {
                    const label = r.role_nombre || r.nombre || r.name || r.rol_Nombre || r.roleName || r.label || 'Sin nombre';
                    const value = r.id ?? r.role_id ?? r.rol_Id ?? r.idRol ?? r.value ?? r;
                    return { label, value };
                });
            },
            error: (err) => {
                console.error('Error al cargar roles:', err);
                this.roles = [];
                this.roleOptions = [];
            }
        });
    }

    // Create new user (from modal)
    crearUsuario() {
        this.formErrors = {};

        if (!this.newUsuario || !this.newUsuario.usua_usuario || !this.newUsuario.usua_usuario.toString().trim()) {
            this.formErrors.usua_usuario = 'El nombre de usuario es obligatorio.';
        }
        if (!this.newUsuario || !this.newUsuario.email || !this.newUsuario.email.toString().trim()) {
            this.formErrors.email = 'El correo es obligatorio.';
        } else if (!this.newUsuario.email.includes('@')) {
            this.formErrors.email = 'El correo no parece válido.';
        }
        if (!this.newUsuario || !this.newUsuario.password || !this.newUsuario.password.toString().trim()) {
            this.formErrors.password = 'La contraseña es obligatoria.';
        }
        if (!this.newUsuario || !this.newUsuario.role_id) {
            this.formErrors.role_id = 'Debes seleccionar un rol.';
        }

        if (Object.keys(this.formErrors).length > 0) {
            return;
        }

        // Attach role_nombre from selected role
        const sel = this.roles.find((r: any) =>
            r.id === this.newUsuario.role_id ||
            r.role_id === this.newUsuario.role_id ||
            r.rol_Id === this.newUsuario.role_id ||
            r.idRol === this.newUsuario.role_id
        );
        if (sel) {
            this.newUsuario.role_nombre = sel.name || sel.role_nombre || sel.nombre || sel.rol_Nombre || sel.roleName || '';
        }

        this.creatingUser = true;

        // Prepare payload: map password field to expected backend key if needed
        const payload = {
            ...this.newUsuario,
            password: this.newUsuario.password // keep key 'password' unless backend expects 'Password'
        };

        this.usuarioService.crearUsuario(payload)
            .pipe(finalize(() => this.creatingUser = false))
            .subscribe({
               next: (res) => {
                    // close create dialog, reset form, notify parent and show success dialog
                    this.showNewModal = false;
                    this.resetForm();
                    this.created.emit(res);
                   
                    // toast
                    try {
                        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado correctamente.', life: 3000 });
                    } catch (e) {}
                },
                error: (err) => {
                    console.error('Error creando usuario:', err);
                  
                    try {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: this.errorMessage, life: 5000 });
                    } catch (e) {}
                }
            });
    }

     closeSuccess() {
        this.successDialog = false;
    }

    closeError() {
        this.errorDialog = false;
    }

    // Public method to open the dialog from parent (the list will call this)
    open() {
        this.showNewModal = true;
    }

    close() {
        this.showNewModal = false;
    }

    resetForm() {
        this.newUsuario = {
            usua_usuario: '',
            email: '',
            password: '',
            role_id: null,
            role_nombre: '',
            usua_EsAdmin: false,
            usua_creacion: '7opwWTQ0zyax1sc8NTj2Yeh8HYO2',
            usua_fechaCreacion: new Date()
        };
        this.formErrors = {};
    }

    // Obtener inicial (para avatar tipo initials)
    getInitial(usuario: any): string {
        const source = usuario?.usua_usuario || usuario?.usua_Usuario || usuario?.email || usuario?.id || '';
        const s = source ? source.toString() : '';
        return s ? s.charAt(0).toUpperCase() : '';
    }
}